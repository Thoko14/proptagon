const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const jwt = require("jsonwebtoken");

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "eu-north-1";
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), { marshallOptions: { removeUndefinedValues: true }});
const ses = new SESClient({ region: REGION });

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const ct = (event.headers?.["content-type"] || event.headers?.["Content-Type"] || "").toLowerCase();
    const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString() : (event.body || "");
    let body = {};
    if (ct.includes("application/json")) body = raw ? JSON.parse(raw) : {};
    else { const p = new URLSearchParams(raw); p.forEach((v,k)=> body[k]=v); }

    const email = String(body.email || "").trim().toLowerCase();
    const name  = (body.name || "").toString().trim();
    const source= (body.source || "hero").toString().slice(0,64);
    const utm   = (body.utm || "").toString().slice(0,512);
    const ip =
      event.requestContext?.identity?.sourceIp ||
      event.requestContext?.http?.sourceIp ||
      null;

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Valid email is required" }) };
    }

    const now = new Date().toISOString();
    const TableName = process.env.WAITLIST_TABLE;

    // write pending
    await ddb.send(new UpdateCommand({
      TableName,
      Key: { pk: email },
      UpdateExpression:
        "SET #s = if_not_exists(#s, :pending), #n = :name, #src = :source, utm = :utm, created_at = if_not_exists(created_at, :now), ip = if_not_exists(ip, :ip)",
      ExpressionAttributeNames: { "#s": "status", "#n": "name", "#src": "source" },
      ExpressionAttributeValues: { ":pending": "pending", ":name": name || null, ":source": source, ":utm": utm || null, ":now": now, ":ip": ip }
    }));

    // sign token (24h)
    const token = jwt.sign({ e: email }, process.env.JWT_SECRET, { expiresIn: "24h" });
    const base = process.env.API_BASE_URL ||
      `${event.headers["x-forwarded-proto"] || "https"}://${event.headers["host"]}${event.requestContext?.stage ? `/${event.requestContext.stage}` : ""}`;
    const confirmUrl = `${base.replace(/\/$/,"")}/confirm?token=${encodeURIComponent(token)}`;

    const subject = "Confirm your email for Proptagon";
    const text = `Hi${name ? " " + name : ""},

Please confirm your email to join the Proptagon waitlist:

${confirmUrl}

If you didn't request this, you can ignore this email.
— Proptagon`;

    await ses.send(new SendEmailCommand({
      Source: process.env.SES_FROM,
      Destination: { ToAddresses: [email] },
      Message: { Subject: { Data: subject }, Body: { Text: { Data: text } } },
      ReplyToAddresses: process.env.REPLY_TO ? [process.env.REPLY_TO] : []
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.name || "ServerError", message: err.message || "Server error" }) };
  }
};
