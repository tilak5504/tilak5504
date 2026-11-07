import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { ChevronDown, Menu, X, Camera, ArrowUpRight, MapPin, Calendar } from "lucide-react";
import Hero from "./components/Hero";
import ProofOfWork from "./components/ProofOfWork";
import {
  ScrollProgress,
  SectionHeading,
  ease,
  riseChild,
  staggerParent,
} from "./components/motion";
import {
  education,
  internships,
  projects,
  skillGroups,
  workExperience,
  type Job,
  type Project,
} from "./data/profile";

const NAV = ["About", "Education", "Experience", "Internships", "Skills", "Projects", "Proof of Work", "Contact Me"];
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

/* ───────────────────────── navigation ───────────────────────── */

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("about");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 400 && !menuOpen);
  });

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(slug(n));
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/75 backdrop-blur-md border-b border-black/5"
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.08 }}
        >
          <img src="/logo.svg" alt="Tilak logo" className="w-10 h-10" />
        </motion.a>

        <motion.div
          className="hidden lg:flex items-center gap-1"
          initial="hidden"
          animate="show"
          variants={staggerParent(0.05, 0.3)}
        >
          {NAV.map((item) => (
            <motion.a
              key={item}
              href={`#${slug(item)}`}
              variants={{ hidden: { opacity: 0, y: -12 }, show: { opacity: 1, y: 0 } }}
              className={`relative px-3 py-2 text-[15px] font-medium rounded-full transition-colors ${active === slug(item) ? "text-black" : "text-black/60 hover:text-black"}`}
            >
              {active === slug(item) && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-green-400/70" transition={{ type: "spring", stiffness: 380, damping: 30 }} />
              )}
              <span className="relative">{item}</span>
            </motion.a>
          ))}
          <motion.div variants={{ hidden: { opacity: 0, y: -12 }, show: { opacity: 1, y: 0 } }} className="ml-3">
            <a href="/photography" className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-orange-500 transition-colors">
              <Camera className="w-4 h-4" /> Photography
            </a>
          </motion.div>
        </motion.div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-black/5"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={menuOpen ? "x" : "m"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} className="block">
              {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="lg:hidden overflow-hidden border-t border-black/10 bg-white"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.4, ease }}
          >
            <motion.div className="px-4 pb-6 pt-2 flex flex-col" initial="hidden" animate="show" variants={staggerParent(0.04, 0.1)}>
              {NAV.map((item) => (
                <motion.a
                  key={item}
                  href={`#${slug(item)}`}
                  onClick={() => setMenuOpen(false)}
                  variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
                  className="py-3 text-2xl font-semibold border-b border-black/5 flex justify-between items-center"
                >
                  {item}
                  <ArrowUpRight className="w-5 h-5 text-black/30" />
                </motion.a>
              ))}
              <motion.a
                href="/photography"
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                className="mt-5 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-black text-white font-medium"
              >
                <Camera className="w-4 h-4" /> Photography
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ───────────────────────── education ───────────────────────── */

function EducationTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const line = useSpring(scrollYProgress, { stiffness: 100, damping: 25 });

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[3px] bg-black/10 rounded-full" />
      <motion.div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-green-400 to-orange-500 origin-top rounded-full" style={{ scaleY: line }} />

      <div className="space-y-14 md:space-y-20">
        {education.map((ed, i) => {
          const left = i % 2 === 0;
          return (
            <div key={ed.school} className={`relative flex md:items-center ${left ? "md:justify-start" : "md:justify-end"}`}>
              {/* dot */}
              <motion.div
                className="absolute left-4 md:left-1/2 -translate-x-1/2 top-2 md:top-1/2 md:-translate-y-1/2 z-10"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 1, margin: "0px 0px -35% 0px" }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <span className="block w-5 h-5 rounded-full bg-orange-500 ring-4 ring-white" />
              </motion.div>

              <motion.div
                className={`ml-12 md:ml-0 md:w-[44%] ${left ? "md:text-right md:pr-4" : "md:pl-4"}`}
                initial={{ opacity: 0, x: left ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <span className="font-mono text-xs tracking-widest text-orange-500">{ed.period}</span>
                <h3 className="text-xl md:text-2xl font-bold mt-1">{ed.school}</h3>
                <p className="text-base md:text-lg mt-2">
                  <motion.span
                    className="[box-decoration-break:clone] [-webkit-box-decoration-break:clone] bg-no-repeat"
                    style={{ backgroundImage: "linear-gradient(rgba(74,222,128,0.7), rgba(74,222,128,0.7))", backgroundPosition: "0 88%" }}
                    initial={{ backgroundSize: "0% 45%" }}
                    whileInView={{ backgroundSize: "100% 45%" }}
                    viewport={{ once: true, amount: 1 }}
                    transition={{ duration: 0.8, ease, delay: 0.4 }}
                  >
                    {ed.degree}
                    {ed.specialization ? ` — ${ed.specialization}` : ""}
                  </motion.span>
                </p>
                <p className="text-sm font-semibold mt-2 text-black/70">{ed.grade}</p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── jobs ───────────────────────── */

function Logo({ job }: { job: Job }) {
  const urls = Array.isArray(job.logoUrl) ? job.logoUrl : [job.logoUrl];
  const [i, setI] = useState(0);
  if (i >= urls.length)
    return <span className="w-full h-full grid place-items-center text-2xl font-bold bg-green-400">{job.company[0]}</span>;
  return (
    <img
      src={urls[i]}
      alt={`${job.company} logo`}
      referrerPolicy="no-referrer"
      onError={() => setI(i + 1)}
      className="w-full h-full object-contain p-2"
    />
  );
}

function JobCard({ job, open, onToggle }: { job: Job; open: boolean; onToggle: () => void }) {
  return (
    <motion.div variants={riseChild}>
      <motion.div
        layout
        onClick={onToggle}
        whileHover={{ y: -4 }}
        transition={{ layout: { duration: 0.45, ease } }}
        className={`group relative overflow-hidden rounded-2xl border bg-white p-5 md:p-6 cursor-pointer transition-[border-color,box-shadow] duration-300 ${
          open ? "border-green-400 shadow-[0_0_24px_rgba(74,222,128,0.3)]" : "border-black/10 hover:border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]"
        }`}
      >
        <motion.span
          className="absolute left-0 top-0 bottom-0 w-1.5 bg-green-400 origin-top"
          initial={false}
          animate={{ scaleY: open ? 1 : 0 }}
          transition={{ duration: 0.5, ease }}
        />
        <motion.div layout="position" className="relative flex items-start gap-4">
          <motion.div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-xl border border-black/10 bg-white overflow-hidden">
            <Logo job={job} />
          </motion.div>
          <div className="flex-grow min-w-0">
            <h3 className="text-lg md:text-xl font-bold">{job.company}</h3>
            <p className="text-base md:text-lg font-medium">{job.position}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-black/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {job.duration}
              </span>
              <span className="flex items-center gap-1.5 text-orange-500">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </span>
            </div>
          </div>
          <motion.span
            className="grid place-items-center w-9 h-9 rounded-full border border-black/15 flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.span>
        </motion.div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className="relative overflow-hidden"
            >
              <motion.ul className="pt-5 mt-5 border-t border-black/10 space-y-3" initial="hidden" animate="show" variants={staggerParent(0.06, 0.1)}>
                {job.responsibilities.map((r) => (
                  <motion.li
                    key={r}
                    className="flex items-start gap-3"
                    variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.4, ease } } }}
                  >
                    <span className="w-2 h-2 mt-2 bg-green-400 rounded-full flex-shrink-0" />
                    <span className="text-black/80">{r}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function JobList({ jobs }: { jobs: Job[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <motion.div className="space-y-5" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} variants={staggerParent(0.12)}>
      {jobs.map((job, i) => (
        <JobCard key={job.company} job={job} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
      ))}
    </motion.div>
  );
}

/* ───────────────────────── skills ───────────────────────── */

function SkillChip({ skill }: { skill: string }) {
  return (
    <motion.span
      variants={{
        hidden: { opacity: 0, y: 12 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
      }}
      className="group relative inline-flex overflow-hidden rounded-full border border-black/15 px-4 py-2 text-sm font-medium bg-white cursor-default transition-[border-color,box-shadow] duration-300 hover:border-green-400 hover:shadow-[0_0_15px_rgba(74,222,128,0.45)]"
    >
      <span className="absolute inset-0 bg-green-400 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
      <span className="relative">{skill}</span>
    </motion.span>
  );
}

function Skills() {
  return (
    <div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-12">
        {skillGroups.map((g, gi) => (
          <motion.div
            key={g.title}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerParent(0.04)}
          >
            <motion.h3
              className="flex items-center gap-3 text-sm font-mono tracking-[0.25em] uppercase text-black/50 mb-5"
              variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
            >
              <span className="text-orange-500">0{gi + 1}</span> {g.title}
            </motion.h3>
            <div className="flex flex-wrap gap-3">
              {g.skills.map((s) => (
                <SkillChip key={s} skill={s} />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── projects ───────────────────────── */

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div variants={riseChild} className="h-full">
      <motion.div
          layout
          transition={{ layout: { duration: 0.45, ease } }}
          onClick={() => setOpen((o) => !o)}
          className="h-full rounded-2xl border border-black/10 bg-white p-6 md:p-7 cursor-pointer shadow-sm hover:-translate-y-2 hover:border-green-400 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)] transition-all duration-300 flex flex-col"
        >
          <motion.div layout="position" className="flex items-start justify-between">
            <span className="font-mono text-5xl font-bold text-black/10">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-xs font-mono tracking-widest text-orange-500 text-right max-w-[60%]">{p.location}</span>
          </motion.div>
          <motion.h3 layout="position" className="text-2xl font-bold mt-2">
            {p.name}
          </motion.h3>
          <motion.p layout="position" className="mt-2">
            <span className="bg-green-400/70 px-1.5">{p.details}</span>
          </motion.p>
          <motion.p layout="position" className="text-sm text-black/60 mt-3 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {p.timeline}
          </motion.p>
          <motion.div layout className="relative mt-4 overflow-hidden" animate={{ height: open ? "auto" : 72 }} transition={{ duration: 0.5, ease }}>
            <p className="leading-relaxed text-black/80">{p.description}</p>
            <motion.div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" animate={{ opacity: open ? 0 : 1 }} />
          </motion.div>
          <motion.span layout="position" className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange-500">
            {open ? "Show less" : "Read more"}
            <motion.span animate={{ rotate: open ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </motion.span>
        </motion.div>
    </motion.div>
  );
}

/* ───────────────────────── page ───────────────────────── */

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white text-black relative overflow-x-clip">
        <ScrollProgress />
        <div className="fixed inset-0 grid-background opacity-40 pointer-events-none" />
        <Nav />

        <div className="relative z-10">
          <section id="about">
            <Hero />
          </section>

          <section className="py-24 px-4" id="education">
            <div className="max-w-5xl mx-auto">
              <SectionHeading index="01" kicker="Where I learnt" title="Education" />
              <EducationTimeline />
            </div>
          </section>

          <section className="py-24 px-4" id="experience">
            <div className="max-w-4xl mx-auto">
              <SectionHeading index="02" kicker="Where I work" title="Work Experience" />
              <JobList jobs={workExperience} />
            </div>
          </section>

          <section className="py-24 px-4" id="internships">
            <div className="max-w-4xl mx-auto">
              <SectionHeading index="03" kicker="Where I started" title="Internships" />
              <JobList jobs={internships} />
            </div>
          </section>

          <section className="py-24 px-4" id="skills">
            <SectionHeading index="04" kicker="What I bring" title="Skills" />
            <Skills />
          </section>

          <section className="py-24 px-4" id="projects">
            <div className="max-w-7xl mx-auto">
              <SectionHeading index="05" kicker="What I've built" title="Projects" />
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
                variants={staggerParent(0.12)}
              >
                {projects.map((p, i) => (
                  <ProjectCard key={p.name + p.details} p={p} i={i} />
                ))}
              </motion.div>
            </div>
          </section>

          <ProofOfWork />

          <footer className="py-28 px-4 overflow-hidden" id="contact-me">
            <div className="max-w-4xl mx-auto text-center">
              <motion.h2
                className="text-4xl md:text-6xl font-bold"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                Let's Connect
              </motion.h2>
              <motion.p
                className="text-xl mt-6 mb-10 text-black/70"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease, delay: 0.15 }}
              >
                Have a project in mind? Let's create something amazing together.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}>
                <a
                    href="mailto:pasupureddytilak@gmail.com"
                    className="inline-flex items-center gap-3 py-4 px-9 rounded-full text-lg font-bold bg-black text-white hover:bg-green-400 hover:text-black transition-colors"
                  >
                    Get in Touch <ArrowUpRight className="w-5 h-5" />
                  </a>
              </motion.div>
            </div>
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
