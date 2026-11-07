// ─────────────────────────────────────────────────────────────
//  EDIT YOUR PROFILE HERE — education, jobs, skills and projects.
// ─────────────────────────────────────────────────────────────

export type Job = {
  company: string;
  position: string;
  subtitle: string;
  duration: string;
  location: string;
  responsibilities: string[];
  logoUrl: string;
};

export type Project = {
  name: string;
  details: string;
  timeline: string;
  location: string;
  description: string;
};

export type Education = {
  school: string;
  degree: string;
  specialization?: string;
  period: string;
  grade: string;
};

export const education: Education[] = [
  {
    school: "SVKM's NMIMS University, Hyderabad",
    degree: "Master of Business Administration - MBA",
    period: "2026 - 2028",
    grade: "CGPA: 8.13/10",
  },
  {
    school: "Aditya Global Business School",
    degree: "Bachelor of Business Administration - BBA",
    period: "2022 - 2025",
    grade: "Grade: 8.62",
  },
  {
    school: "Sasi Junior College",
    degree: "Intermediate",
    specialization: "MPC",
    period: "October 2020 - May 2022",
    grade: "Grade: 9.4",
  },
];

export const workExperience: Job[] = [
  {
    company: "Comment Seed",
    position: "Founding Team · Client Lead",
    subtitle: "Comment Seed · Part-time",
    duration: "Part-time · Present",
    location: "Reddit marketing for AI & SaaS",
    responsibilities: [
      "Part of the founding team at Comment Seed, a Reddit marketing engine for AI and SaaS brands.",
      "Client lead for one of our major clients, owning their Reddit strategy and delivery end-to-end.",
      "Build presence in relevant subreddits and spark organic discussions that keep the brand mentioned consistently.",
      "Set up official brand accounts for an established identity, and run Reddit Ads for a steady paid presence.",
      "Target keywords and AEO prompts so clients show up in search and AI answers, and grow brand subreddits into communities.",
    ],
    logoUrl: "/commentseed.svg",
  },
  {
    company: "StudioExalt",
    position: "Social Media Manager",
    subtitle: "StudioExalt · Work Experience",
    duration: "Mar 2026 - Jun 2026 · 4 mos",
    location: "Hybrid",
    responsibilities: [
      "Managed 7+ client accounts across food, café, skincare, corporate and interior design brands.",
      "Increased average organic reach by 110% through strategic content planning and short-form video optimization.",
      "Designed 40+ marketing creatives leveraging AI tools to improve efficiency and output.",
    ],
    logoUrl: "/logo.svg",
  },
];

export const internships: Job[] = [
  {
    company: "Swiggy",
    position: "Culture & Communications Intern",
    subtitle: "Swiggy · Internship",
    duration: "Apr 2025 - May 2025 · 2 mos",
    location: "Bangalore, Karnataka, India · Hybrid",
    responsibilities: [
      "Ideated, scripted, and packaged 2+ internal videos to drive employee engagement and cultural storytelling.",
      "Wrote growth stories of Swiggsters for the Swiggy Verse platform, showcasing employee journeys.",
      "Built custom GPTs to streamline internal communications and simplify org-wide information flows.",
      "Shared 25+ GenAI tips on Slack, promoting practical Gemini use cases across cross-functional teams.",
      "Coordinated with stakeholders to collect story inputs in both text and video formats.",
    ],
    logoUrl:
      "https://cdn.brandfetch.io/idQZk-y8Sy/w/400/h/400/theme/dark/icon.jpeg?c=1dxbfHSJFAPEGdCLU4o5B",
  },
  {
    company: "Acuvate",
    position: "Marketing Intern",
    subtitle: "Acuvate · Internship",
    duration: "Dec 2024 - Mar 2025 · 4 mos",
    location: "Hyderabad, Telangana, India · On-site",
    responsibilities: [
      "Revamped all blog pages and landing pages, aligning them with SEO best practices, resulting in a 120% increase in active users.",
      "Led the end-to-end execution of webinar promotions using third-party platforms: handled platform selection, deal closures, event optimization, and lead tracking, securing 250+ registrations from targeted industries.",
      "Directed and participated in podcast production, client shoots, and website content creation, enhancing brand storytelling and visual identity.",
      "Managed company social media accounts and expanded community engagement across LinkedIn, Medium, Reddit, and Quora to strengthen thought leadership and brand visibility.",
      "Assisted in setting up or optimizing email marketing campaigns for nurturing leads from webinars and blogs.",
    ],
    logoUrl:
      "https://acuvate.com/uk/wp-content/uploads/2022/01/cropped-acu-favicon.png",
  },
  {
    company: "Solvprob Innovations Pvt. Ltd",
    position: "Marketing Intern",
    subtitle: "Solvprob Innovations Pvt. Ltd · Internship",
    duration: "May 2024 - Jun 2024 · 2 mos",
    location: "Hyderabad, Telangana, India · On-site",
    responsibilities: [
      "Curated content calendars, increased content output by 80%",
      "Managed social media, increased engagement by 330%",
      "Executed Meta ads for PI Cancer Care, Meera Charitable Trust, Dr. Bharat Patodiya, increased ad reach by 70%",
      "Maintained communication with 10+ clients",
    ],
    logoUrl:
      "https://static.wixstatic.com/media/688008_1a000952caef48cca29502b19b4bca5c~mv2.png/v1/fill/w_605,h_641,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/logog_edited.png",
  },
  {
    company: "Copy.ai",
    position: "Community Manager",
    subtitle: "Copy.ai · Internship",
    duration: "Jan 2023 - Feb 2023 · 2 mos",
    location: "Remote",
    responsibilities: [
      "Moderated community, increased interaction by 150%",
      "Reported key metrics for decision-making",
      "Cold messaged 100+ copywriters",
    ],
    logoUrl:
      "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR5-SCdRCKcDf8Qf3HTcPQtRObLs0cZUiwu3MuE6BxfRANa9_fk",
  },
];

