import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Link2,
  Lock,
  Mail,
  MapPin,
  Monitor,
  RefreshCw,
  Send,
  Smartphone,
  Trash2,
  Users,
  Clock,
} from "lucide-react";
import { markOwner } from "../lib/track";

/* ─────────────────────────────────────────────────────────────
   /tracker — your private page: make personal links, see who
   opened your portfolio and what they looked at.
   ───────────────────────────────────────────────────────────── */

type Visit = {
  t: number;
  type: "open" | "section" | "action" | "time";
  sid?: string;
  ref: string | null;
  name?: string;
  path?: string;
  secs?: number;
  referrer?: string;
  city?: string;
  region?: string;
  country?: string;
  device?: string;
  browser?: string;
  os?: string;
};
type Link = { name: string; company: string; channel: string; created: number };
type Data = { visits: Visit[]; links: Record<string, Link> };

const SECTION_NAMES: Record<string, string> = {
  about: "Intro",
  education: "Education",
  experience: "Experience",
  internships: "Internships",
  skills: "Skills",
  projects: "Projects",
  "proof-of-work": "Proof of Work",
  "contact-me": "Contact",
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/* "priya-swiggy" → "Priya Swiggy" for links you typed yourself */
const pretty = (slug: string) => slug.split("-").filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");

function ago(t: number) {
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d > 1 ? "s" : ""} ago`;
  return new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
const when = (t: number) =>
  new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
const dur = (secs: number) => {
  if (!secs) return "—";
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  return m < 60 ? `${m}m ${secs % 60}s` : `${Math.floor(m / 60)}h ${m % 60}m`;
};
const place = (v?: Visit) => (v ? [v.city, v.country].filter(Boolean).join(", ") : "");

/* group raw events into one summary per person (ref) */
function summarise(visits: Visit[]) {
  const byRef = new Map<string, Visit[]>();
  for (const v of visits) {
    const k = v.ref || "";
    if (!byRef.has(k)) byRef.set(k, []);
    byRef.get(k)!.push(v);
  }
  const out = new Map<
    string,
    { events: Visit[]; sessions: number; first: number; last: number; secs: number; sections: string[]; actions: string[]; lastOpen?: Visit }
  >();
  for (const [ref, ev] of byRef) {
    ev.sort((a, b) => a.t - b.t);
    const opens = ev.filter((e) => e.type === "open");
    const timeBy = new Map<string, number>();
    ev.filter((e) => e.type === "time").forEach((e) => {
      const k = `${e.sid}|${e.path}`;
      timeBy.set(k, Math.max(timeBy.get(k) || 0, e.secs || 0));
    });
    const sections = [...new Set(ev.filter((e) => e.type === "section").map((e) => e.name || ""))].filter(Boolean);
    const actions = [...new Set(ev.filter((e) => e.type === "action").map((e) => e.name || ""))].filter(Boolean);
    out.set(ref, {
      events: ev,
      sessions: new Set(opens.map((e) => e.sid)).size,
      first: ev[0].t,
      last: ev[ev.length - 1].t,
      secs: [...timeBy.values()].reduce((a, b) => a + b, 0),
      sections,
      actions,
      lastOpen: opens[opens.length - 1],
    });
  }
  return out;
}

function describe(e: Visit) {
  if (e.type === "open")
    return `Opened ${e.path === "/photography" ? "the Darkroom" : "your portfolio"}${place(e) ? ` from ${place(e)}` : ""} · ${e.device || ""}${e.browser ? ` · ${e.browser}` : ""}${e.referrer ? ` · via ${e.referrer}` : ""}`;
  if (e.type === "section") return `Scrolled to ${SECTION_NAMES[e.name || ""] || e.name}`;
  if (e.type === "action") return e.name || "Clicked something";
  return `Stayed ${dur(e.secs || 0)}`;
}

/* ───────────── small pieces ───────────── */

function CopyButton({ text, label = "Copy link" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={async (e) => {
        e.stopPropagation();
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          window.prompt("Copy this link:", text);
        }
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
        done ? "bg-green-400 border-green-400 text-black" : "border-black/15 hover:border-black hover:bg-black hover:text-white"
      }`}
    >
      {done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {done ? "Copied" : label}
    </button>
  );
}

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 bg-white ${accent ? "border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.25)]" : "border-black/10"}`}>
      <p className="text-xs font-mono tracking-widest uppercase text-black/50">{label}</p>
      <p className="text-3xl md:text-4xl font-bold mt-2">{value}</p>
      {sub && <p className="text-sm text-black/50 mt-1">{sub}</p>}
    </div>
  );
}

/* ───────────── screens ───────────── */

function Login({ onSubmit, error, busy }: { onSubmit: (p: string) => void; error: string; busy: boolean }) {
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  return (
    <div className="min-h-screen grid place-items-center px-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (p) onSubmit(p);
        }}
        className="w-full max-w-sm rounded-3xl border border-black/10 bg-white p-8 shadow-[0_0_40px_rgba(74,222,128,0.15)]"
      >
        <div className="w-12 h-12 rounded-2xl bg-green-400 grid place-items-center">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold mt-5">Portfolio tracker</h1>
        <p className="text-black/60 mt-1 text-sm">Only you can see this. Enter your tracker password.</p>
        <div className="relative mt-6">
          <input
            type={show ? "text" : "password"}
            value={p}
            onChange={(e) => setP(e.target.value)}
            autoFocus
            placeholder="Password"
            className="w-full rounded-xl border border-black/15 px-4 py-3 pr-11 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/20"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 hover:text-black" aria-label={show ? "Hide password" : "Show password"}>
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        <button disabled={busy} className="mt-5 w-full rounded-xl bg-black text-white font-semibold py-3 hover:bg-green-400 hover:text-black transition-colors disabled:opacity-50">
          {busy ? "Checking…" : "Open tracker"}
        </button>
      </form>
    </div>
  );
}

function Setup({ storage, password }: { storage: boolean; password: boolean }) {
  const step = (ok: boolean, n: number, title: string, body: React.ReactNode) => (
    <li className={`rounded-2xl border p-5 ${ok ? "border-green-400 bg-green-50" : "border-black/10 bg-white"}`}>
      <p className="font-semibold flex items-center gap-2">
        <span className={`w-6 h-6 rounded-full grid place-items-center text-xs ${ok ? "bg-green-400" : "bg-black text-white"}`}>{ok ? <Check className="w-4 h-4" /> : n}</span>
        {title}
      </p>
      <div className="text-sm text-black/70 mt-2 pl-8 space-y-1">{body}</div>
    </li>
  );
  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold">Almost there</h1>
        <p className="text-black/60 mt-2">The tracker is built, it just needs two things switched on in Vercel. This takes about 3 minutes, once.</p>
        <ol className="mt-8 space-y-4">
          {step(
            storage,
            1,
            "Connect free storage (Upstash)",
            <>
              <p>vercel.com → your portfolio project → <b>Storage</b> → <b>Create Database</b> → <b>Upstash</b> → <b>Redis</b> (free plan).</p>
              <p>Pick any region (Mumbai is closest), then <b>Connect</b> it to this project.</p>
            </>
          )}
          {step(
            password,
            2,
            "Set your tracker password",
            <>
              <p>Project → <b>Settings</b> → <b>Environment Variables</b> → add:</p>
              <p className="font-mono text-xs bg-black/5 rounded px-2 py-1 inline-block">TRACKER_PASSWORD = something only you know</p>
            </>
          )}
          {step(false, 3, "Redeploy", <p>Project → <b>Deployments</b> → ••• on the latest one → <b>Redeploy</b>. Then come back here.</p>)}
        </ol>
      </div>
    </div>
  );
}

function PersonRow({
  slug,
  link,
  s,
  url,
  onDelete,
}: {
  slug: string;
  link?: Link;
  s?: ReturnType<typeof summarise> extends Map<string, infer V> ? V : never;
  url: string;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const opened = !!s && s.sessions > 0;
  const lo = s?.lastOpen;
  return (
    <motion.div layout className={`rounded-2xl border bg-white transition-shadow ${open ? "border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.2)]" : "border-black/10 hover:border-green-400/60"}`}>
      <button onClick={() => setOpen((o) => !o)} className="w-full text-left p-4 md:p-5 grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1.4fr_1fr_1fr_auto] gap-x-4 gap-y-1 items-center">
        <span className={`w-3 h-3 rounded-full ${opened ? "bg-green-400 shadow-[0_0_10px_#4ade80]" : "bg-black/15"}`} />
        <span className="min-w-0">
          <span className="block font-semibold truncate">{link?.name || pretty(slug)}</span>
          <span className="block text-sm text-black/50 truncate">
            {link ? [link.company, link.channel].filter(Boolean).join(" · ") : `/to/${slug}`}
          </span>
        </span>
        <span className="hidden md:block text-sm">
          {opened ? (
            <>
              <span className="font-semibold text-green-600">Opened {s!.sessions}×</span>
              <span className="block text-black/50">{ago(s!.last)}</span>
            </>
          ) : (
            <span className="text-black/40">Not opened yet</span>
          )}
        </span>
        <span className="hidden md:block text-sm text-black/60">
          {opened ? (
            <>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {dur(s!.secs)}
              </span>
              {place(lo) && (
                <span className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5" /> {place(lo)}
                </span>
              )}
            </>
          ) : (
            link && <span>Sent {ago(link.created)}</span>
          )}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="justify-self-end">
          <ChevronDown className="w-5 h-5 text-black/40" />
        </motion.span>
        {/* mobile summary */}
        <span className="md:hidden col-start-2 text-sm text-black/60">
          {opened ? `Opened ${s!.sessions}× · ${ago(s!.last)} · ${dur(s!.secs)}` : "Not opened yet"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-4 md:px-5 pb-5 border-t border-black/5 pt-4 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <code className="text-xs bg-black/5 rounded-lg px-2.5 py-1.5 break-all">{url}</code>
                <CopyButton text={url} />
                {link && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${link.name} from your list? Their visit history stays.`)) onDelete();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-black/15 text-black/60 hover:border-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                )}
              </div>

              {opened && (
                <>
                  {s!.sections.length > 0 && (
                    <div>
                      <p className="text-xs font-mono tracking-widest uppercase text-black/40 mb-2">Looked at</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s!.sections.map((x) => (
                          <span key={x} className="text-xs px-2.5 py-1 rounded-full bg-green-400/25">
                            {SECTION_NAMES[x] || x}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {s!.actions.length > 0 && (
                    <div>
                      <p className="text-xs font-mono tracking-widest uppercase text-black/40 mb-2">Did</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s!.actions.map((x) => (
                          <span key={x} className="text-xs px-2.5 py-1 rounded-full bg-orange-500/15 text-orange-700">
                            {x}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-mono tracking-widest uppercase text-black/40 mb-2">Timeline</p>
                    <ol className="relative border-l-2 border-black/10 ml-1.5 space-y-2.5">
                      {[...s!.events]
                        .filter((e) => e.type !== "time")
                        .reverse()
                        .slice(0, 40)
                        .map((e, i) => (
                          <li key={i} className="pl-4 relative text-sm">
                            <span className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ${e.type === "open" ? "bg-green-400" : e.type === "action" ? "bg-orange-500" : "bg-black/30"}`} />
                            <span className="text-black/40 tabular-nums mr-2">{when(e.t)}</span>
                            {describe(e)}
                          </li>
                        ))}
                    </ol>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ───────────── page ───────────── */

export default function Tracker() {
  const [pass, setPass] = useState<string>(() => {
    try {
      return sessionStorage.getItem("tk_pass") || "";
    } catch {
      return "";
    }
  });
  const [data, setData] = useState<Data | null>(null);
  const [setup, setSetup] = useState<{ storage: boolean; password: boolean } | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", channel: "LinkedIn" });
  const [made, setMade] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "opened" | "waiting">("all");

  useEffect(() => {
    markOwner(); // your own visits are never tracked from this browser
    document.title = "Tracker — Tilak";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex";
    document.head.appendChild(robots);
  }, []);

  const api = useCallback(
    async (method: string, body?: unknown, key = pass) => {
      const r = await fetch("/api/tracker", {
        method,
        headers: { "x-tracker-key": key, ...(body ? { "Content-Type": "application/json" } : {}) },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (r.status === 503) {
        setSetup((await r.json()).setup);
        return null;
      }
      if (r.status === 401) {
        setError("That password didn't work.");
        setPass("");
        try {
          sessionStorage.removeItem("tk_pass");
        } catch {
          /* ignore */
        }
        return null;
      }
      if (!r.ok) {
        setError("Couldn't reach the tracker. Try again in a moment.");
        return null;
      }
      return r.json();
    },
    [pass]
  );

  const load = useCallback(
    async (key = pass) => {
      if (!key) return;
      setBusy(true);
      const d = await api("GET", undefined, key);
      setBusy(false);
      if (d) {
        setError("");
        setData(d);
        setPass(key);
        try {
          sessionStorage.setItem("tk_pass", key);
        } catch {
          /* ignore */
        }
      }
    },
    [api, pass]
  );

  useEffect(() => {
    if (pass) {
      load(pass);
      return;
    }
    // if Vercel setup isn't finished yet, show the steps straight away
    fetch("/api/tracker", { headers: { "x-tracker-key": "" } })
      .then(async (r) => {
        if (r.status === 503) setSetup((await r.json()).setup);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!data) return;
    const t = setInterval(() => load(), 60000);
    return () => clearInterval(t);
  }, [data, load]);

  const summary = useMemo(() => (data ? summarise(data.visits) : new Map()), [data]);
  const base = typeof window !== "undefined" ? window.location.origin : "";

  if (setup) return <Setup {...setup} />;
  if (!data) return <Login onSubmit={(p) => load(p)} error={error} busy={busy} />;

  const links = data.links;
  const slugs = [...new Set([...Object.keys(links), ...[...summary.keys()].filter(Boolean)])];
  const rows = slugs
    .map((slug) => ({ slug, link: links[slug], s: summary.get(slug) }))
    .sort((a, b) => (b.s?.last || 0) - (a.s?.last || 0) || (b.link?.created || 0) - (a.link?.created || 0))
    .filter((r) => filter === "all" || (filter === "opened" ? r.s?.sessions : !r.s?.sessions));

  const saved = slugs; // links made here + links you typed yourself
  const openedCount = saved.filter((k) => summary.get(k)?.sessions).length;
  const others = summary.get("");
  const allSessions = new Set(data.visits.filter((v) => v.type === "open").map((v) => v.sid)).size;
  const totalSecs = [...summary.values()].reduce((a, s) => a + s.secs, 0);

  const create = async () => {
    const name = form.name.trim();
    if (!name) return;
    let slug = slugify([name, form.company].filter(Boolean).join(" ")) || "link";
    let n = 2;
    while (links[slug]) slug = `${slugify([name, form.company].filter(Boolean).join(" "))}-${n++}`;
    const r = await api("POST", { slug, name, company: form.company.trim(), channel: form.channel });
    if (r?.ok) {
      setMade(`${base}/to/${slug}`);
      setForm((f) => ({ ...f, name: "", company: "" }));
      load();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black relative">
      <div className="fixed inset-0 grid-background opacity-40 pointer-events-none" />
      <div className="relative max-w-5xl mx-auto px-4 py-10 md:py-14">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-black/60 hover:text-black">
            <ArrowLeft className="w-4 h-4" /> Portfolio
          </a>
          <button onClick={() => load()} className="inline-flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full border border-black/15 hover:bg-black hover:text-white transition-colors">
            <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} /> Refresh
          </button>
        </header>

        <h1 className="text-4xl md:text-5xl font-bold mt-8">
          Who opened your <span className="hero-name-highlight">portfolio</span>
        </h1>
        <p className="text-black/60 mt-3 max-w-2xl">
          Make a personal link for each person you message. When they open it, you'll see it here, along with what they looked at. Updates every minute.
        </p>

        {/* stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
          <Stat label="People" value={String(saved.length)} />
          <Stat label="Opened" value={String(openedCount)} sub={saved.length ? `${Math.round((openedCount / saved.length) * 100)}% open rate` : undefined} accent />
          <Stat label="All visits" value={String(allSessions)} sub={others?.sessions ? `${others.sessions} without a personal link` : undefined} />
          <Stat label="Time on site" value={dur(totalSecs)} sub="all visitors" />
        </div>

        {/* link maker */}
        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-5 md:p-7">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Link2 className="w-5 h-5 text-green-500" /> Make a personal link
          </h2>
          <p className="text-sm text-black/50 mt-1">
            The person sees your normal portfolio. The link quietly tells you it was them. Shortcut: you can skip this and just type any name after{" "}
            <span className="font-mono text-black/70">/to/</span>, like <span className="font-mono text-black/70">{base.replace(/^https?:\/\//, "")}/to/rahul-zomato</span>. It shows up here once they open it.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              create();
            }}
            className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] gap-3 mt-5"
          >
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name, e.g. Priya" className="min-w-0 rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/20" />
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company (optional)" className="min-w-0 rounded-xl border border-black/15 px-4 py-3 outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/20" />
            <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className="rounded-xl border border-black/15 px-4 py-3 bg-white outline-none focus:border-green-400">
              {["LinkedIn", "Email", "WhatsApp", "Other"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-black text-white font-semibold px-5 py-3 hover:bg-green-400 hover:text-black transition-colors">
              <Send className="w-4 h-4" /> Create
            </button>
          </form>
          <AnimatePresence>
            {made && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-green-400/15 border border-green-400 px-4 py-3">
                <Check className="w-5 h-5 text-green-600" />
                <code className="text-sm font-semibold break-all">{made}</code>
                <CopyButton text={made} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* people */}
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" /> People
            </h2>
            <div className="flex gap-1 rounded-full border border-black/10 p-1 bg-white">
              {(["all", "opened", "waiting"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${filter === f ? "bg-black text-white" : "text-black/60 hover:text-black"}`}>
                  {f === "all" ? "All" : f === "opened" ? "Opened" : "Not yet"}
                </button>
              ))}
            </div>
          </div>
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center text-black/50">
              <Mail className="w-8 h-8 mx-auto mb-3 text-black/30" />
              {filter === "all" ? "No links yet. Make one above and paste it into your next message." : "Nobody here yet."}
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((r) => (
                <PersonRow
                  key={r.slug}
                  slug={r.slug}
                  link={r.link}
                  s={r.s}
                  url={`${base}/to/${r.slug}`}
                  onDelete={async () => {
                    await api("DELETE", { slug: r.slug });
                    load();
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* everyone else */}
        {others && others.sessions > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-500" /> Other visitors
            </h2>
            <p className="text-sm text-black/50 mt-1">People who came through your plain link, LinkedIn profile, or a shared link.</p>
            <div className="mt-4 rounded-2xl border border-black/10 bg-white divide-y divide-black/5">
              {others.events
                .filter((e: Visit) => e.type === "open")
                .reverse()
                .slice(0, 25)
                .map((e: Visit, i: number) => (
                  <div key={i} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 text-sm">
                    <span className="text-black/40 tabular-nums w-32">{when(e.t)}</span>
                    <span className="flex items-center gap-1.5">
                      {e.device === "Mobile" ? <Smartphone className="w-4 h-4 text-black/40" /> : <Monitor className="w-4 h-4 text-black/40" />}
                      {e.device} · {e.browser}
                    </span>
                    {place(e) && (
                      <span className="flex items-center gap-1.5 text-black/60">
                        <MapPin className="w-4 h-4 text-black/40" />
                        {place(e)}
                      </span>
                    )}
                    {e.referrer && <span className="text-black/50">via {e.referrer}</span>}
                    {e.path === "/photography" && <span className="text-orange-600">Darkroom</span>}
                  </div>
                ))}
            </div>
          </section>
        )}

        <p className="text-xs text-black/40 mt-12">
          Your own visits from this browser aren't counted. Locations are approximate (city level) and no IP addresses are stored. Link previews from LinkedIn, WhatsApp and email apps are filtered out, but some email security scanners may still register as an open.
        </p>
      </div>
    </div>
  );
}
