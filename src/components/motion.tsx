import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

/* Text that rises letter by letter out of a mask */
export function SplitReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.035,
  once = true,
  animateNow = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  animateNow?: boolean;
}) {
  const words = text.split(" ");
  let i = 0;
  const trigger = animateNow
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once, amount: 0.6 } };
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      {...trigger}
      aria-label={text}
    >
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
          {w.split("").map((c) => {
            const d = delay + i++ * stagger;
            return (
              <span key={i} className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  className="inline-block"
                  variants={{
                    hidden: { y: "110%", rotate: 8 },
                    show: { y: "0%", rotate: 0, transition: { duration: 0.8, ease, delay: d } },
                  }}
                >
                  {c}
                </motion.span>
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}

/* Words that blur into focus */
export function BlurWords({ text, className = "", delay = 0, animateNow = false }: { text: string; className?: string; delay?: number; animateNow?: boolean }) {
  const trigger = animateNow ? { animate: "show" as const } : { whileInView: "show" as const, viewport: { once: true, amount: 0.6 } };
  return (
    <motion.span className={className} initial="hidden" {...trigger} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block mr-[0.28em]"
          variants={{
            hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
            show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.7, ease, delay: delay + i * 0.06 } },
          }}
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* Section heading: fades up, a short line draws underneath */
export function SectionHeading({ index, title, kicker }: { index: string; title: string; kicker?: string }) {
  return (
    <motion.div
      className="text-center mb-12 md:mb-14"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p className="font-mono text-xs tracking-[0.3em] text-orange-500 uppercase">
        {index} {kicker ? `— ${kicker}` : ""}
      </p>
      <h2 className="text-4xl md:text-5xl font-bold mt-3">{title}</h2>
      <motion.div
        className="mx-auto mt-4 h-1 w-16 bg-green-400 origin-center rounded-full"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
      />
    </motion.div>
  );
}

/* Card that tilts in 3D toward the cursor, with a moving glare */
export function TiltCard({ children, className = "", max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx} ${gy}, rgba(74,222,128,0.22), transparent 55%)`;
  const glareOn = useSpring(0, { stiffness: 200, damping: 25 });
  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
        glareOn.set(1);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
        glareOn.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden" style={{ background: glare, opacity: glareOn }} />
    </motion.div>
  );
}

/* Element that leans toward the cursor */
export function Magnetic({ children, strength = 0.35, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 250, damping: 15 });
  const y = useSpring(0, { stiffness: 250, damping: 15 });
  return (
    <motion.div
      ref={ref}
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* Thin progress bar showing how far down the page you are */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return <motion.div className="fixed top-0 inset-x-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-green-400 to-orange-500" style={{ scaleX }} />;
}

/* Stagger helpers */
export const staggerParent = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

export const riseChild: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
