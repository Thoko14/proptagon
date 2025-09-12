const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const jwt = require("jsonwebtoken");

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "eu-north-1";
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true }
});

exports.handler = async (event) => {
  try {
    // Accept JWT in query (?token=...) or in body for POST
    const qs = event.queryStringParameters || {};
    const method = event.requestContext?.http?.method || event.httpMethod || "GET";

    let token = qs.token;
    if (!token && method === "POST" && event.body) {
      try {
        const ct = (event.headers?.["content-type"] || event.headers?.["Content-Type"] || "").toLowerCase();
        const raw = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString() : event.body;
        const body = ct.includes("application/json") ? JSON.parse(raw || "{}") : Object.fromEntries(new URLSearchParams(raw || ""));
        token = body.token;
      } catch {}
    }
    if (!token) return { statusCode: 400, body: "Missing token" };

    // Verify token (same secret as join/confirm)
    let email;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = String(decoded.e || "").toLowerCase();
    } catch {
      return { statusCode: 400, body: "Invalid or expired token" };
    }
    if (!email) return { statusCode: 400, body: "Invalid token payload" };

    // Update status
    await ddb.send(new UpdateCommand({
      TableName: process.env.WAITLIST_TABLE,
      Key: { pk: email },
      UpdateExpression: "SET #s = :unsub, unsubscribed_at = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":unsub": "unsubscribed", ":now": new Date().toISOString() }
    }));

    // Redirect to a confirmation page on your site
    const site = process.env.SITE_URL || "/";
    return { statusCode: 302, headers: { Location: `${site}/unsubscribed` }, body: "" };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};