export const projects: Project[] = [
  {
    name: "New Product Development",
    details: "GoMechanic · Live Project",
    timeline: "September 2026 - Present",
    location: "Strategy & Virality",
    description:
      "Benchmarking 15 auto-accessory categories worth ₹1,687 Cr+ in stated TAM, analysing competitive pricing, product breadth, packaging trends and promotional strategies. Building a virality playbook for Amazon and Flipkart, with share-worthy product, packaging and unboxing concepts for car fresheners, dashboard décor and showpieces.",
  },
  {
    name: "Videographer",
    details: "The Staid App · Freelance",
    timeline: "August 2024 - September 2024 · 2 months",
    location: "Rajahmundry, Andhra Pradesh, India · On-site",
    description:
      "Shot 15+ videos hiring a UGC creator and made typography videos for Instagram and YouTube.",
  },
  {
    name: "Social Media Manager",
    details: "The Staid App · Freelance",
    timeline: "January 2024 - May 2024 · 5 months",
    location: "Remote",
    description:
      "Managed and grew social media presence for Staid.india, achieving 200 followers to 3000 followers on Instagram within 3 months. Monitored and analyzed performance using Meta Business Suite, achieving a 250% improvement in campaign effectiveness. Developed a content strategy with over 100 targeted keywords and 120+ posts, resulting in a 30% increase in engagement rates. Onboarded 7 UGC creators, increasing brand mentions by 40%. Executed 4 giveaway campaigns, averaging 40% participation increase. Engaged with followers, responding to over 500 comments.",
  },
  {
    name: "Podcast Initiator",
    details: "Life After AGBS · Self-employed",
    timeline: "September 2023 - May 2024 · 9 months",
    location: "Rajahmundry, Andhra Pradesh, India · Hybrid",
    description:
      "Successfully launched and maintained a podcast series within the college community. Published three podcast episodes online featuring AGBS Alumni. Organized one offline event to strengthen community engagement. Grew social media presence to 250 followers within a month. Received positive feedback from listeners, indicating a positive impact.",
  },
];

/** Skills, grouped. Add or move a skill by editing these lists. */
export const skillGroups: { title: string; skills: string[] }[] = [
  {
    title: "Reddit & Community",
    skills: ["Reddit Marketing", "Subreddit Strategy", "Reddit Ads", "AEO", "Organic Brand Mentions", "Community Building"],
  },
  {
    title: "Growth & Performance",
    skills: ["SEO", "Keyword Research", "Meta Ads", "Performance Marketing", "Marketing Analytics", "Market Research", "Hubspot Marketing Hub", "Email Marketing", "Social Media Marketing", "Cold Mailing", "Telecalling"],
  },
  {
    title: "Content & Creative",
    skills: ["Content Creation", "Copywriting", "Video Editing", "Podcast Production", "Generative AI", "Canva"],
  },
  {
    title: "Tools",
    skills: ["MS Office", "Google Suite", "HTML"],
  },
  {
    title: "How I work",
    skills: ["Strategic Thinking", "Stakeholder Management", "Communication", "Entrepreneurship", "Time Management", "Adaptability", "Problem Solving", "Teamwork", "Creativity", "Aptitude", "Multi-tasking", "Eye-to-detail"],
  },
];
