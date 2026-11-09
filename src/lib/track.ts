// Visit tracking for personal links like  /to/priya-swiggy
// - records that the link was opened, which sections were seen,
//   what was clicked, and roughly how long they stayed
// - never runs for you: opening /tracker once marks this browser as "owner"

const OWNER_KEY = "tilak_owner";
const SECTIONS = ["about", "education", "experience", "internships", "skills", "projects", "proof-of-work", "contact-me"];

const store = (k: string, v?: string) => {
  try {
    if (v === undefined) return sessionStorage.getItem(k);
    sessionStorage.setItem(k, v);
  } catch {
    /* private mode */
  }
  return null;
};

export const isOwner = () => {
  try {
    return localStorage.getItem(OWNER_KEY) === "1";
  } catch {
    return false;
  }
};
export const markOwner = () => {
  try {
    localStorage.setItem(OWNER_KEY, "1");
  } catch {
    /* ignore */
  }
};

let sid = "";
let ref: string | null = null;
let enabled = false;

function send(type: string, extra: Record<string, unknown> = {}) {
  if (!enabled) return;
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, sid, ref, path: location.pathname, ...extra }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}

/** Call once, before the page renders. Returns the cleaned-up path. */
export function initTracking(): string {
  let path = location.pathname.replace(/\/+$/, "") || "/";

  // personal link: /to/<name>  (also accepts ?ref=<name>)
  // accepts anything typed after /to/ — spaces, _, capitals, dots all become dashes
  const m = path.match(/^\/to\/([^/]{1,120})$/i);
  const q = new URLSearchParams(location.search).get("ref");
  let raw = m?.[1] || q || "";
  try {
    raw = decodeURIComponent(raw);
  } catch {
    /* keep as is */
  }
  const incoming = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  if (incoming) store("tk_ref", incoming);
  if (m) {
    // show the visitor a clean address
    history.replaceState(null, "", "/" + location.hash);
    path = "/";
  }

  if (path === "/tracker" || isOwner() || new URLSearchParams(location.search).has("notrack")) return path;

  enabled = true;
  ref = store("tk_ref");
  sid = store("tk_sid") || "";
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    store("tk_sid", sid);
  }

  const openKey = "tk_open_" + path;
  if (!store(openKey)) {
    store(openKey, "1");
    send("open", { referrer: document.referrer ? new URL(document.referrer).hostname : undefined });
  }

  // which sections they actually looked at
  const seen = new Set<string>(JSON.parse(store("tk_seen") || "[]"));
  const watch = () => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting || seen.has(e.target.id)) return;
          seen.add(e.target.id);
          store("tk_seen", JSON.stringify([...seen]));
          send("section", { name: e.target.id });
        }),
      // counts a section once it crosses the middle of the screen (works for very tall sections too)
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
  };
  if (path === "/") setTimeout(watch, 1500);

  // what they clicked
  document.addEventListener(
    "click",
    (e) => {
      const el = (e.target as HTMLElement).closest("a,button") as HTMLElement | null;
      if (!el) return;
      const href = el.getAttribute("href") || "";
      const label = el.getAttribute("aria-label") || "";
      let name = "";
      if (href.includes("resume")) name = "Downloaded resume";
      else if (href.startsWith("mailto:")) name = "Clicked email";
      else if (href.includes("linkedin.com")) name = "Opened LinkedIn";
      else if (href.includes("instagram.com")) name = "Opened Instagram";
      else if (href.startsWith("/photography")) name = "Went to the Darkroom";
      else if (/blog/.test(href)) name = "Read blog: " + (el.querySelector("h4")?.textContent || href);
      else if (label.startsWith("Play ")) name = "Played: " + label.slice(5);
      else if (label.startsWith("Open ")) name = "Opened photo: " + label.slice(5);
      if (name) send("action", { name });
    },
    true
  );

  // roughly how long they spent (only while the tab is visible)
  let active = 0;
  let since = document.visibilityState === "visible" ? Date.now() : 0;
  let reported = 0;
  const flush = () => {
    if (since) {
      active += Date.now() - since;
      since = 0;
    }
    const secs = Math.round(active / 1000);
    if (secs - reported >= 3) {
      reported = secs;
      send("time", { secs });
    }
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
    else since = Date.now();
  });
  window.addEventListener("pagehide", flush);

  return path;
}
