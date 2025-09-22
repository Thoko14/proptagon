#!/usr/bin/env python3
import os
import sys
import json
import itertools
import logging
from decimal import Decimal, InvalidOperation
from typing import Any, Dict, Iterable, List, Optional

import boto3
from botocore.config import Config


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)


def to_decimal_if_number(value: Any) -> Any:
    """
    Convert numeric-looking values to Decimal; keep others as-is.
    Treat empty strings and 'np' (case-insensitive) as None (NULL in DynamoDB).
    Recursively coerces lists and dicts.
    """
    if value is None:
        return None

    if isinstance(value, (int, float, Decimal)):
        try:
            return Decimal(str(value))
        except InvalidOperation:
            return value

    if isinstance(value, bool):
        return value

    if isinstance(value, list):
        return [to_decimal_if_number(item) for item in value]

    if isinstance(value, dict):
        return {k: to_decimal_if_number(v) for k, v in value.items()}

    if not isinstance(value, str):
        return value

    s = value.strip()
    if s == "" or s.lower() == "np":
        return None

    try:
        # allow numeric strings like "123", "123.0", "-33.942627"
        if s.count(".") <= 1 and s.replace("-", "", 1).replace(".", "", 1).isdigit():
            return Decimal(s)
    except InvalidOperation:
        pass

    return value


def coerce_item(raw: Dict[str, Any]) -> Dict[str, Any]:
    item: Dict[str, Any] = {}

    for key, value in raw.items():
        item[key] = to_decimal_if_number(value)

    # Build the primary key
    school_code = raw.get("School_code")
    age_id = raw.get("AgeID")
    school_id: Optional[str]
    if school_code not in (None, ""):
        school_id = str(school_code).strip()
    elif age_id not in (None, ""):
        school_id = str(age_id).strip()
    else:
        school_id = None

    if not school_id:
        raise ValueError("Missing School_code/AgeID; cannot create school_id")

    item["school_id"] = school_id

    # Convenience attributes
    name = raw.get("School_name")
    if name:
        item["name_lc"] = str(name).lower()

    return item


def chunked(iterable: Iterable[Any], size: int) -> Iterable[List[Any]]:
    iterator = iter(iterable)
    while True:
        batch = list(itertools.islice(iterator, size))
        if not batch:
            return
        yield batch


def load_items(
    table_name: str,
    json_path: str,
    aws_region: Optional[str] = None,
    log_every: int = 100,
) -> None:
    session = (
        boto3.session.Session(region_name=aws_region)
        if aws_region
        else boto3.session.Session()
    )
    dynamodb = session.resource(
        "dynamodb",
        config=Config(retries={"max_attempts": 10, "mode": "standard"}),
    )
    table = dynamodb.Table(table_name)

    if not os.path.exists(json_path):
        logging.error(f"JSON not found: {json_path}")
        sys.exit(1)

    logging.info(f"Loading JSON: {json_path}")
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        logging.error("Expected the JSON file to contain an array of objects")
        sys.exit(1)

    total = len(data)
    logging.info(f"Records in file: {total}")

    written = 0
    skipped = 0

    with table.batch_writer(overwrite_by_pkeys=["school_id"]) as batch_writer:
        for i, raw in enumerate(data, start=1):
            try:
                item = coerce_item(raw)
                batch_writer.put_item(Item=item)
                written += 1
            except Exception as exc:  # noqa: BLE001 - log and continue
                logging.warning(f"Skip row {i}: {exc}")
                skipped += 1

            if i % log_every == 0:
                logging.info(f"Processed {i}/{total} …")

    logging.info(f"Done. Written: {written}, Skipped: {skipped}, Total: {total}")


def parse_args():
    import argparse

    parser = argparse.ArgumentParser(
        description="Load a JSON array of school records into a DynamoDB table",
    )
    parser.add_argument(
        "--table",
        dest="table_name",
        default=os.environ.get("TABLE_NAME", "schools"),
        help="DynamoDB table name (default: env TABLE_NAME or 'schools')",
    )
    parser.add_argument(
        "--json",
        dest="json_path",
        default=os.environ.get("JSON_PATH", "collections.json"),
        help="Path to JSON file (default: env JSON_PATH)",
    )
    parser.add_argument(
        "--region",
        dest="aws_region",
        default=os.environ.get("AWS_REGION"),
        help="AWS region, e.g. ap-southeast-2 (default: env AWS_REGION)",
    )
    parser.add_argument(
        "--log-every",
        dest="log_every",
        type=int,
        default=int(os.environ.get("LOG_EVERY", "100")),
        help="Progress log interval (default: 100)",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    load_items(
        table_name=args.table_name,
        json_path=args.json_path,
        aws_region=args.aws_region,
        log_every=args.log_every,
    )


if __name__ == "__main__":
    main()


