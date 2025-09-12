const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const jwt = require("jsonwebtoken");

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "eu-north-1";
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true }
});
const ses = new SESClient({ region: REGION });

exports.handler = async (event) => {
  try {
    const token = event.queryStringParameters?.token;
    if (!token) return { statusCode: 400, body: "Missing token" };

    // verify token and extract email
    let email;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      email = String(decoded.e || "").toLowerCase();
    } catch {
      return { statusCode: 400, body: "Invalid or expired token" };
    }
    if (!email) return { statusCode: 400, body: "Invalid token payload" };

    // mark confirmed
    await ddb.send(new UpdateCommand({
      TableName: process.env.WAITLIST_TABLE,
      Key: { pk: email },
      UpdateExpression: "SET #s = :c, confirmed_at = :now",
      ExpressionAttributeNames: { "#s": "status" },
      ExpressionAttributeValues: { ":c": "confirmed", ":now": new Date().toISOString() }
    }));

    // build unsubscribe link (90d token)
    const base = (process.env.API_BASE_URL || "").replace(/\/$/, "");
    const effectiveBase = base || (
      `${event.headers?.["x-forwarded-proto"] || "https"}://${event.headers?.host}${event.requestContext?.stage ? `/${event.requestContext.stage}` : ""}`
    );
    const unsubscribeToken = jwt.sign({ e: email }, process.env.JWT_SECRET, { expiresIn: "90d" });
    const unsubscribeUrl = `${effectiveBase}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;

    // optional welcome email incl. unsubscribe
    try {
      const subject = "Welcome to the Proptagon waitlist 🎉";
      const text = `You're confirmed — thanks for joining!

We'll invite users in waves and keep you posted.

—
Unsubscribe anytime: ${unsubscribeUrl}
`;
      await ses.send(new SendEmailCommand({
        Source: process.env.SES_FROM,
        Destination: { ToAddresses: [email] },
        Message: { Subject: { Data: subject }, Body: { Text: { Data: text } } },
        ReplyToAddresses: process.env.REPLY_TO ? [process.env.REPLY_TO] : []
      }));
    } catch (e) {
      console.warn("Welcome email failed:", e?.message || e);
    }

    // redirect to site
    return {
      statusCode: 302,
      headers: { Location: process.env.SITE_URL || "/" },
      body: ""
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};
