import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Play,
  Volume2,
  VolumeX,
  X,
  Film,
  Palette,
  Mic,
  Camera,
} from "lucide-react";
import { posters, reels, videos } from "../data/work";

const TABS = [
  { id: "all", label: "All", icon: null },
  { id: "reels", label: "Reels", icon: Film },
  { id: "design", label: "Design", icon: Palette },
  { id: "video", label: "Podcasts & Film", icon: Mic },
] as const;
type TabId = (typeof TABS)[number]["id"];

/* ───────────────────────── helpers ───────────────────────── */

function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!ref.current || seen) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setSeen(true),
      { threshold }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen, threshold]);
  return [ref, seen] as const;
}

function useLockScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

function SectionTitle({
  icon: Icon,
  title,
  note,
}: {
  icon: React.ElementType;
  title: string;
  note?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6 mt-4">
      <h3 className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-white">
        <Icon className="w-6 h-6 text-green-400" />
        {title}
      </h3>
      {note && <p className="text-sm text-white/50 hidden sm:block">{note}</p>}
    </div>
  );
}

/* ───────────────────────── reels ───────────────────────── */

function ReelStage() {
  const [idx, setIdx] = useState(0);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const vid = useRef<HTMLVideoElement>(null);
  const [wrap, inView] = useInView<HTMLDivElement>(0.25);
  const reel = reels[idx];
  const portrait = reel.shape === "portrait";

  useEffect(() => {
    const v = vid.current;
    if (!v || !inView) return;
    setProgress(0);
    setLoading(true);
    v.load();
    v.play().catch(() => {});
  }, [idx, inView]);

  const pick = (i: number) => setIdx((i + reels.length) % reels.length);

  return (
    <div ref={wrap} className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)] gap-8 lg:gap-14 items-center">
      {/* screen */}
      <div className="flex flex-col items-center">
        <motion.div
          layout
          transition={{ type: "spring", damping: 26, stiffness: 220 }}
          className={`relative bg-neutral-900 border-[6px] border-neutral-800 shadow-[0_30px_80px_rgba(74,222,128,0.12)] overflow-hidden ${
            portrait ? "w-[260px] md:w-[300px] aspect-[9/16] rounded-[2.2rem]" : "w-[min(92vw,520px)] aspect-video rounded-[1.4rem]"
          }`}
        >
          <img src={`/work/reels/${reel.id}.webp`} alt="" className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-60" />
          {inView && (
            <video
              ref={vid}
              src={`/work/reels/${reel.id}.mp4`}
              poster={`/work/reels/${reel.id}.webp`}
              muted={muted}
              playsInline
              preload="auto"
              onCanPlay={() => setLoading(false)}
              onWaiting={() => setLoading(true)}
              onPlaying={() => setLoading(false)}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration) setProgress(v.currentTime / v.duration);
              }}
              onEnded={() => pick(idx + 1)}
              onClick={(e) => (e.currentTarget.paused ? e.currentTarget.play() : e.currentTarget.pause())}
              className="relative w-full h-full object-contain cursor-pointer"
            />
          )}
          {loading && (
            <span className="absolute inset-0 grid place-items-center pointer-events-none">
              <span className="w-10 h-10 rounded-full border-2 border-white/20 border-t-green-400 animate-spin" />
            </span>
          )}
          <div className="absolute top-3 inset-x-3 h-1 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
          </div>
          <button
            onClick={() => setMuted((m) => !m)}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur grid place-items-center text-white hover:bg-black/80"
            aria-label={muted ? "Turn sound on" : "Turn sound off"}
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </motion.div>
        <div className="flex items-center gap-4 mt-5 text-white">
          <button onClick={() => pick(idx - 1)} aria-label="Previous reel" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-white/60 tabular-nums w-14 text-center">
            {idx + 1} / {reels.length}
          </span>
          <button onClick={() => pick(idx + 1)} aria-label="Next reel" className="p-2 rounded-full bg-white/10 hover:bg-white/20">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* playlist */}
      <div>
        <AnimatePresence mode="wait">
          <motion.div key={reel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 hidden lg:block">
            <p className="text-green-400 text-xs uppercase tracking-[0.25em]">Now playing · {reel.type}</p>
            <h4 className="text-white text-3xl font-bold mt-2">{reel.title}</h4>
            <p className="text-white/50 mt-1">{reel.client}</p>
          </motion.div>
        </AnimatePresence>
        <div className="flex lg:grid lg:grid-cols-2 gap-3 overflow-x-auto lg:overflow-visible no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 snap-x">
          {reels.map((r, i) => (
            <button
              key={r.id}
              onClick={() => pick(i)}
              className={`flex-shrink-0 w-[230px] lg:w-auto snap-start flex items-center gap-3 p-2 pr-4 rounded-xl text-left border transition-colors ${
                i === idx ? "bg-white/10 border-green-400/60" : "border-white/10 hover:bg-white/5 hover:border-white/25"
              }`}
            >
              <span className="relative w-12 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-neutral-800">
                <img src={`/work/reels/${r.id}.webp`} alt="" loading="lazy" className="w-full h-full object-cover" />
                {i === idx && (
                  <span className="absolute inset-0 grid place-items-center bg-black/40">
                    <span className="flex gap-0.5 items-end h-4">
                      {[0, 1, 2].map((b) => (
                        <span key={b} className="w-1 bg-green-400 animate-eq" style={{ animationDelay: `${b * 0.15}s` }} />
                      ))}
                    </span>
                  </span>
                )}
              </span>
              <span className="min-w-0">
                <span className="block text-white text-sm font-semibold truncate">{r.title}</span>
                <span className="block text-white/50 text-xs truncate">
                  {r.client} · {r.type}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── design gallery ───────────────────────── */

function PosterLightbox({ list, index, onClose, setIndex }: { list: typeof posters; index: number; onClose: () => void; setIndex: (i: number) => void }) {
  useLockScroll(true);
  const p = list[index];
  const next = () => setIndex((index + 1) % list.length);
  const prev = () => setIndex((index - 1 + list.length) % list.length);
  const touchX = useRef<number | null>(null);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-black/95 flex flex-col items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touchX.current = null;
      }}
    >
      <button onClick={onClose} aria-label="Close" className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
        <X className="w-6 h-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous" className="hidden md:block absolute left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next" className="hidden md:block absolute right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white">
        <ChevronRight className="w-6 h-6" />
      </button>
      <motion.img
        key={p.id}
        src={`/work/posters/${p.id}.webp`}
        alt={`${p.client} design`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-h-[80vh] max-w-full rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <p className="text-white mt-4 text-center">
        <span className="font-semibold">{p.client}</span>
        <span className="text-white/50"> · {p.industry}</span>
        <span className="text-white/30 ml-3 tabular-nums">{index + 1}/{list.length}</span>
      </p>
    </motion.div>
  );
}

function DesignGallery() {
  const industries = useMemo(() => ["All", ...Array.from(new Set(posters.map((p) => p.industry)))], []);
  const [industry, setIndustry] = useState("All");
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const list = posters.filter(
    (p) => industry === "All" || p.industry === industry
  );
  const visible = showAll ? list : list.slice(0, 12);
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {industries.map((i) => (
          <button
            key={i}
            onClick={() => { setIndustry(i); setShowAll(false); }}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              industry === i ? "bg-green-400 text-black border-green-400" : "border-white/20 text-white/70 hover:text-white hover:border-white/50"
            }`}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
          {visible.map((p) => (
            <button
              key={p.id}
              onClick={() => setOpen(list.indexOf(p))}
              className="group relative block w-full mb-4 break-inside-avoid rounded-xl overflow-hidden bg-neutral-900"
              style={{ aspectRatio: `${p.w} / ${p.h}` }}
            >
              <img
                src={`/work/posters/${p.id}-sm.webp`}
                alt={`${p.client} design`}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-left">
                <span className="text-white text-sm font-semibold">{p.client}</span>
                <span className="text-white/60 text-xs">{p.industry}</span>
              </div>
            </button>
          ))}
      </div>
      {list.length > 12 && (
        <div className="text-center mt-4">
          <button onClick={() => setShowAll((s) => !s)} className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-colors">
            {showAll ? "Show less" : `Show all ${list.length} designs`}
          </button>
        </div>
      )}
      {createPortal(<AnimatePresence>
        {open !== null && list[open] && (
          <PosterLightbox list={list} index={open} setIndex={setOpen} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>, document.body)}
    </div>
  );
}

/* ───────────────────────── YouTube ───────────────────────── */

function YouTubeLite({ id, title }: { id: string; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/10">
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      ) : (
        <button onClick={() => setOn(true)} className="group w-full h-full" aria-label={`Play ${title}`}>
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className="absolute inset-0 grid place-items-center bg-black/30 group-hover:bg-black/10 transition-colors">
            <span className="w-16 h-16 rounded-full bg-orange-500 grid place-items-center group-hover:scale-110 transition-transform">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── section ───────────────────────── */

export default function ProofOfWork() {
  const [tab, setTab] = useState<TabId>("all");
  const show = (t: TabId) => tab === "all" || tab === t;

  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden" id="proof-of-work">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "linear-gradient(#4ade80 1px, transparent 1px), linear-gradient(90deg, #4ade80 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-green-400 uppercase tracking-[0.3em] text-sm">Receipts, not résumés</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white mt-3">Proof of Work</h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Reels I've cut, designs I've made, and the podcasts and films behind them.
          </p>
        </div>

        {/* tabs */}
        <div className="sticky top-[72px] z-30 -mx-4 px-4 py-3 mb-8 bg-black/80 backdrop-blur border-b border-white/10">
          <div className="flex gap-2 overflow-x-auto no-scrollbar justify-start md:justify-center">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  tab === t.id ? "text-black" : "text-white/70 hover:text-white"
                }`}
              >
                {tab === t.id && (
                  <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-green-400" transition={{ type: "spring", damping: 25, stiffness: 300 }} />
                )}
                {t.icon && <t.icon className="relative w-4 h-4" />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-20">
          {show("reels") && (
            <div>
              <SectionTitle icon={Film} title="Reels" note="Tap the screen to pause · pick any reel from the list" />
              <ReelStage />
            </div>
          )}

          {show("design") && (
            <div>
              <SectionTitle icon={Palette} title="Design" note={`${posters.length} designs`} />
              <DesignGallery />
            </div>
          )}

          {show("video") && (
            <div>
              <SectionTitle icon={Mic} title="Podcasts & Film" />
              <div className="grid md:grid-cols-3 gap-5">
                {videos.map((v) => (
                  <div key={v.id}>
                    <YouTubeLite id={v.id} title={v.title} />
                    <p className="text-white font-semibold mt-3">{v.title}</p>
                    <p className="text-white/50 text-sm">{v.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "all" && (
            <a
              href="/photography"
              className="group relative block rounded-3xl overflow-hidden border border-white/10 h-72 md:h-80"
            >
              <div className="absolute inset-0 flex">
                {["4571", "IMG_0696", "4286", "4992", "51800", "12178"].map((id) => (
                  <img key={id} src={`/work/photos/${id}-sm.webp`} alt="" loading="lazy" className="h-full flex-1 min-w-0 object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
              <div className="relative h-full flex flex-col justify-center p-8 md:p-12 max-w-lg">
                <p className="text-orange-500 uppercase tracking-[0.3em] text-xs flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Off the clock
                </p>
                <h3 className="text-3xl md:text-5xl font-bold text-white mt-3">The Darkroom</h3>
                <p className="text-white/70 mt-3">
                  When I'm not growing brands, I'm out with a camera. Step into my creative escape.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-white font-semibold">
                  Enter the darkroom
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </div>
            </a>
          )}
        </div>
      </div>

    </section>
  );
}
