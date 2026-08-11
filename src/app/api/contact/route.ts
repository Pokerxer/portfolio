import { NextResponse } from "next/server";
import { escapeHtml } from "@/lib/escapeHtml";
import { validateContact } from "@/lib/validate";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

// Best-effort only: Fluid Compute reuses instances across requests but gives no
// shared state, so this limits a single warm instance, not the deployment.
// Vercel BotID or Firewall is the real control.
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }

  recent.push(now);
  hits.set(key, recent);
  return false;
}

export async function POST(request: Request) {
  try {
    const key =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (rateLimited(key)) {
      return NextResponse.json(
        { error: "Too many messages. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const result = validateContact(await request.json());

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { name, email, message } = result.data;

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === "re_xxx" || apiKey.startsWith("re_xxxx")) {
      // Demo mode — log and succeed, so the form still works without a key.
      console.log("=== Contact Form Submission (Demo) ===");
      console.log(`Name: ${escapeHtml(name)}`);
      console.log(`Email: ${escapeHtml(email)}`);
      console.log(`Message: ${escapeHtml(message)}`);
      console.log("=========================================");

      return NextResponse.json(
        { success: true, message: "Message sent successfully! (Demo mode)" },
        { status: 200 }
      );
    }

    // Import Resend only when a key is configured.
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    // Every interpolated value is escaped. Previously these went in raw, so a
    // sender could inject arbitrary markup into the inbox.
    const safe = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      message: escapeHtml(message),
    };

    const { error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: "jrwaldehzx@gmail.com",
      subject: `Portfolio Contact: ${safe.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; line-height: 1.6; color: #111110; background: #faf9f7; }
            .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
            .header { border-bottom: 1px solid #e0ded8; padding-bottom: 16px; }
            .eyebrow { font-family: ui-monospace, monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #d6421f; margin: 0 0 8px; }
            .title { margin: 0; font-size: 22px; letter-spacing: -0.02em; }
            .field { margin-top: 24px; }
            .label { font-family: ui-monospace, monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #6b6a66; display: block; margin-bottom: 6px; }
            .value { font-size: 15px; }
            .footer { margin-top: 32px; border-top: 1px solid #e0ded8; padding-top: 16px; font-family: ui-monospace, monospace; font-size: 11px; color: #6b6a66; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <p class="eyebrow">New message</p>
              <h1 class="title">Portfolio contact form</h1>
            </div>
            <div class="field">
              <span class="label">Name</span>
              <div class="value">${safe.name}</div>
            </div>
            <div class="field">
              <span class="label">Email</span>
              <div class="value">${safe.email}</div>
            </div>
            <div class="field">
              <span class="label">Message</span>
              <div class="value" style="white-space: pre-wrap;">${safe.message}</div>
            </div>
            <div class="footer">Sent from the portfolio contact form</div>
          </div>
        </body>
        </html>
      `,
      replyTo: email,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully!" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
