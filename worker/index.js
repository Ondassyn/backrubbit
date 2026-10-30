import { buildPushPayload } from "@block65/webcrypto-web-push";

const PUSH_HOSTS = [
  /^fcm\.googleapis\.com$/,
  /\.push\.apple\.com$/,
  /\.push\.services\.mozilla\.com$/,
  /\.notify\.windows\.com$/,
];

export default {
  async fetch(req, env) {
    const allowed = env.ALLOWED_ORIGIN.split(",").map((s) => s.trim());
    const origin = req.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin)
        ? origin
        : allowed[0],
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
    if (req.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST" || !allowed.includes(origin))
      return new Response("forbidden", { status: 403, headers: cors });

    try {
      const { subscription, title, body } = await req.json();
      const host = new URL(subscription.endpoint).hostname;
      if (!PUSH_HOSTS.some((r) => r.test(host)))
        return new Response("bad endpoint", { status: 400, headers: cors });

      const payload = await buildPushPayload(
        {
          data: JSON.stringify({
            title: String(title).slice(0, 80),
            body: String(body).slice(0, 160),
          }),
          options: { ttl: 3600, urgency: "high" },
        },
        subscription,
        {
          subject: env.VAPID_SUBJECT,
          publicKey: env.VAPID_PUBLIC_KEY,
          privateKey: env.VAPID_PRIVATE_KEY,
        },
      );
      const res = await fetch(subscription.endpoint, payload);
      return new Response(JSON.stringify({ status: res.status }), {
        status: res.ok ? 200 : 502,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    } catch {
      return new Response(String(e?.stack || e), {
        status: 500,
        headers: cors,
      });
    }
  },
};
