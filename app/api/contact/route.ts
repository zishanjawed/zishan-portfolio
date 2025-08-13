// app/api/contact/route.ts
import { getCloudflareContext } from "@opennextjs/cloudflare";

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
};

export async function POST(req: Request) {
  const { env } = getCloudflareContext(); // Cloudflare bindings/env
  const body = (await req.json()) as Partial<ContactPayload>;

  if (!body?.turnstileToken) {
    return new Response(JSON.stringify({ ok: false, error: "missing turnstile token" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  // 1) Verify Turnstile token server-side
  const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: String(env.TURNSTILE_SECRET ?? ""),
      response: body.turnstileToken
    })
  }).then(r => r.json() as Promise<{ success: boolean; "error-codes"?: string[] }>);

  if (!verifyRes.success) {
    return new Response(
      JSON.stringify({ ok: false, error: "turnstile_failed", details: verifyRes["error-codes"] ?? [] }),
      { status: 403, headers: { "content-type": "application/json" } }
    );
  }

  // 2) (Optional) Forward to a free webhook (Slack/Discord)
  if (env.WEBHOOK_URL && body?.message) {
    await fetch(String(env.WEBHOOK_URL), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        text: `New contact message\nName: ${body.name}\nEmail: ${body.email}\nMessage: ${body.message}`
      })
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" }
  });
}
