import { motion } from "framer-motion";
import { Mail, Linkedin, Download, Instagram } from "lucide-react";

const up = (delay = 0) => ({
  initial: { y: 40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.9, ease: "easeOut", delay },
});

export default function Hero() {
  return (
    <div className="relative min-h-[100svh] flex flex-col items-center justify-center pt-28 pb-16">
      {/* portrait over the wall of roles */}
      <div className="relative w-full flex items-center justify-center py-6">
        <motion.div
          className="absolute inset-0 bg-center bg-cover opacity-40"
          style={{ backgroundImage: "url('/Hero4.png')" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.2 }}
        />
        <motion.div {...up(0)} className="relative z-10">
          <motion.div
            className="w-52 h-52 md:w-60 md:h-60 rounded-full bg-green-400 overflow-hidden border-4 border-white shadow-[0_0_40px_rgba(74,222,128,0.45)]"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <img src="/overlay.png" alt="Tilak" className="w-full h-full object-cover object-top scale-110 translate-y-3" />
          </motion.div>
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
