import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Instagram, Volume2, VolumeX, X } from "lucide-react";
import rollsData from "../data/photos.json";

/* ─────────────────────────────────────────────────────────────
   THE DARKROOM — photography page
   Photos and rolls come from src/data/photos.json.
   To add a photo: put `name.webp` and `name-sm.webp` in
   public/work/photos and add an entry to the right roll.
   ───────────────────────────────────────────────────────────── */

type Photo = { id: string; title: string; w: number; h: number; camera: string; year: string | null };
type Roll = { num: string; name: string; blurb: string; photos: Photo[] };
const rolls = rollsData as Roll[];
const total = rolls.reduce((n, r) => n + r.photos.length, 0);

/* film-edge sprocket holes, drawn as a repeating SVG */
const sprockets =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='26'%3E%3Crect x='9' y='6' width='16' height='14' rx='3' fill='%23efe7d2'/%3E%3C/svg%3E\")";

const grain =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ───────────── shutter sound (made in the browser, no file) ───────────── */
let ctx: AudioContext | null = null;
function shutter() {
  try {
    ctx = ctx || new (window.AudioContext || (window as any).webkitAudioContext)();
    const click = (at: number, len: number, gain: number) => {
      const buf = ctx!.createBuffer(1, ctx!.sampleRate * len, ctx!.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 4);
      const src = ctx!.createBufferSource();
      src.buffer = buf;
      const f = ctx!.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 2400;
      const g = ctx!.createGain();
      g.gain.value = gain;
      src.connect(f).connect(g).connect(ctx!.destination);
      src.start(ctx!.currentTime + at);
    };
    click(0, 0.05, 0.9);
    click(0.09, 0.07, 0.6);
  } catch {
    /* sound is optional */
  }
}

/* ───────────── intro countdown ───────────── */
function Countdown({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) {
      const t = setTimeout(onDone, 450);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN(n - 1), 750);
    return () => clearTimeout(t);
  }, [n, onDone]);
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0b0a09] grid place-items-center cursor-pointer select-none"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onDone}
    >
      <div className="absolute inset-0 opacity-[0.18] mix-blend-screen animate-grain" style={{ backgroundImage: grain }} />
      {/* flicker */}
      <motion.div
        className="absolute inset-0 bg-[#efe7d2]"
        animate={{ opacity: [0, 0.05, 0, 0.08, 0, 0.03, 0] }}
        transition={{ duration: 0.75, repeat: Infinity }}
      />
      <div className="relative w-[70vmin] h-[70vmin] text-[#efe7d2]">
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity=".5" strokeWidth=".6" />
          <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeOpacity=".8" strokeWidth=".8" />
          <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeOpacity=".4" strokeWidth=".5" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeOpacity=".4" strokeWidth=".5" />
          {n > 0 && (
            <motion.circle
              key={n}
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="#f97316"
              strokeWidth="14"
              strokeOpacity=".35"
              pathLength={1}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.75, ease: "linear" }}
              transform="rotate(-90 100 100)"
            />
          )}
        </svg>
        <AnimatePresence mode="wait">
          <motion.span
            key={n}
            className="absolute inset-0 grid place-items-center font-mono text-[28vmin] leading-none"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {n > 0 ? n : ""}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="absolute bottom-8 font-mono text-xs tracking-[0.3em] text-[#efe7d2]/40">TAP TO SKIP</span>
    </motion.div>
  );
}

/* ───────────── one frame on the strip ─────────────
   Each frame starts as an orange film negative and "develops"
   into the real photo when it reaches the middle of the screen. */
const NEGATIVE = "invert(1) hue-rotate(180deg) sepia(0.45) saturate(1.4) brightness(0.85) contrast(0.9)";

