// Public endpoint: the portfolio sends small visit events here.
// Stores no IP address — only approximate city/country from Vercel and the device type.
import { clean, readBody, redis, storeReady } from "./_store.js";

const TYPES = new Set(["open", "section", "action", "time"]);

function device(ua = "") {
  const mobile = /Mobi|Android|iPhone|iPod/i.test(ua);
  const tablet = /iPad|Tablet/i.test(ua);
  const browser = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "Other";
  const os = /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Other";
  const bot = /bot|crawl|spider|preview|facebookexternalhit|Slackbot|LinkedInBot|WhatsApp|TelegramBot|Twitterbot|Discordbot|HeadlessChrome/i.test(ua);
  return { kind: tablet ? "Tablet" : mobile ? "Mobile" : "Desktop", browser, os, bot };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!storeReady()) return res.status(204).end();
  const b = readBody(req);
  if (!TYPES.has(b.type)) return res.status(400).end();
  const ua = req.headers["user-agent"] || "";
  const d = device(ua);
  if (d.bot) return res.status(204).end(); // link previews and crawlers aren't real opens
  const city = req.headers["x-vercel-ip-city"];
  const event = {
    t: Date.now(),
    type: b.type,
    sid: clean(b.sid, 40),
    ref: clean(b.ref, 80) || null,
    name: clean(b.name, 140),
    path: clean(b.path, 80),
    secs: typeof b.secs === "number" ? Math.min(Math.round(b.secs), 4 * 3600) : undefined,
    referrer: clean(b.referrer, 140),
    city: city ? decodeURIComponent(city) : undefined,
    region: clean(req.headers["x-vercel-ip-country-region"], 10),
    country: clean(req.headers["x-vercel-ip-country"], 4),
    device: d.kind,
    browser: d.browser,
    os: d.os,
  };
  try {
    await redis([
      ["LPUSH", "visits", JSON.stringify(event)],
      ["LTRIM", "visits", 0, 19999],
    ]);
  } catch {
    /* never break the portfolio because of tracking */
  }
  res.status(204).end();
}
