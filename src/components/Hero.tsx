import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Mail, Linkedin, Download, Instagram } from "lucide-react";

const ROLES = [
  ["Content Creator", "Digital Marketer", "Social Media Manager", "Podcast Producer"],
  ["Photographer", "SEO Analyst", "Community Manager", "Videographer", "UGC Manager"],
  ["Reddit Marketer", "Performance Marketer", "Creative Strategist", "Storyteller"],
  ["Visual Designer", "Digital Content Specialist", "Social Brand", "Client Lead"],
];

function RoleRow({ roles, reverse, speed, highlight }: { roles: string[]; reverse?: boolean; speed: number; highlight?: string }) {
  const items = [...roles, ...roles, ...roles, ...roles];
  return (
    <div className="flex overflow-hidden select-none" aria-hidden>
      <div
        className="flex shrink-0 gap-10 pr-10 animate-marquee whitespace-nowrap"
        style={{ animationDuration: `${speed}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {items.map((r, i) => (
          <span key={i} className={`text-4xl md:text-6xl font-bold ${r === highlight ? "text-orange-500/70" : "text-transparent hero-outline"}`}>
            {r}
            <span className="text-green-400">.</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Portrait() {
  const [on, setOn] = useState(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-1, 1], [-12, 12]), { stiffness: 180, damping: 16 });
  const rotateX = useSpring(useTransform(py, [-1, 1], [10, -10]), { stiffness: 180, damping: 16 });
  return (
    <motion.div
      className="relative w-52 h-52 md:w-60 md:h-60 cursor-pointer"
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOn(true)}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setOn(false);
        px.set(0);
        py.set(0);
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onClick={() => setOn((v) => !v)}
      aria-label="Tilak"
    >
      {/* ring of words that spins in on hover */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute -inset-9 md:-inset-11 w-[calc(100%+4.5rem)] h-[calc(100%+4.5rem)] md:w-[calc(100%+5.5rem)] md:h-[calc(100%+5.5rem)] pointer-events-none"
        initial={false}
        animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.8, rotate: on ? 0 : -60 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
        aria-hidden
      >
        <defs>
          <path id="ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
        </defs>
        <g className="animate-spin-slow">
          <text className="font-mono" fontSize="9.5" letterSpacing="3.2" fill="#111">
            <textPath href="#ring">MARKETING ✦ STORYTELLING ✦ CONTENT ✦ REDDIT ✦ GROWTH ✦ </textPath>
          </text>
        </g>
      </motion.svg>

      {/* green circle */}
      <motion.div
        className="absolute inset-0 rounded-full bg-green-400 border-4 border-white"
        animate={{ boxShadow: on ? "0 0 70px rgba(74,222,128,0.75)" : "0 0 40px rgba(74,222,128,0.45)" }}
        transition={{ duration: 0.4 }}
      />
      {/* photo: clipped by the circle at the bottom, free at the top so the head pops out */}
      <div className="absolute inset-x-[4px] bottom-[4px] h-[135%] overflow-hidden rounded-b-full pointer-events-none">
        <motion.img
          src="/overlay.png"
          alt="Tilak"
          className="absolute bottom-0 left-1/2 w-[112%] max-w-none origin-bottom"
          initial={false}
          animate={{ x: "-50%", y: on ? "0%" : "16%", scale: on ? 1.06 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 17 }}
        />
      </div>
      {/* a hint chip */}
      <motion.span
        className="absolute -right-3 top-3 bg-black text-white text-[11px] font-medium px-2.5 py-1 rounded-full shadow pointer-events-none"
        initial={false}
        animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.6, rotate: on ? 8 : 0, y: on ? 0 : 8 }}
        transition={{ type: "spring", stiffness: 260, damping: 15 }}
      >
        hey there 👋
      </motion.span>
    </motion.div>
  );
}

const up = (delay = 0) => ({
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.9, ease: "easeOut", delay },
});

export default function Hero() {
  return (
    <div className="relative min-h-[100svh] flex flex-col items-center justify-center pt-28 pb-16">
      {/* portrait over the wall of roles */}
      <div className="relative w-full flex items-center justify-center pt-16 pb-8 overflow-hidden">
        <motion.div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <RoleRow roles={ROLES[0]} speed={110} highlight="Digital Marketer" />
          <RoleRow roles={ROLES[1]} speed={130} reverse />
          <RoleRow roles={ROLES[2]} speed={120} highlight="Reddit Marketer" />
          <RoleRow roles={ROLES[3]} speed={140} reverse />
        </motion.div>
        <motion.div {...up(0)} className="relative z-10">
          <Portrait />
        </motion.div>
      </div>

      <motion.h1 {...up(0.15)} className="mt-8 text-5xl sm:text-6xl md:text-7xl font-bold text-center px-4">
        Hi, I am <span className="hero-name-highlight">Tilak</span>
      </motion.h1>

      <motion.p {...up(0.3)} className="mt-5 text-lg sm:text-2xl orange-glow text-center px-6 max-w-2xl">
        Marketing meets storytelling — crafting digital experiences that engage.
      </motion.p>

      <motion.div {...up(0.45)} className="mt-9 flex flex-col sm:flex-row items-center gap-6">
        <a href="/resume.pdf" className="download-btn flex items-center gap-2" target="_blank" rel="noopener noreferrer">
          <Download className="w-5 h-5" />
          Download Resume
        </a>
        <div className="flex gap-3">
          {[
            { href: "https://www.instagram.com/tilak.5504", icon: Instagram, label: "Instagram" },
            { href: "https://www.linkedin.com/in/tilakpasupureddy/", icon: Linkedin, label: "LinkedIn" },
            { href: "mailto:pasupureddytilak@gmail.com", icon: Mail, label: "Email" },
          ].map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="grid place-items-center w-12 h-12 rounded-xl border-2 border-black bg-white hover:bg-green-400 hover:scale-110 hover:shadow-[0_0_20px_rgba(74,222,128,0.45)] transition-all duration-300"
            >
              <Icon className="w-6 h-6" />
            </a>
          ))}
        </div>
      </motion.div>

      <motion.a
        href="#education"
        aria-label="Scroll to education"
        className="absolute bottom-6 text-black/40 hover:text-black transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 1.2 }, y: { duration: 2, repeat: Infinity, ease: "easeInOut" } }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.a>
    </div>
  );
}
