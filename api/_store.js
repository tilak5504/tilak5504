// Tiny client for Upstash Redis (connected through Vercel → Storage).
// Files starting with "_" are helpers, not public endpoints.

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

export const storeReady = () => Boolean(URL_ && TOKEN);

export async function redis(commands) {
  const r = await fetch(`${URL_}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`storage ${r.status}`);
  const out = await r.json();
  return out.map((x) => x.result);
}

export function readBody(req) {
  const b = req.body;
  if (!b) return {};
  if (typeof b === "string") {
    try {
      return JSON.parse(b);
    } catch {
      return {};
    }
  }
  return b;
}

export const clean = (v, n = 120) => (typeof v === "string" ? v.slice(0, n) : undefined);
