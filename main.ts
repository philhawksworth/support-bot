import { Hono } from 'npm:hono'

// Use the Deploy environment variable for the Gmail API token
const GMAIL_ACCESS_TOKEN = Deno.env.get("GMAIL_ACCESS_TOKEN");

const app = new Hono();

app.put("/gmail/webhook", async (c) => {
  try {
    const { message } = await c.req.json();

    if (!message?.data) {
      return c.json({ error: "Invalid payload" }, 400);
    }

    const decoded = atob(message.data);
    const pubsubMessage = JSON.parse(decoded);
    const messageId = pubsubMessage.emailMessageId || pubsubMessage.messageId;

    if (!messageId) {
      return c.json({ error: "Missing message ID" }, 400);
    }

    const gmailRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${GMAIL_ACCESS_TOKEN}`,
        },
      }
    );

    if (!gmailRes.ok) {
      return c.json({ error: "Failed to fetch email" }, 500);
    }

    const email = await gmailRes.json();
    const headers = email.payload.headers;
    const subject = headers.find((h: any) => h.name === "Subject")?.value || "No Subject";

    const plainPart = email.payload.parts?.find((p: any) => p.mimeType === "text/plain") || email.payload;
    const bodyBase64 = plainPart.body.data || "";
    const body = atob(bodyBase64.replace(/-/g, '+').replace(/_/g, '/'));

    console.log("📬 Subject:", subject);
    console.log("📝 Body:", body);

    return c.json({ status: "Email logged" });
  } catch (err) {
    console.error("❌ Error:", err);
    return c.json({ error: "Server error" }, 500);
  }
});

Deno.serve(app.fetch);
