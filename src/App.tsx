import React, { useEffect, useState } from 'react';
import { Mail, Linkedin, Download, ChevronDown, Image, Youtube, Film, Instagram } from 'lucide-react';

interface WorkItem {
  title: string;
  link: string;
}

interface ProofOfWork {
  title: string;
  icon: React.ReactNode;
  items: WorkItem[];
}

interface Project {
  name: string;
  details: string;
  timeline: string;
  location: string;
  description: string;
}

interface Internship {
  company: string;
  position: string;
  subtitle: string;
  duration: string;
  location: string;
  responsibilities: string[];
  logoUrl: string;
}

function App() {
  const [expandedInternship, setExpandedInternship] = useState<number | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [expandedProof, setExpandedProof] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-item, .internship-item, .skill-item, .project-item, .proof-item').forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  const skills = [
    'Canva', 'MS Office', 'Google Suite', 'SEO', 'Content Creation', 
    'Podcast Production', 'Hubspot Marketing Hub', 'Email Marketing', 
    'Copywriting', 'Telecalling', 'Cold Mailing', 'Social Media Marketing',
    'HTML', 'Communication', 'Entrepreneurship', 'Time Management',
    'Adaptability', 'Problem Solving', 'Teamwork', 'Creativity',
    'Aptitude', 'Multi-tasking', 'Eye-to-detail'
  ];

  const proofOfWork: ProofOfWork[] = [
    {
      title: "Posters",
      icon: <Image className="w-6 h-6" />,
      items: [
        {
          title: "Collage",
          link: "https://www.canva.com/design/DAGYRERByLw/-RY6HbBP_SPSAFwKx74yYw/edit?utm_content=DAGYRERByLw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        },
        {
          title: "Poster",
          link: "https://www.canva.com/design/DAGPykRsWkY/IjXo8fGbssM9K-HxsbwJiQ/edit?utm_content=DAGPykRsWkY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        },
        {
          title: "College Event 1",
          link: "https://www.canva.com/design/DAF86i4gZQk/jEfwriOwaVaZDdKT05hbIg/edit?utm_content=DAF86i4gZQk&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        },
        {
          title: "College Event 2",
          link: "https://www.canva.com/design/DAF8lu9J9t8/y0SoaqE54cEbSjcUYnCqUw/edit?utm_content=DAF8lu9J9t8&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        },
        {
          title: "College Event 3",
          link: "https://www.canva.com/design/DAF7_OnQE88/04dkg5JRax2LXlt-qkOBwQ/edit?utm_content=DAF7_OnQE88&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        },
        {
          title: "Client Work 1",
          link: "https://www.canva.com/design/DAF7XYmg6NM/e5RQnFG1DFFTYuR8zN_usQ/edit?utm_content=DAF7XYmg6NM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        },
        {
          title: "Client Work 2",
          link: "https://www.canva.com/design/DAGG6ZIAEzM/fobbKkXHSW0C92jU_pmkEA/edit?utm_content=DAGG6ZIAEzM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        },
        {
          title: "Ready to Make College Event",
          link: "https://www.canva.com/design/DAGKhiQy5kw/QsOwbzZ4FkaRr9QamccjSA/edit?utm_content=DAGKhiQy5kw&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton"
        }
      ]
    },
    {
      title: "Reels",
      icon: <Film className="w-6 h-6" />,
      items: [
        {
          title: "@staidindia Typography Reel 1",
          link: "https://www.instagram.com/reel/DFnQGZZty45/?igsh=MWZwbHdsZmM4dzFsdQ=="
        },
        {
          title: "@tilak.5504 Car Edit",
          link: "https://www.instagram.com/reel/DF2pQKqvNBq/?igsh=MWw3dnMzYWIwOHUwcw=="
        },
        {
          title: "@staidindia Typography Reel 2",
          link: "https://www.instagram.com/reel/DBdroB5T8ri/?igsh=MWc5NGJhbG1ycnljeQ=="
        },
        {
          title: "@staidindia Typography Reel 3",
          link: "https://www.instagram.com/reel/DDv7VUvIpwZ/?igsh=MWx3eDI3dnZtcHN0NQ=="
        },
        {
          title: "@staidindia Meme Reel 1",
          link: "https://www.instagram.com/reel/C7WnEo3iaGV/?igsh=MTA4cGtmb3Bqd2xrOA=="
        },
        {
          title: "@staidindia Meme Reel 2",
          link: "https://www.instagram.com/reel/C4dmiWgiM2V/?igsh=amNjdzl4YmEyZGFz"
        },
        {
          title: "@aadit_the_highest_peak Reel Edit 1",
          link: "https://www.instagram.com/reel/C3Xp9UMvyZt/?igsh=eDhwanVzbW55OXQ4"
        },
        {
          title: "@aadit_the_highest_peak Reel Edit 2",
          link: "https://www.instagram.com/reel/C3MsKciPmEi/?igsh=MWlncjhxZHFxZzY5Mw=="
        },
        {
          title: "@fictionalframes Escape Shortfilm",
          link: "https://youtu.be/wOwXPLGLPjY?si=TLAEPtZh5qpXSekw"
        }
      ]
    },
    {
      title: "Podcasts",
      icon: <Youtube className="w-6 h-6" />,
      items: [
        {
          title: "@acuvate Podcast 1",
          link: "https://youtu.be/3DsbOnrOvJs?si=LXh7SzGR6gpN6rjE"
        },
        {
          title: "@acuvate Podcast 2",
          link: "https://youtu.be/jXGHHk7ZOPI?si=b4XhvuuLIqcHsDG6"
        },
        {
          title: "@lifeafter.agbs Podcast 1",
          link: "https://www.instagram.com/reel/Cz87Jy-PcyP/?igsh=dnFmamhiZWw4bjRi"
        },
        {
          title: "@lifeafter.agbs Podcast 2",
          link: "https://www.instagram.com/reel/Czgh9mSMfIQ/?igsh=MWN6am1lYmt0MjA5bw=="
        }
      ]
    }
  ];

  const projects: Project[] = [
    {
      name: "Videographer",
      details: "The Staid App · Freelance",
      timeline: "August 2024 - September 2024 · 2 months",
      location: "Rajahmundry, Andhra Pradesh, India · On-site",
      description: "Shot 15+ videos hiring a UGC creator and made typography videos for Instagram and YouTube."
    },
    {
      name: "Social Media Manager",
      details: "The Staid App · Freelance",
      timeline: "January 2024 - May 2024 · 5 months",
      location: "Remote",
      description: "Managed and grew social media presence for Staid.india, achieving 200 followers to 3000 followers on Instagram within 3 months. Monitored and analyzed performance using Meta Business Suite, achieving a 250% improvement in campaign effectiveness. Developed a content strategy with over 100 targeted keywords and 120+ posts, resulting in a 30% increase in engagement rates. Onboarded 7 UGC creators, increasing brand mentions by 40%. Executed 4 giveaway campaigns, averaging 40% participation increase. Engaged with followers, responding to over 500 comments."
    },
    {
      name: "Podcast Initiator",
      details: "Life After AGBS · Self-employed",
      timeline: "September 2023 - May 2024 · 9 months",
      location: "Rajahmundry, Andhra Pradesh, India · Hybrid",
      description: "Successfully launched and maintained a podcast series within the college community. Published three podcast episodes online featuring AGBS Alumni. Organized one offline event to strengthen community engagement. Grew social media presence to 250 followers within a month. Received positive feedback from listeners, indicating a positive impact."
    }
  ];

  const internships: Internship[] = [
    {
      company: 'Acuvate',
      position: 'Marketing Intern',
      subtitle: 'Acuvate · Internship',
      duration: 'Dec 2024 - Mar 2025 · 4 mos',
      location: 'Hyderabad, Telangana, India · On-site',
     responsibilities: [
      'Revamped all blog pages and landing pages, aligning them with SEO best practices, resulting in a 120% increase in active users.',
      'Led the end-to-end execution of webinar promotions using third-party platforms: handled platform selection, deal closures, event optimization, and lead tracking, securing 250+ registrations from targeted industries.',
      'Directed and participated in podcast production, client shoots, and website content creation, enhancing brand storytelling and visual identity.',
      'Managed company social media accounts and expanded community engagement across LinkedIn, Medium, Reddit, and Quora to strengthen thought leadership and brand visibility.',
      'Assisted in setting up or optimizing email marketing campaigns for nurturing leads from webinars and blogs.',
    ],
      logoUrl: 'https://acuvate.com/uk/wp-content/uploads/2022/01/cropped-acu-favicon.png'
    },
    {
      company: 'Solvprob Innovations Pvt. Ltd',
      position: 'Marketing Intern',
      subtitle: 'Solvprob Innovations Pvt. Ltd · Internship',
      duration: 'May 2024 - Jun 2024 · 2 mos',
      location: 'Hyderabad, Telangana, India · On-site',
      responsibilities: [
        'Curated content calendars, increased content output by 80%',
        'Managed social media, increased engagement by 330%',
        'Executed Meta ads for PI Cancer Care, Meera Charitable Trust, Dr. Bharat Patodiya, increased ad reach by 70%',
        'Maintained communication with 10+ clients'
      ],
      logoUrl: 'https://static.wixstatic.com/media/688008_1a000952caef48cca29502b19b4bca5c~mv2.png/v1/fill/w_605,h_641,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/logog_edited.png'
    },
    {
      company: 'Copy.ai',
      position: 'Community Manager',
      subtitle: 'Copy.ai · Internship',
      duration: 'Jan 2023 - Feb 2023 · 2 mos',
      location: 'Remote',
      responsibilities: [
        'Moderated community, increased interaction by 150%',
        'Reported key metrics for decision-making',
        'Cold messaged 100+ copywriters'
      ],
      logoUrl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR5-SCdRCKcDf8Qf3HTcPQtRObLs0cZUiwu3MuE6BxfRANa9_fk'
    }
  ];

  const toggleProject = (index: number) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  const toggleInternship = (index: number) => {
    setExpandedInternship(expandedInternship === index ? null : index);
  };

  const toggleProof = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedProof(expandedProof === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white text-black relative">
      <svg className="hidden">
        <filter id="rough">
          <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
        </filter>
      </svg>

      <div className="fixed inset-0 grid-background opacity-40"></div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
             <img
      src="/logo.svg"
      alt="Logo"
      className="w-10 h-10" // Same size as Cpu icon
    />
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['About', 'Education', 'Internships', 'Skills', 'Projects', 'Proof of Work', 'Contact Us'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-lg font-medium nav-link relative"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10">
        <header className="min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="max-w-4xl text-center">
            <div className="mb-8 relative inline-block">
              <div className="w-48 h-48 rounded-full bg-white sketch-border overflow-hidden mx-auto">
                <img
                  src="/overlay.png" // Changed to absolute path 
                  alt="Profile"
                  className="w-full h-full object-cover sketch-image"
                />
              </div>
            </div>
            <h1 className="text-7xl font-bold mb-6">
              Hi, I am <span className="hero-name-highlight">Tilak</span>
            </h1>
            <p className="text-2xl mb-8 orange-glow">
             Marketing meets storytelling—crafting digital experiences that engage.
            </p>
            
            <div className="flex justify-center gap-6 items-center">
              <a href="/resume.pdf" className="download-btn flex items-center gap-2"
                target="_blank" // Opens in new tab (optional)
    rel="noopener noreferrer">
                <Download className="w-5 h-5" />
                Download Resume
              </a>

<div className="flex gap-4">
  
  <a
    href="https://www.instagram.com/tilak.5504"
    className="sketch-border p-3 rounded-lg hover:scale-110 transition-transform"
    target="_blank" // Opens in new tab
    rel="noopener noreferrer" // Security best practice
  >
                  <Instagram className="w-8 h-8" />
                </a>
                <a href="https://www.linkedin.com/in/tilakpasupureddy/" className="sketch-border p-3 rounded-lg hover:scale-110 transition-transform"
                  target="_blank" // Opens in new tab
  rel="noopener noreferrer" // Security best practice
>
                  <Linkedin className="w-8 h-8" />
                </a>
                <a href="mailto:pasupureddytilak@gmail.com" className="sketch-border p-3 rounded-lg hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
        </header>

        <section className="py-20 px-4" id="education">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Education</h2>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-400 timeline-line"></div>
              
              <div className="space-y-12">
                {[
                  {
                    school: 'Aditya Global Business School',
                    degree: 'Bachelor of Business Administration - BBA',
                    period: '2022 - 2025',
                    grade: 'Grade: 8.8'
                  },
                  {
                    school: 'Sasi Junior College',
                    degree: 'Intermediate',
                    specialization: 'MPC',
                    period: 'October 2020 - May 2022',
                    grade: 'Grade: 9.4'
                  },
                  {
                    school: 'Sri Chaitanya School',
                    degree: 'SSC',
                    period: 'July 2019 - September 2020',
                    grade: 'Grade: 10'
                  }
                ].map((education, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'justify-start' : 'justify-end'
                    } timeline-item`}
                  >
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-500 rounded-full timeline-dot"></div>
                    
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                      <div>
                        <h3 className="text-xl font-bold">{education.school}</h3>
                        <p className="text-lg mt-1">
                          <span className="hero-name-highlight">{education.degree}</span>
                          {education.specialization && (
                            <> - <span className="hero-name-highlight">{education.specialization}</span></>
                          )}
                        </p>
                        <p className="text-sm mt-1">{education.period}</p>
                        <p className="text-sm font-semibold mt-1">{education.grade}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-white" id="internships">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Internships</h2>
            <div className="space-y-6">
              {internships.map((internship, index) => (
                <div
                  key={index}
                  className="internship-item opacity-0 transform translate-y-10 transition-all duration-500 ease-out"
                  onClick={() => toggleInternship(index)}
                >
                  <div className="sketch-border bg-white p-6 rounded-lg cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 flex-shrink-0">
                        <div className="w-full h-full relative sketch-border rounded-lg overflow-hidden">
                          <img
                            src={internship.logoUrl}
                            alt={`${internship.company} logo`}
                            className="w-full h-full object-contain p-2 sketch-image"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold">{internship.company}</h3>
                        <p className="text-lg hero-name-highlight">{internship.position}</p>
                        <p className="text-sm text-gray-600">{internship.subtitle}</p>
                        <p className="text-sm">{internship.duration}</p>
                        <p className="text-sm orange-glow">{internship.location}</p>
                      </div>
                      <ChevronDown
                        className={`w-6 h-6 flex-shrink-0 transform transition-transform duration-300 ${
                          expandedInternship === index ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                    
                    <div
                      className={`mt-4 overflow-hidden transition-all duration-300 ${
                        expandedInternship === index ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="font-bold mb-2">Responsibilities:</h4>
                        <ul className="space-y-2">
                          {internship.responsibilities.map((responsibility, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="w-2 h-2 mt-2 bg-green-400 rounded-full flex-shrink-0"></span>
                              <span>{responsibility}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4" id="skills">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Skills</h2>
            <div className="skills-container">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="skill-item"
                  onMouseEnter={() => setHoveredSkill(index)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="skill-cube">
                    <div className="skill-cube-face front">
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                    <div className="skill-cube-face back"></div>
                    <div className="skill-cube-face right"></div>
                    <div className="skill-cube-face left"></div>
                    <div className="skill-cube-face top"></div>
                    <div className="skill-cube-face bottom"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-white/50" id="projects">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="project-item opacity-0 transform translate-y-10 transition-all duration-500 ease-out"
                  onClick={() => toggleProject(index)}
                >
                  <div className="sketch-border bg-white p-6 rounded-lg cursor-pointer project-card">
                    <h3 className="text-2xl font-bold mb-3">{project.name}</h3>
                    <p className="text-lg hero-name-highlight mb-2">{project.details}</p>
                    <p className="text-sm mb-2">{project.timeline}</p>
                    <p className="text-sm orange-glow mb-4">{project.location}</p>
                    
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        expandedProject === index ? 'max-h-[500px]' : 'max-h-24'
                      }`}
                    >
                      <p className="text-base leading-relaxed">{project.description}</p>
                    </div>
                    
                    <button
                      className="mt-4 flex items-center gap-2 text-sm font-medium orange-glow hover:text-green-500 transition-colors"
                    >
                      {expandedProject === index ? 'Show Less' : 'Read More'}
                      <ChevronDown
                        className={`w-4 h-4 transform transition-transform duration-300 ${
                          expandedProject === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-black" id="proof-of-work">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center text-white">Proof of Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {proofOfWork.map((category, index) => (
                <div key={index} className="proof-item opacity-0 transform translate-y-10 transition-all duration-500 ease-out">
                  <div className="proof-card sketch-border bg-black/50 p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-green-400">{category.icon}</div>
                      <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    </div>
                    
                    <button
                      className="w-full flex items-center justify-between px-4 py-2 text-white hover:text-orange-500 transition-colors"
                      onClick={() => setExpandedProof(expandedProof === index ? null : index)}
                    >
                      <span>View Work</span>
                      <ChevronDown
                        className={`w-5 h-5 text-orange-500 transform transition-transform duration-300 ${
                          expandedProof === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <div
                      className={`mt-4 overflow-hidden transition-all duration-300 ${
                        expandedProof === index ? 'max-h-[800px]' : 'max-h-0'
                      }`}
                    >
                      <ul className="space-y-3">
                        {category.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-2 h-2 mt-2 bg-green-400 rounded-full flex-shrink-0"></span>
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/80 hover:text-orange-500 transition-colors"
                            >
                              {item.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-20 px-4" id="contact-us">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Let's Connect</h2>
            <p className="text-xl mb-8">
              Have a project in mind? Let's create something amazing together.
            </p>
            <a
              href="mailto:pasupureddytilak@gmail.com"
              className="sketch-border inline-block py-3 px-8 rounded-lg text-lg font-bold hover:scale-110 transition-transform orange-glow"
            >
              Get in Touch
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;

if (import.meta.env.MODE === "development" && import.meta.hot) {
  import.meta.hot.accept();
}
