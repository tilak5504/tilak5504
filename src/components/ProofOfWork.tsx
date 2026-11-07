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
import { posters, reels, videos, type Reel } from "../data/work";

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

function ReelTile({ reel, onOpen }: { reel: Reel; onOpen: () => void }) {
  const vid = useRef<HTMLVideoElement>(null);
  const [ref, near] = useInView<HTMLButtonElement>(0.01);
  const play = () => vid.current?.play().catch(() => {});
  const stop = () => {
    if (!vid.current) return;
    vid.current.pause();
    vid.current.currentTime = 0;
  };
  const portrait = reel.shape === "portrait";
  return (
    <button
      ref={ref}
      onMouseEnter={play}
      onMouseLeave={stop}
      onFocus={play}
      onBlur={stop}
      onClick={onOpen}
      className={`group relative flex-shrink-0 snap-start rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 ${
        portrait ? "w-[200px] h-[356px] md:w-[230px] md:h-[409px]" : "w-[300px] h-[356px] md:w-[460px] md:h-[409px]"
      }`}
      aria-label={`Play ${reel.title}`}
    >
      <img src={`/work/reels/${reel.id}.webp`} alt="" className={`absolute inset-0 w-full h-full ${portrait ? "object-cover" : "object-contain"}`} />
      {near && (
        <video
          ref={vid}
          src={`/work/reels/${reel.id}.mp4`}
          muted
          loop
          playsInline
          preload="metadata"
          className={`absolute inset-0 w-full h-full ${portrait ? "object-cover" : "object-contain"} opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300`}
        />
      )}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-left">
        <p className="text-[11px] uppercase tracking-widest text-green-400">{reel.type}</p>
        <p className="text-white font-semibold leading-tight mt-1">{reel.title}</p>
        <p className="text-white/60 text-xs mt-0.5">{reel.client}</p>
      </div>
      <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur grid place-items-center group-hover:scale-110 transition-transform">
        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
      </span>
    </button>
  );
}

function ReelPlayer({ reel, onClose, onNext, onPrev }: { reel: Reel; onClose: () => void; onNext: () => void; onPrev: () => void }) {
  useLockScroll(true);
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose, onNext, onPrev]);
  const portrait = reel.shape === "portrait";
  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-black/95 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} aria-label="Close" className="absolute top-5 right-5 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white">
        <X className="w-6 h-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} aria-label="Previous" className="absolute left-2 md:left-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} aria-label="Next" className="absolute right-2 md:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white">
        <ChevronRight className="w-6 h-6" />
      </button>
      <motion.div
        key={reel.id}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative ${portrait ? "h-[86vh] aspect-[9/16] max-w-[92vw]" : "w-[92vw] max-w-5xl aspect-video"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <video src={`/work/reels/${reel.id}.mp4`} autoPlay loop playsInline muted={muted} controls className="w-full h-full rounded-2xl bg-black object-contain" />
        <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-between text-white">
          <div>
            <span className="font-semibold">{reel.title}</span>
            <span className="text-white/50 text-sm"> · {reel.client}</span>
          </div>
          <button onClick={() => setMuted((m) => !m)} className="p-2 rounded-full bg-white/10" aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </motion.div>
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
  const [reelIdx, setReelIdx] = useState<number | null>(null);
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
        <div className="sticky top-0 z-30 -mx-4 px-4 py-3 mb-8 bg-black/80 backdrop-blur border-b border-white/10">
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
              <SectionTitle icon={Film} title="Reels" note="Hover to preview · click to watch with sound" />
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 reel-scroll">
                {reels.map((r, i) => (
                  <ReelTile key={r.id} reel={r} onOpen={() => setReelIdx(i)} />
                ))}
              </div>
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

          {(
            <a
              href="/photography"
              className="group relative block rounded-3xl overflow-hidden border border-white/10 h-72 md:h-80"
            >
              <div className="absolute inset-0 flex">
                {["4571", "IMG_0696", "4286", "4992", "51800", "12178"].map((id) => (
                  <img key={id} src={`/work/photos/${id}-sm.webp`} alt="" className="h-full flex-1 min-w-0 object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
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

      {createPortal(
        <AnimatePresence>
          {reelIdx !== null && (
            <ReelPlayer
              key="reel"
              reel={reels[reelIdx]}
              onClose={() => setReelIdx(null)}
              onNext={() => setReelIdx((reelIdx + 1) % reels.length)}
              onPrev={() => setReelIdx((reelIdx - 1 + reels.length) % reels.length)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
