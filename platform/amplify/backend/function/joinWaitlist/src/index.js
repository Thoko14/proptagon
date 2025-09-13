const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const jwt = require("jsonwebtoken");

const REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "eu-north-1";
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: REGION }), {
  marshallOptions: { removeUndefinedValues: true }
});
const ses = new SESClient({ region: REGION });

function buildBaseUrl(event) {
  const fromEnv = (process.env.API_BASE_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const proto = event.headers?.["x-forwarded-proto"] || "https";
  const host = event.headers?.host;
  const stage = event.requestContext?.stage ? `/${event.requestContext.stage}` : "";
  return `${proto}://${host}${stage}`;
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    // Parse body (JSON or x-www-form-urlencoded)
    const ct = (event.headers?.["content-type"] || event.headers?.["Content-Type"] || "").toLowerCase();
    const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString() : (event.body || "");
    let body = {};
    if (ct.includes("application/json")) {
      body = raw ? JSON.parse(raw) : {};
    } else {
      const p = new URLSearchParams(raw);
      p.forEach((v, k) => (body[k] = v));
    }

    // Enhanced input validation and sanitization
    const email = String(body.email || "").trim().toLowerCase();
    const name  = (body.name || "").toString().trim();
    const source= (body.source || "hero").toString().slice(0, 64);
    const utm   = (body.utm || "").toString().slice(0, 512);
    const turnstileToken = String(body.turnstileToken || "").trim();
    const ip =
      event.requestContext?.identity?.sourceIp || // REST API (v1)
      event.requestContext?.http?.sourceIp ||     // HTTP API (v2)
      null;

    // Enhanced email validation
    if (!email) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Email address is required" }) };
    }
    
    if (email.length > 254) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Email address is too long" }) };
    }
    
    // More comprehensive email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Please enter a valid email address" }) };
    }
    
    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /data:/i,
      /vbscript:/i
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(email))) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid email format detected" }) };
    }
    
    // Check for disposable email domains
    const disposableDomains = [
      '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
      'mailinator.com', 'throwaway.email', 'temp-mail.org',
      'yopmail.com', 'maildrop.cc', 'getnada.com'
    ];
    
    const domain = email.split('@')[1];
    if (disposableDomains.includes(domain)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Please use a permanent email address" }) };
    }
    
    // Sanitize name field
    const sanitizedName = name
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .slice(0, 100); // Limit length

    // Verify Turnstile token
    if (turnstileToken) {
      try {
        const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: turnstileToken,
            remoteip: ip
          })
        });
        
        const turnstileResult = await turnstileResponse.json();
        
        if (!turnstileResult.success) {
          console.warn('Turnstile verification failed:', turnstileResult);
          return { 
            statusCode: 400, 
            headers, 
            body: JSON.stringify({ error: "Security verification failed. Please try again." }) 
          };
        }
      } catch (err) {
        console.error('Turnstile verification error:', err);
        return { 
          statusCode: 400, 
          headers, 
          body: JSON.stringify({ error: "Security verification failed. Please try again." }) 
        };
      }
    } else {
      // In production, require Turnstile token
      if (process.env.NODE_ENV === 'production') {
        return { 
          statusCode: 400, 
          headers, 
          body: JSON.stringify({ error: "Security verification required." }) 
        };
      }
    }

    const now = new Date().toISOString();
    const TableName = process.env.WAITLIST_TABLE;

    // Check if email already exists and get current status
    let existingRecord;
    try {
      const getResult = await ddb.send(new GetCommand({
        TableName,
        Key: { pk: email }
      }));
      existingRecord = getResult.Item;
    } catch (err) {
      console.error("Error checking existing record:", err);
    }

    // Handle different scenarios based on existing status
    if (existingRecord) {
      const currentStatus = existingRecord.status;
      
      if (currentStatus === "confirmed") {
        // User is already confirmed - don't send another confirmation email
        return { 
          statusCode: 200, 
          headers, 
          body: JSON.stringify({ 
            ok: true, 
            message: "You're already on our waitlist!",
            status: "already_confirmed"
          }) 
        };
      } else if (currentStatus === "pending") {
        // User is pending - update their info but don't send duplicate confirmation
        await ddb.send(new UpdateCommand({
          TableName,
          Key: { pk: email },
          UpdateExpression: "SET #n = :name, #src = :source, utm = :utm, updated_at = :now",
          ExpressionAttributeNames: { "#n": "name", "#src": "source" },
          ExpressionAttributeValues: {
            ":name": sanitizedName || null,
            ":source": source,
            ":utm": utm || null,
            ":now": now
          }
        }));
        
        return { 
          statusCode: 200, 
          headers, 
          body: JSON.stringify({ 
            ok: true, 
            message: "Please check your email for the confirmation link we sent earlier.",
            status: "already_pending"
          }) 
        };
      }
    }

    // New email - add to waitlist with pending status
    await ddb.send(new UpdateCommand({
      TableName,
      Key: { pk: email },
      UpdateExpression:
        "SET #s = :pending, #n = :name, #src = :source, utm = :utm, created_at = :now, ip = :ip",
      ExpressionAttributeNames: { "#s": "status", "#n": "name", "#src": "source" },
      ExpressionAttributeValues: {
        ":pending": "pending",
        ":name": sanitizedName || null,
        ":source": source,
        ":utm": utm || null,
        ":now": now,
        ":ip": ip
      }
    }));

    // build confirm + unsubscribe links
    const base = buildBaseUrl(event);
    const confirmToken = jwt.sign({ e: email }, process.env.JWT_SECRET, { expiresIn: "24h" });
    const confirmUrl = `${base}/confirm?token=${encodeURIComponent(confirmToken)}`;

    const unsubscribeToken = jwt.sign({ e: email }, process.env.JWT_SECRET, { expiresIn: "90d" });
    const unsubscribeUrl = `${base}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;

    // email
    const subject = "Confirm your email for Proptagon";
    const text = `Hi${sanitizedName ? " " + sanitizedName : ""},

Thanks for joining the Proptagon waitlist. Please confirm your email:

${confirmUrl}

If you didn't request this, ignore this message.

—
Unsubscribe anytime: ${unsubscribeUrl}
`;

    // HTML email template
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm your email for Proptagon</title>
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
        }
        .logo {
            color: #ffffff;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
            text-decoration: none;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1f2937;
        }
        .message {
            font-size: 16px;
            margin-bottom: 30px;
            color: #4b5563;
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
        .security-note {
            background-color: #f3f4f6;
            border-left: 4px solid #0ea5e9;
            padding: 16px;
            margin: 30px 0;
            border-radius: 0 8px 8px 0;
        }
        .security-note p {
            margin: 0;
            font-size: 14px;
            color: #6b7280;
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
            .cta-button {
                display: block;
                width: 100%;
                box-sizing: border-box;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="logo">Proptagon</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hi${sanitizedName ? " " + sanitizedName : ""},
            </div>
            
            <div class="message">
                <p>Thanks for joining the Proptagon waitlist! We're excited to have you on board.</p>
                
                <p>To complete your registration and start receiving updates about our property investment platform, please confirm your email address by clicking the button below:</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${confirmUrl}" class="cta-button">Confirm Email Address</a>
            </div>
            
            <div class="security-note">
                <p><strong>Security Note:</strong> If you didn't request to join our waitlist, you can safely ignore this email. No further action is required.</p>
            </div>
            
            <div class="message">
                <p>Once confirmed, you'll be among the first to know when we launch and get early access to our property investment tools.</p>
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

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.name || "ServerError", message: err.message || "Server error" }) };
  }
};