function Frame({ p, index, roll, onOpen, onHover }: { p: Photo; index: number; roll: Roll; onOpen: () => void; onHover: (p: Photo | null) => void }) {
  const frameNo = `${index + 1}`.padStart(2, "0");
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [developed, setDeveloped] = useState(!!reduce);
  useEffect(() => {
    if (developed || !ref.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setDeveloped(true), {
      rootMargin: "0px -40% 0px -40%",
      threshold: 0,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [developed]);
  return (
    <div className="relative h-full flex-shrink-0 flex flex-col" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
      <button
        ref={ref}
        onClick={() => {
          setDeveloped(true);
          onOpen();
        }}
        onPointerEnter={() => onHover(p)}
        onPointerLeave={() => onHover(null)}
        className="group relative flex-1 min-h-0 overflow-hidden bg-black outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        aria-label={`Open ${p.title}`}
      >
        <img
          src={`/work/photos/${p.id}-sm.webp`}
          alt={p.title}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-cover transition-[filter,transform] duration-[1800ms] ease-out group-hover:scale-[1.03]"
          style={{ filter: developed ? "none" : NEGATIVE }}
        />
        {/* orange film-base tint that fades as the frame develops */}
        <span
          className="absolute inset-0 bg-[#c8742c] mix-blend-multiply transition-opacity duration-[1800ms] pointer-events-none"
          style={{ opacity: developed ? 0 : 0.55 }}
        />
        <span className="absolute inset-x-0 bottom-0 p-3 text-left font-mono text-[11px] text-[#efe7d2] bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          {p.title}
        </span>
      </button>
      <span className="absolute -bottom-[17px] left-1 font-mono text-[9px] leading-none text-orange-500/90 tracking-widest whitespace-nowrap">
        ▸ {frameNo}A &nbsp; {roll.name.toUpperCase()}
      </span>
    </div>
  );
}

/* ───────────── viewfinder cursor (mouse only) ───────────── */
function Viewfinder({ target, hidden }: { target: Photo | null; hidden: boolean }) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  useEffect(() => {
    const m = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", m);
    return () => window.removeEventListener("pointermove", m);
  }, [x, y]);
  const locked = !!target;
  const corner = "absolute w-4 h-4 border-current";
  return (
    <motion.div
      className="fixed top-0 left-0 z-[120] pointer-events-none"
      style={{ x: sx, y: sy }}
      animate={{ opacity: hidden ? 0 : 1 }}
      aria-hidden
    >
      <motion.div
        className={`absolute -translate-x-1/2 -translate-y-1/2 ${locked ? "text-orange-500" : "text-[#efe7d2]/80"}`}
        animate={{ width: locked ? 54 : 76, height: locked ? 54 : 76 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        <span className={`${corner} top-0 left-0 border-t-2 border-l-2`} />
        <span className={`${corner} top-0 right-0 border-t-2 border-r-2`} />
        <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
        <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-current" />
      </motion.div>
      <motion.div
        className="absolute left-12 top-6 whitespace-nowrap font-mono text-[10px] tracking-wider text-[#efe7d2] bg-black/60 backdrop-blur px-2 py-1 rounded"
        initial={false}
        animate={{ opacity: locked ? 1 : 0, x: locked ? 0 : -6 }}
        transition={{ duration: 0.2 }}
      >
        {target && (
          <>
            <span className="text-orange-500">● FOCUS</span> &nbsp;{target.camera.split(" · ").slice(1).join("  ") || target.camera}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ───────────── a roll of film that scrolls sideways ───────────── */
function FilmRoll({ roll, rollIndex, onOpen, onHover }: { roll: Roll; rollIndex: number; onOpen: (r: number, i: number) => void; onHover: (p: Photo | null) => void }) {
  const reduce = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const x = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.4 });
  const tilt = rollIndex % 2 === 0 ? -1.2 : 1.2;
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const strip = (
    <div
      className="relative h-[52vh] md:h-[60vh] w-max py-[46px] bg-[#141210] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      style={{ transform: `rotate(${reduce ? 0 : tilt}deg)` }}
    >
      <div className="absolute top-0 inset-x-0 h-[26px]" style={{ backgroundImage: sprockets, backgroundRepeat: "repeat-x" }} />
      <div className="absolute bottom-0 inset-x-0 h-[26px]" style={{ backgroundImage: sprockets, backgroundRepeat: "repeat-x" }} />
      <div ref={track} className="relative h-full flex gap-[14px] px-[12vw] w-max">
        <div className="h-full flex flex-col justify-center pr-6 font-mono text-[#efe7d2]/30 text-xs leading-6 tracking-widest">
          <span>TILAK 400</span>
          <span>◀ ROLL {roll.num}</span>
        </div>
        {roll.photos.map((p, i) => (
          <Frame key={p.id} p={p} index={i} roll={roll} onOpen={() => onOpen(rollIndex, i)} onHover={onHover} />
        ))}
        <div className="h-full flex items-center pl-6 font-mono text-[#efe7d2]/30 text-xs tracking-widest">END ▶</div>
      </div>
    </div>
  );

  if (reduce) {
    return (
      <section className="py-16">
        <RollLabel roll={roll} />
        <div className="overflow-x-auto mt-8">{strip}</div>
      </section>
    );
  }

  return (
    <section ref={section} style={{ height: `calc(100vh + ${dist}px)` }} className="relative" id={`roll-${roll.num}`}>
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <RollLabel roll={roll} />
        <motion.div style={{ x }} className="mt-10 w-max">
          {strip}
        </motion.div>
        <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12 h-px bg-[#efe7d2]/10">
          <motion.div className="h-full bg-orange-500" style={{ width: bar }} />
        </div>
      </div>
    </section>
  );
}

function RollLabel({ roll }: { roll: Roll }) {
  return (
    <div className="px-6 md:px-12 flex items-end justify-between gap-6 text-[#efe7d2]">
      <div>
        <p className="font-mono text-xs tracking-[0.35em] text-orange-500">ROLL {roll.num} · {roll.photos.length} FRAMES</p>
        <h2 className="font-serif italic text-5xl md:text-7xl leading-none mt-2">{roll.name}</h2>
      </div>
      <p className="hidden md:block max-w-xs text-right text-[#efe7d2]/60">{roll.blurb}</p>
    </div>
  );
}

/* ───────────── darkroom viewer ───────────── */
function Darkroom({ r, i, onClose, go, sound }: { r: number; i: number; onClose: () => void; go: (d: 1 | -1) => void; sound: boolean }) {
  const roll = rolls[r];
  const p = roll.photos[i];
  const touchX = useRef<number | null>(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", k);
    };
  }, [onClose, go]);
  useEffect(() => {
    if (sound) shutter();
  }, [p.id, sound]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-4 md:p-10"
      style={{ background: "radial-gradient(ellipse at 50% 40%, #2a0606 0%, #0b0303 70%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
    >
      <div className="absolute inset-0 opacity-[0.12] mix-blend-screen pointer-events-none" style={{ backgroundImage: grain }} />
      <span className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.35em] text-red-400/60">● SAFELIGHT ON</span>
      <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 p-2 rounded-full text-[#efe7d2] bg-white/5 hover:bg-white/15">
        <X className="w-6 h-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo" className="hidden md:block absolute left-6 p-3 rounded-full text-[#efe7d2] bg-white/5 hover:bg-white/15">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo" className="hidden md:block absolute right-6 p-3 rounded-full text-[#efe7d2] bg-white/5 hover:bg-white/15">
        <ChevronRight className="w-6 h-6" />
      </button>

      <motion.div
        key={p.id}
        className="relative bg-[#f4efe4] p-2 md:p-3 pb-10 md:pb-14 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
        initial={{ y: 40, rotate: -1.5, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 22, stiffness: 180 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.img
          src={`/work/photos/${p.id}.webp`}
          alt={p.title}
          className="block max-h-[68vh] md:max-h-[72vh] max-w-[86vw] object-contain"
          initial={{ filter: "brightness(0) sepia(1) contrast(1.4)" }}
          animate={{ filter: "brightness(1) sepia(0) contrast(1)" }}
          transition={{ duration: 1.8, ease: [0.3, 0, 0.2, 1] }}
        />
        <div className="absolute bottom-2 md:bottom-4 left-3 right-3 flex justify-between items-baseline text-[#2a2522]">
          <span className="font-serif italic text-lg md:text-xl">{p.title}</span>
          <span className="font-mono text-[10px] tracking-widest opacity-60">{roll.num}/{`${i + 1}`.padStart(2, "0")}A</span>
        </div>
      </motion.div>
      <motion.p
        key={p.id + "-meta"}
        className="mt-5 font-mono text-[11px] md:text-xs tracking-wider text-[#efe7d2]/60 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        {p.camera}
        {p.year ? ` · ${p.year}` : ""} &nbsp;·&nbsp; Roll {roll.num} — {roll.name}
      </motion.p>
    </motion.div>
  );
}

/* ───────────── page ───────────── */
export default function Photography() {
  const reduce = useReducedMotion();
  const [intro, setIntro] = useState(!reduce);
  const [open, setOpen] = useState<{ r: number; i: number } | null>(null);
  const [sound, setSound] = useState(false);
  const [hovered, setHovered] = useState<Photo | null>(null);
  const [flash, setFlash] = useState(0);
  const [finePointer, setFinePointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFinePointer(mq.matches);
    const h = (e: MediaQueryListEvent) => setFinePointer(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  const openPhoto = (r: number, i: number) => {
    setFlash((f) => f + 1);
    setHovered(null);
    setTimeout(() => setOpen({ r, i }), 140);
  };

  useEffect(() => {
    document.title = "The Darkroom — Tilak";
    document.documentElement.style.scrollBehavior = "auto";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const go = (d: 1 | -1) =>
    setOpen((o) => {
      if (!o) return o;
      let { r, i } = o;
      i += d;
      if (i >= rolls[r].photos.length) { r = (r + 1) % rolls.length; i = 0; }
      if (i < 0) { r = (r - 1 + rolls.length) % rolls.length; i = rolls[r].photos.length - 1; }
      return { r, i };
    });

  return (
    <div className={`darkroom min-h-screen bg-[#0b0a09] text-[#efe7d2] overflow-x-clip ${finePointer && !reduce && !open ? "cursor-none [&_*]:cursor-none" : ""}`}>
      <AnimatePresence>{intro && <Countdown onDone={() => setIntro(false)} />}</AnimatePresence>

      {/* grain + light leaks */}
      <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.09] mix-blend-screen animate-grain" style={{ backgroundImage: grain }} />
      <div className="fixed -top-40 -left-40 w-[50vw] h-[50vw] rounded-full bg-orange-600/20 blur-[120px] pointer-events-none animate-leak" />
      <div className="fixed -bottom-40 -right-40 w-[45vw] h-[45vw] rounded-full bg-red-700/15 blur-[120px] pointer-events-none animate-leak [animation-delay:-6s]" />

      {/* top bar */}
      <header className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 md:px-10 py-5 mix-blend-difference">
        <a href="/#proof-of-work" className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] hover:text-orange-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> BACK TO WORK
        </a>
        <span className="hidden md:block font-mono text-xs tracking-[0.4em]">THE DARKROOM</span>
        <button
          onClick={() => { setSound((s) => !s); if (!sound) shutter(); }}
          className="flex items-center gap-2 font-mono text-xs tracking-[0.25em] hover:text-orange-400 transition-colors"
          aria-label={sound ? "Turn shutter sound off" : "Turn shutter sound on"}
        >
          {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{sound ? "SOUND ON" : "SOUND OFF"}</span>
        </button>
      </header>

      {/* hero */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.p
          className="font-mono text-xs tracking-[0.5em] text-orange-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: intro ? 0 : 1 }}
          transition={{ delay: 0.3 }}
        >
          {total} FRAMES · {rolls.length} ROLLS
        </motion.p>
        <motion.h1
          className="font-serif italic text-[18vw] md:text-[11vw] leading-[0.85] mt-4"
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: intro ? 0 : 1, filter: intro ? "blur(12px)" : "blur(0px)" }}
          transition={{ duration: 1.4, delay: 0.4 }}
        >
          Off the Clock
        </motion.h1>
        <motion.p
          className="mt-6 max-w-md text-[#efe7d2]/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: intro ? 0 : 1 }}
          transition={{ delay: 1.1 }}
        >
          My creative escape. No briefs, no KPIs — just whatever caught the light.
        </motion.p>
        <nav className="mt-10 flex flex-wrap justify-center gap-2">
          {rolls.map((r) => (
            <a key={r.num} href={`#roll-${r.num}`} className="font-mono text-[11px] tracking-widest px-3 py-1.5 border border-[#efe7d2]/20 rounded-full hover:border-orange-500 hover:text-orange-400 transition-colors">
              {r.num} {r.name.toUpperCase()}
            </a>
          ))}
        </nav>
        <motion.div
          className="absolute bottom-10 font-mono text-[10px] tracking-[0.4em] text-[#efe7d2]/40"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          SCROLL TO ADVANCE THE FILM ↓
        </motion.div>
      </section>

      {rolls.map((roll, ri) => (
        <FilmRoll key={roll.num} roll={roll} rollIndex={ri} onOpen={openPhoto} onHover={setHovered} />
      ))}

      {/* end */}
      <section className="h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <p className="font-mono text-xs tracking-[0.5em] text-orange-500">END OF FILM</p>
        <h2 className="font-serif italic text-5xl md:text-7xl mt-4">More frames developing…</h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href="https://www.instagram.com/tilak.5504" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 border border-[#efe7d2]/30 rounded-full hover:bg-[#efe7d2] hover:text-black transition-colors">
            <Instagram className="w-4 h-4" /> @tilak.5504
          </a>
          <a href="/#proof-of-work" className="flex items-center gap-2 px-5 py-3 bg-orange-500 text-black font-semibold rounded-full hover:bg-orange-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to my work
          </a>
        </div>
      </section>

      <AnimatePresence>
        {open && <Darkroom r={open.r} i={open.i} onClose={() => setOpen(null)} go={go} sound={sound} />}
      </AnimatePresence>

      {/* camera flash */}
      <AnimatePresence>
        {flash > 0 && (
          <motion.div
            key={flash}
            className="fixed inset-0 z-[110] bg-white pointer-events-none"
            initial={{ opacity: 0.95 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onAnimationComplete={() => setFlash(0)}
          />
        )}
      </AnimatePresence>

      {finePointer && !reduce && <Viewfinder target={hovered} hidden={!!open || intro} />}
    </div>
  );
}
