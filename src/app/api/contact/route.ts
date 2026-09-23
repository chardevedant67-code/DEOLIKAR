import { NextResponse } from "next/server";
import { CONTACT } from "@/lib/contact";

interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  requirement: string;
  message: string;
  company_url?: string;
}

const PHONE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_BODY_BYTES = 10_000;

function isValidPayload(body: unknown): body is ContactPayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  const text = (value: unknown, max: number) =>
    typeof value === "string" && value.trim().length > 0 && value.length <= max;
  return (
    text(b.name, 120) &&
    typeof b.phone === "string" &&
    PHONE_RE.test(b.phone.trim()) &&
    typeof b.email === "string" &&
    b.email.length <= 200 &&
    EMAIL_RE.test(b.email.trim()) &&
    text(b.requirement, 80) &&
    text(b.message, 3000)
  );
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success so bots learn nothing.
  if (typeof body.company_url === "string" && body.company_url.trim() !== "") {
    return NextResponse.json({ ok: true, delivered: true });
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // No email provider configured: report `delivered: false` so the site can offer the
    // visitor a WhatsApp / email hand-off instead of claiming the request was received.
    console.log("[contact] RESEND_API_KEY not configured; enquiry was not emailed.", {
      name: body.name,
      requirement: body.requirement,
    });
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const fromAddress = process.env.CONTACT_FROM_EMAIL || "Deolikar Wealth Website <onboarding@resend.dev>";
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: CONTACT.email,
        reply_to: body.email,
        subject: `New Consultation Request — ${body.name}`.slice(0, 200),
        html: `
          <h2>New Consultation Request</h2>
          <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(body.phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
          <p><strong>Investment Requirement:</strong> ${escapeHtml(body.requirement)}</p>
          <p><strong>Message:</strong><br/>${escapeHtml(body.message).replace(/\n/g, "<br/>")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[contact] Resend API error:", res.status, detail);
      return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contact] Failed to send enquiry email:", err);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
