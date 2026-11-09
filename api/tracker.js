// Private endpoint for the /tracker page. Needs the TRACKER_PASSWORD you set in Vercel.
import { clean, readBody, redis, storeReady } from "./_store.js";
import { timingSafeEqual } from "node:crypto";

function allowed(req) {
  const pass = process.env.TRACKER_PASSWORD || "";
  const given = String(req.headers["x-tracker-key"] || "");
  if (!pass || given.length !== pass.length) return false;
  return timingSafeEqual(Buffer.from(given), Buffer.from(pass));
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (!storeReady() || !process.env.TRACKER_PASSWORD) {
    return res.status(503).json({ setup: { storage: storeReady(), password: Boolean(process.env.TRACKER_PASSWORD) } });
  }
  if (!allowed(req)) return res.status(401).json({ error: "wrong password" });

  try {
    if (req.method === "GET") {
      const [visits, links] = await redis([
        ["LRANGE", "visits", 0, 19999],
        ["HGETALL", "links"],
      ]);
      const linkObj = {};
      for (let i = 0; i < (links || []).length; i += 2) {
        try {
          linkObj[links[i]] = JSON.parse(links[i + 1]);
        } catch {
          /* skip */
        }
      }
      return res.status(200).json({
        visits: (visits || []).map((v) => {
          try {
            return JSON.parse(v);
          } catch {
            return null;
          }
        }).filter(Boolean),
        links: linkObj,
      });
    }
    const b = readBody(req);
    const slug = clean(b.slug, 80);
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) return res.status(400).json({ error: "bad link name" });
    if (req.method === "POST") {
      const link = { name: clean(b.name, 80) || slug, company: clean(b.company, 80) || "", channel: clean(b.channel, 20) || "", created: Date.now() };
      await redis([["HSET", "links", slug, JSON.stringify(link)]]);
      return res.status(200).json({ ok: true, slug, link });
    }
    if (req.method === "DELETE") {
      await redis([["HDEL", "links", slug]]);
      return res.status(200).json({ ok: true });
    }
    return res.status(405).end();
  } catch (e) {
    return res.status(500).json({ error: String(e.message || e) });
  }
}
