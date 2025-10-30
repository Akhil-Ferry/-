import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import './App.css';

export const BackgroundCanvas = ({ isDarkMode, currentSection }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeAndDraw = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // simple subtle gradient background instead of particles
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (isDarkMode) {
        g.addColorStop(0, 'rgba(255,255,255,0.02)');
        g.addColorStop(1, 'rgba(0,0,0,0.18)');
      } else {
        g.addColorStop(0, 'rgba(0,0,0,0.03)');
        g.addColorStop(1, 'rgba(255,255,255,0.04)');
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeAndDraw();
    window.addEventListener('resize', resizeAndDraw);
    return () => window.removeEventListener('resize', resizeAndDraw);
  }, [isDarkMode, currentSection]);

  return <canvas ref={canvasRef} id="bgCanvas" style={{ position: 'fixed', inset: 0, zIndex: 0 }} />;
};

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentSection, setCurrentSection] = useState('hero');

  // scroll helper
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    setIsLoaded(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setIsDarkMode(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const ids = ['hero-section', 'about', 'projects', 'experience', 'contact'];
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const map = {
            'hero-section': 'hero',
            about: 'about',
            projects: 'projects',
            experience: 'experience',
            contact: 'contact'
          };
          setCurrentSection(map[id] || 'hero');
        }
      });
    }, { threshold: 0.45 });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <main className="modern-portfolio" style={{ display: 'flex', flexDirection: 'column', gap: '0', alignItems: 'stretch' }}>
      <BackgroundCanvas isDarkMode={isDarkMode} currentSection={currentSection} />

      {/* HEADER: name left, nav buttons right */}
      <header className="navbar" role="navigation" aria-label="Main navigation" style={{ zIndex: 1001 }}>
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => scrollTo('hero-section')}>
          Akhil Pulipaka
        </div>

        <div className="nav-links" role="menu" aria-label="Sections">
          <button className="nav-btn" onClick={() => scrollTo('about')} aria-label="About">About</button>
          <button className="nav-btn" onClick={() => scrollTo('projects')} aria-label="Projects">Projects</button>
          <button className="nav-btn" onClick={() => scrollTo('experience')} aria-label="Experience">Experience</button>
          <button className="nav-btn" onClick={() => scrollTo('contact')} aria-label="Contact">Contact</button>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDarkMode ? 'Switch to light' : 'Switch to dark'}
            style={{ marginLeft: 8 }}
          >
            {isDarkMode ? (
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <circle cx="12" cy="12" r="4" fill="currentColor" />
                <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
                  <line x1="12" y1="1.5" x2="12" y2="4.5" />
                  <line x1="12" y1="19.5" x2="12" y2="22.5" />
                  <line x1="1.5" y1="12" x2="4.5" y2="12" />
                  <line x1="19.5" y1="12" x2="22.5" y2="12" />
                  <line x1="4.2" y1="4.2" x2="6.1" y2="6.1" />
                  <line x1="17.9" y1="17.9" x2="19.8" y2="19.8" />
                  <line x1="4.2" y1="19.8" x2="6.1" y2="17.9" />
                  <line x1="17.9" y1="6.1" x2="19.8" y2="4.2" />
                </g>
              </svg>
            ) : (
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M21 12.8A8.5 8.5 0 1111.2 3a6.5 6.5 0 109.8 9.8z" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <section id="hero-section" className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="hero-content" style={{ width: '100%', maxWidth: 1200, padding: '0 1.25rem' }}>
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="hero-title" style={{ textAlign: 'center' }}>
              <span className="gradient-text">Computer Science</span><br />
              Engineer & Developer
            </h1>
            <p className="hero-description" style={{ textAlign: 'center' }}>
              Passionate about creating innovative solutions through code.
              Recently Graduated from SR University.
            </p>
            <div className="hero-buttons" style={{ justifyContent: 'center' }}>
              <a href="#projects" className="btn-primary" onClick={(e) => { e.preventDefault(); scrollTo('projects'); }}>View Projects</a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=pulipakaakhil@gmail.com"
                className="btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Compose email in Gmail"
              >
                Contact Me
              </a>
            </div>
          </motion.div>
        </div>

        <div className="hero-spline" aria-hidden style={{ position: 'absolute', inset: 0 }}>
          <Spline
            scene="https://prod.spline.design/hmTzkUgC8bJjZveF/scene.splinecode"
            style={{ pointerEvents: 'none', width: '100%', height: '100%' }}
          />
          <div className="spline-gradient-overlay" />
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="section-title">About Me</h2>
            <div className="title-underline" />
          </motion.div>

          <div className="about-content">
            <motion.div className="about-text" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}>
              <p>
                Passionate Software Engineer skilled in C++, Python, JavaScript and Java, with strong foundations in
                data structures, algorithms and object-oriented programming. Experienced in developing AI-powered
                and full-stack applications using PyTorch, TensorFlow and Spring Boot. Adept at problem-solving,
                collaborative coding, and learning new technologies—aligned with Microsoft's culture of innovation and
                continuous growth.
              </p>
              <div className="social-links">
                <a href="https://www.linkedin.com/in/akhil-pulipaka-6901a7263/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">
                  <span className="social-in" aria-hidden="true">in</span>
                </a>
                <a href="https://github.com/Akhil-Ferry" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub" className="github-link">
                  {/* place github.svg in /public (e.g. public/github.svg) */}
                  <img src="/github.svg" alt="GitHub" className="social-img" />
                </a>
                <a href="https://leetcode.com/u/pulipakaakhil/" target="_blank" rel="noopener noreferrer" aria-label="LeetCode" title="LeetCode">
                  <span className="code-symbol" aria-hidden="true">&lt;/&gt;</span>
                </a>
              </div>
            </motion.div>

            <motion.div className="profile-image-container" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
              <img src={isDarkMode ? '/mask-white.png' : '/mask-black.png'} alt="Akhil Pulipaka" className="profile-image" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section skills-section">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="section-title">Technical Skills</h2>
            <div className="title-underline" />
          </motion.div>

          <div className="skills-grid">
            {[
              { name: 'C', icon: '/c.png', level: 70 },
              { name: 'C++', icon: '/c++.png', level: 70 },
              { name: 'Java', icon: '/java.png', level: 70 },
              { name: 'Python', icon: '/python.png', level: 70 },
              { name: 'PyTorch', icon: '/pytorch.png', level: 62 },
              { name: 'TensorFlow', icon: '/tensorflow.png', level: 70 },
              { name: 'JavaScript', icon: '/javascript.png', level: 75 },
              { name: 'React.js', icon: '/react.png', level: 75 },
              { name: 'Node.js', icon: '/nodejs.png', level: 70 },
              { name: 'Spring Boot', icon: '/springboot.png', level: 25 },
              { name: 'MySQL', icon: '/mysql.png', level: 78 },
              { name: 'PostgreSQL', icon: '/postgresql.png', level: 75 },
              { name: 'MongoDB', icon: '/mongodb.png', level: 80 }
            ].map((skill, index) => (
              <motion.div key={skill.name} className="skill-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -5, scale: 1.02 }} transition={{ duration: 0.4, delay: index * 0.1 }} viewport={{ once: true }}>
                <div className="skill-icon-wrapper">
                  <img src={skill.icon} alt={skill.name} className="skill-icon" />
                </div>
                <h3 className="skill-name">{skill.name}</h3>
                <div className="skill-progress">
                  <div className="skill-progress-bar" style={{ width: `${skill.level}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="section projects-section">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="section-title">Featured Projects</h2>
            <div className="title-underline" />
          </motion.div>

          <div className="projects-grid">
            {[
              {
                title: "Fine-Tuned Vision-Language Model for Sports Image",
                description: "Fine-tuned the BLIP model on a custom sports dataset to generate context-aware image captions. Integrated DETR for object detection to enhance caption accuracy and scene understanding.",
                tech: ["PyTorch", "BLIP", "DETR", "Python", "Computer Vision"],
                image: '/project1.png'
              },
              {
                title: "Resume AI",
                description: "AI-powered platform that analyzes resumes and provides keyword-based improvement suggestions. Integrated an NLP-driven chatbot to generate tailored resume content aligned with job descriptions.",
                tech: ["NLP", "AI", "React", "SpringBoot", "API"],
                image: '/project2.png'
              },
              {
                title: "Student Database Management",
                description: "A comprehensive system to track and manage student data using Flask and MySQL with advanced filtering and reporting capabilities.",
                tech: ["Flask", "MySQL", "Python", "Bootstrap"],
                image: '/project3.png'
              }
            ].map((project, index) => (
              <motion.div key={project.title} className="project-card" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} whileHover={{ y: -10 }} transition={{ duration: 0.6, delay: index * 0.2 }} viewport={{ once: true }}>
                <div className="project-image" style={{ backgroundImage: `url(${project.image})` }}>
                  <div className="project-overlay">
                    <button className="view-project-btn">View Project</button>
                  </div>
                </div>
                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map(tech => <span key={tech} className="tech-tag">{tech}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section education-section">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="section-title">Education</h2>
            <div className="title-underline" />
          </motion.div>

          <div className="education-timeline">
            {[
              {
                degree: "Micro-Credit Program (Computer Science)",
                institution: "Daksh Gurukul — IIT Guwahati",
                period: "May 2024 - Nov 2025",
                description: "Focused on C++, System Design, and Web Development with hands-on projects and industry-aligned curriculum."
              },
              {
                degree: "B.Tech Computer Science",
                institution: "SR University, Warangal",
                period: "Nov 2021 - Jul 2025",
                description: "Pursuing undergraduate degree with focus on software development, AI, data structures and algorithms."
              },
              {
                degree: "Intermediate (12th)",
                institution: "SR-Edu Center, Hanamakonda",
                period: "2019-2021",
                description: "Completed with 71% focusing on Mathematics, Physics, and Chemistry."
              }
            ].map((edu, index) => (
              <motion.div key={edu.degree} className="education-item" initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }} viewport={{ once: true }}>
                <div className="education-content">
                  <div className="education-year">{edu.period}</div>
                  <h3 className="education-degree">{edu.degree}</h3>
                  <h4 className="education-institution">{edu.institution}</h4>
                  <p className="education-description">{edu.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="section experience-section">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="section-title">Professional Experience</h2>
            <div className="title-underline" />
          </motion.div>

          <div className="education-timeline">
            {[
              {
                degree: "AI-ML Engineer (Intern)",
                institution: "AlphaTerra (Prop-Tech)",
                period: "Jul 2025 - Oct 2025",
                location: "Hyderabad, Telangana",
                description: "Developed Python-based ML pipelines for predictive analytics, including data scraping, processing, and building a house price prediction model using XGBoost. Worked on a RAG application with LangChain for intelligent information retrieval and context-aware responses."
              }
            ].map((exp, index) => (
              <motion.div key={exp.degree} className="education-item" initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: index * 0.2 }} viewport={{ once: true }}>
                <div className="education-content">
                  <div className="education-year">{exp.period}</div>
                  <h3 className="education-degree">{exp.degree}</h3>
                  <h4 className="education-institution">{exp.institution}</h4>
                  {exp.location && <p className="education-location" style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>{exp.location}</p>}
                  <p className="education-description">{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="container">
          <motion.div className="section-header" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="section-title">Get In Touch</h2>
            <div className="title-underline" />
            <p className="section-subtitle">Let's collaborate on exciting projects or discuss opportunities</p>
          </motion.div>

          <div className="contact-content">
            <motion.a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=pulipakaakhil@gmail.com"
              className="contact-email"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compose email in Gmail"
            >
              pulipakaakhil@gmail.com
            </motion.a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Akhil Pulipaka. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
};

export default App;
