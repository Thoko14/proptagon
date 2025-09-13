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

      // HTML welcome email template
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Proptagon</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            padding: 40px 20px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .header::before {
            content: '🎉';
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 24px;
            opacity: 0.8;
        }
        .header::after {
            content: '🏠';
            position: absolute;
            bottom: 20px;
            left: 30px;
            font-size: 20px;
            opacity: 0.8;
        }
        .logo {
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            text-decoration: none;
        }
        .welcome-badge {
            background-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            display: inline-block;
            margin-top: 10px;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #1f2937;
            text-align: center;
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #4b5563;
        }
        .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        .feature-card {
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
        }
        .feature-icon {
            font-size: 32px;
            margin-bottom: 12px;
            display: block;
        }
        .feature-title {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
        }
        .feature-desc {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
        }
        .cta-section {
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .cta-button:hover {
            background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        }
        .timeline {
            background-color: #f9fafb;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
        }
        .timeline h3 {
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
        }
        .timeline-item {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            padding: 12px;
            background-color: #ffffff;
            border-radius: 8px;
            border-left: 4px solid #0ea5e9;
        }
        .timeline-icon {
            font-size: 20px;
            margin-right: 12px;
        }
        .timeline-text {
            flex: 1;
            font-size: 14px;
            color: #4b5563;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 8px 0;
            font-size: 14px;
            color: #6b7280;
        }
        .unsubscribe-link {
            color: #6b7280;
            text-decoration: none;
        }
        .unsubscribe-link:hover {
            color: #374151;
        }
        @media (max-width: 600px) {
            .content {
                padding: 30px 20px;
            }
            .header {
                padding: 30px 20px;
            }
            .features-grid {
                grid-template-columns: 1fr;
            }
            .cta-button {
                display: block;
                width: 100%;
                box-sizing: border-box;
            }
            .timeline {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">Proptagon</h1>
            <div class="welcome-badge">You're In! 🎉</div>
        </div>
        
        <div class="content">
            <div class="greeting">
                Welcome to the Proptagon Waitlist!
            </div>
            
            <div class="message">
                <p>Congratulations! Your email has been confirmed and you're now officially part of the Proptagon community. We're thrilled to have you on this journey with us.</p>
                
                <p>You're among the first to join our waitlist, which means you'll get early access to our revolutionary property investment platform when we launch.</p>
            </div>

            <div class="features-grid">
                <div class="feature-card">
                    <span class="feature-icon">📈</span>
                    <div class="feature-title">Grow Module</div>
                    <div class="feature-desc">Discover high-potential suburbs with data-driven insights</div>
                </div>
                <div class="feature-card">
                    <span class="feature-icon">💰</span>
                    <div class="feature-title">Invest Module</div>
                    <div class="feature-desc">Make informed decisions with advanced calculators</div>
                </div>
                <div class="feature-card">
                    <span class="feature-icon">🎯</span>
                    <div class="feature-title">Strategise Module</div>
                    <div class="feature-desc">Tailor strategies to your risk profile and goals</div>
                </div>
                <div class="feature-card">
                    <span class="feature-icon">🏠</span>
                    <div class="feature-title">Manage & Sell</div>
                    <div class="feature-desc">Optimize your portfolio and exit strategies</div>
                </div>
            </div>

            <div class="timeline">
                <h3>What Happens Next?</h3>
                <div class="timeline-item">
                    <span class="timeline-icon">📧</span>
                    <div class="timeline-text">We'll send you regular updates on our development progress</div>
                </div>
                <div class="timeline-item">
                    <span class="timeline-icon">🚀</span>
                    <div class="timeline-text">You'll be among the first to know when we launch</div>
                </div>
                <div class="timeline-item">
                    <span class="timeline-icon">⭐</span>
                    <div class="timeline-text">Early access opportunities for waitlist members</div>
                </div>
                <div class="timeline-item">
                    <span class="timeline-icon">💡</span>
                    <div class="timeline-text">Exclusive property investment insights and tips</div>
                </div>
            </div>

            <div class="cta-section">
                <h3 style="color: #1f2937; margin-bottom: 16px;">Explore What's Coming</h3>
                <p style="color: #4b5563; margin-bottom: 20px;">Get familiar with our platform and start thinking about your property investment strategy.</p>
                <a href="${process.env.SITE_URL || 'https://proptagon.com'}" class="cta-button">Visit Proptagon</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Proptagon</strong> - Smart Property Investment Platform</p>
            <p>Making property investing accessible, transparent, and data-driven.</p>
            <p>
                <a href="${unsubscribeUrl}" class="unsubscribe-link">Unsubscribe</a> | 
                <a href="${process.env.SITE_URL || 'https://proptagon.com'}" class="unsubscribe-link">Visit Website</a>
            </p>
        </div>
    </div>
</body>
</html>`;

      await ses.send(new SendEmailCommand({
        Source: process.env.SES_FROM,
        Destination: { ToAddresses: [email] },
        Message: { 
          Subject: { Data: subject }, 
          Body: { 
            Text: { Data: text },
            Html: { Data: html }
          } 
        },
        ReplyToAddresses: process.env.REPLY_TO ? [process.env.REPLY_TO] : []
      }));
    } catch (e) {
      console.warn("Welcome email failed:", e?.message || e);
    }

    // redirect to confirmation page
    return {
      statusCode: 302,
      headers: { Location: `${process.env.SITE_URL}/waitlist-confirmed` },
      body: ""
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Server error" };
  }
};
