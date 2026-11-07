import { useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { Mail, Linkedin, Download, Instagram } from "lucide-react";
import { BlurWords, Magnetic, SplitReveal, ease } from "./motion";

const ROLES = [
  ["Content Creator", "Digital Marketer", "Social Media Manager", "Podcast Producer"],
  ["Photographer", "SEO Analyst", "Community Manager", "Videographer", "UGC Manager"],
  ["Reddit Marketer", "Performance Marketer", "Creative Strategist", "Storyteller"],
  ["Visual Designer", "Digital Content Specialist", "Social Brand", "Client Lead"],
];

function RoleRow({ roles, dir, speed, highlight }: { roles: string[]; dir: 1 | -1; speed: number; highlight?: string }) {
  const items = [...roles, ...roles, ...roles, ...roles];
  return (
    <div className="flex overflow-hidden select-none" aria-hidden>
      <div
        className="flex shrink-0 gap-10 pr-10 animate-marquee whitespace-nowrap"
        style={{ animationDuration: `${speed}s`, animationDirection: dir === 1 ? "normal" : "reverse" }}
      >
        {items.map((r, i) => (
          <span
            key={i}
            className={`text-5xl md:text-7xl font-bold tracking-tight ${r === highlight ? "text-orange-500/90" : "text-transparent hero-outline"}`}
          >
            {r}
            <span className="text-green-400">.</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const section = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const lift = useTransform(scrollYProgress, [0, 1], [0, -120]);

  // portrait follows the cursor a little
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tx = useSpring(useTransform(mx, [-1, 1], [-18, 18]), { stiffness: 80, damping: 15 });
  const ty = useSpring(useTransform(my, [-1, 1], [-12, 12]), { stiffness: 80, damping: 15 });
  const ringX = useSpring(useTransform(mx, [-1, 1], [10, -10]), { stiffness: 60, damping: 15 });

  return (
    <div
      ref={section}
      className="relative min-h-[100svh] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      {/* moving wall of roles */}
      <motion.div
        className="absolute inset-x-0 top-24 md:top-28 flex flex-col gap-3 md:gap-4 -rotate-3 scale-110"
        style={{ y: bgY, opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      >
        <RoleRow roles={ROLES[0]} dir={1} speed={60} highlight="Digital Marketer" />
        <RoleRow roles={ROLES[1]} dir={-1} speed={70} />
        <RoleRow roles={ROLES[2]} dir={1} speed={55} highlight="Reddit Marketer" />
        <RoleRow roles={ROLES[3]} dir={-1} speed={65} />
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.92)_25%,rgba(255,255,255,0.4)_65%,transparent_100%)] pointer-events-none" />

      <motion.div style={{ y: lift }} className="relative z-10 flex flex-col items-center">
        {/* portrait */}
        <motion.div className="relative w-56 h-56 md:w-64 md:h-64" style={{ x: tx, y: ty }}>
          {/* spinning ring of text */}
          <motion.svg
            viewBox="0 0 200 200"
            className="absolute -inset-10 md:-inset-12 w-[calc(100%+5rem)] h-[calc(100%+5rem)] md:w-[calc(100%+6rem)] md:h-[calc(100%+6rem)]"
            style={{ x: ringX }}
            initial={{ opacity: 0, scale: 0.6, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, ease, delay: 0.5 }}
          >
            <defs>
              <path id="ring" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" />
            </defs>
            <g className="origin-center animate-spin-slow">
              <text className="font-mono" fontSize="9.5" letterSpacing="3.2" fill="#111">
                <textPath href="#ring">MARKETING ✦ STORYTELLING ✦ CONTENT ✦ GROWTH ✦ REDDIT ✦ </textPath>
              </text>
            </g>
          </motion.svg>

          <motion.div
            className="absolute inset-0 rounded-full bg-green-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.15 }}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-[130%] overflow-hidden rounded-b-full"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.1, ease, delay: 0.45 }}
          >
            <img src="/overlay.png" alt="Tilak" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[112%] max-w-none" />
          </motion.div>
          <motion.span
            className="absolute -right-2 top-6 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg"
            initial={{ opacity: 0, scale: 0, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 6 }}
            transition={{ type: "spring", stiffness: 260, damping: 14, delay: 1.5 }}
          >
            MBA @ NMIMS
          </motion.span>
        </motion.div>

        {/* name */}
        <h1 className="mt-12 md:mt-14 text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-center px-4">
          <SplitReveal text="Hi, I am" animateNow delay={0.6} />{" "}
          <span className="relative inline-block px-2">
            <motion.span
              className="absolute inset-0 bg-green-400 origin-left -z-10"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, ease, delay: 1.05 }}
            />
            <SplitReveal text="Tilak" animateNow delay={1.15} stagger={0.06} />
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-2xl text-orange-500 text-center px-6 max-w-2xl">
          <BlurWords text="Marketing meets storytelling — crafting digital experiences that engage." animateNow delay={1.5} />
        </p>

        <motion.div
          className="mt-10 flex flex-col sm:flex-row items-center gap-6"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 2 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 30, scale: 0.8 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 220, damping: 16 } } }}>
            <Magnetic>
              <a href="/resume.pdf" className="download-btn flex items-center gap-2" target="_blank" rel="noopener noreferrer">
                <Download className="w-5 h-5" />
                Download Resume
              </a>
            </Magnetic>
          </motion.div>
          <div className="flex gap-4">
            {[
              { href: "https://www.instagram.com/tilak.5504", icon: Instagram, label: "Instagram" },
              { href: "https://www.linkedin.com/in/tilakpasupureddy/", icon: Linkedin, label: "LinkedIn" },
              { href: "mailto:pasupureddytilak@gmail.com", icon: Mail, label: "Email" },
            ].map(({ href, icon: Icon, label }) => (
              <motion.div key={label} variants={{ hidden: { opacity: 0, y: 30, rotate: -15 }, show: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", stiffness: 260, damping: 14 } } }}>
                <Magnetic strength={0.5}>
                  <a
                    href={href}
                    aria-label={label}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group grid place-items-center w-14 h-14 rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0_#000] hover:shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-green-400 transition-all"
                  >
                    <Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  </a>
                </Magnetic>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#education"
        className="absolute bottom-6 z-10 flex flex-col items-center gap-2 text-xs font-mono tracking-[0.3em] text-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
      >
        SCROLL
        <span className="w-6 h-10 rounded-full border-2 border-black/40 flex justify-center pt-2">
          <motion.span className="w-1 h-2 rounded-full bg-black/60" animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
        </span>
      </motion.a>
    </div>
  );
}
