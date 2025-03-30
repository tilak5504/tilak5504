import { motion } from "framer-motion";
import { Mail, Linkedin, Download, Instagram } from "lucide-react";

export default function Hero() {
  return (
    <div className="py-20">
      <div
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBlock: "2rem",
        }}
      >
        {/* Background Image */}
        <div
          style={{
            backgroundImage: "url('/Hero4.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0.5,
          }}
        />

        {/* Overlay Image with Slide-Up Animation */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-56 h-56 sketch-border overflow-hidden mx-auto relative z-10 mt-5"
        >
          <div className="w-full h-full relative">
            <img
              src="/overlay.png"
              alt="Profile"
              className="w-full h-full object-cover mt-5"
              style={{
                filter: "drop-shadow(0 0 10px rgba(74, 222, 128, 0.7)",
                //Orange looks better, check it out - orange-glow: rgba(255, 165, 0, 0.7))
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Text and Buttons with Slide-Up Animation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} // Delayed animation for smooth effect
        className="text-center"
      >
        <h1 className="text-7xl min-w-full font-bold mb-6">
          Hi, I am <span className="hero-name-highlight">Tilak</span>
        </h1>
        <p className="text-2xl mb-8 orange-glow">
          Marketing meets storytelling—crafting digital experiences that engage.
        </p>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }} // Slight delay for buttons
          className="flex justify-center gap-6 items-center"
        >
          <a
            href="/resume.pdf"
            className="download-btn flex items-center gap-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-5 h-5" />
            Download Resume
          </a>

          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/tilak.5504"
              className="sketch-border p-3 rounded-lg hover:scale-110 transition-transform"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="w-8 h-8" />
            </a>
            <a
              href="https://www.linkedin.com/in/tilakpasupureddy/"
              className="sketch-border p-3 rounded-lg hover:scale-110 transition-transform"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="w-8 h-8" />
            </a>
            <a
              href="mailto:pasupureddytilak@gmail.com"
              className="sketch-border p-3 rounded-lg hover:scale-110 transition-transform"
            >
              <Mail className="w-8 h-8" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
