/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */'use strict';

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "eu-north-1";
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }));

const TABLE_NAME = process.env.SCHOOLS_TABLE || 'schools';

exports.handler = async (event) => {
  try {
    const schoolId = event?.pathParameters?.['school-id'];
    if (!schoolId) {
      return response(400, { message: 'Missing path parameter: school-id' });
    }

    const { Item } = await ddb.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: { school_id: schoolId }
    }));

    if (!Item) {
      return response(404, { message: 'School not found' });
    }

    return response(200, Item);
  } catch (err) {
    console.error(err);
    return response(500, { message: 'Internal server error' });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    },
    body: JSON.stringify(body),
  };
}


