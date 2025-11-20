import React, { useState, useEffect, useRef } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  Twitter, 
  ExternalLink, 
  Code, 
  Brain, 
  Server, 
  Terminal, 
  Menu, 
  X, 
  Download, 
  ArrowRight,
  MapPin,
  GraduationCap,
  Languages,
  ChevronRight,
  Zap,
  Layers,
  Rocket
} from 'lucide-react';
import * as THREE from 'three';

// --- Theme & Constants ---
const PRIMARY_COLOR = 'rgb(0, 255, 255)'; // Neon Cyan
const SECONDARY_COLOR = 'rgb(120, 0, 255)'; // Deep Violet

// --- Components ---

const Section = ({ id, className, children }) => (
  <section id={id} className={`py-20 relative ${className}`}>
    {children}
  </section>
);

const GlassCard = ({ children, className = "", hoverEffect = true }) => (
  <div className={`
    bg-gray-900/50 border border-cyan-400/10 rounded-xl p-6 shadow-2xl transition-all duration-300
    ${hoverEffect ? 'hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] hover:border-cyan-400/40' : ''}
    ${className}
  `}>
    {children}
  </div>
);

const SkillTag = ({ name }) => (
  <span className="px-3 py-1 rounded-full text-xs font-mono bg-gray-800 border border-gray-700 text-cyan-300 hover:border-cyan-400 hover:text-white hover:bg-cyan-900/30 transition-all transform hover:scale-105 cursor-default">
    {name}
  </span>
);

const Background3D = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 60;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    // Material for Dots - Neon Cyan
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x00ffff, 
      transparent: true,
      opacity: 0.8,
    });

    // Material for Lines - Deep Violet
    const linesMaterial = new THREE.LineBasicMaterial({
      color: 0x7800ff, 
      transparent: true,
      opacity: 0.15
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += mouseX * 0.01;
      particlesMesh.rotation.x += mouseY * 0.01;

      // Dynamic Lines
      const childrenToRemove = [];
      scene.traverse((child) => {
        if (child.isLine) childrenToRemove.push(child);
      });
      childrenToRemove.forEach((child) => scene.remove(child));

      const positions = particlesMesh.geometry.attributes.position.array;
      const lineGeo = new THREE.BufferGeometry();
      const linePos = [];

      for (let i = 0; i < particlesCount; i++) {
        for (let j = i + 1; j < particlesCount; j++) {
          const x1 = positions[i * 3];
          const y1 = positions[i * 3 + 1];
          const z1 = positions[i * 3 + 2];
          const x2 = positions[j * 3];
          const y2 = positions[j * 3 + 1];
          const z2 = positions[j * 3 + 2];
          const dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));

          if (dist < 7) {
            linePos.push(x1, y1, z1);
            linePos.push(x2, y2, z2);
          }
        }
      }

      if (linePos.length > 0) {
        lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
        const lines = new THREE.LineSegments(lineGeo, linesMaterial);
        scene.add(lines);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      scene.clear();
    };
  }, []);

  return <div ref={mountRef} className="fixed top-0 left-0 w-full h-screen -z-10 opacity-70" />;
};

// --- Main Application ---

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
    setActiveSection(href.substring(1));
  };
  
  // Custom Hook to observe scroll position for active link
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: '-30% 0px -60% 0px', // Adjusted to better capture sections
        threshold: 0.1,
      }
    );

    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);


  return (
    <div className="min-h-screen bg-[#01040f] text-slate-100 font-inter selection:bg-cyan-500/30 selection:text-white">
      <Background3D />

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-[#01040f]/90 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer group" onClick={(e) => scrollToSection(e, '#home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-full flex items-center justify-center text-gray-900 font-extrabold text-xl shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/50 transition-shadow">
                KS
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">KARUPPASAMY</span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors border-b-2 border-transparent ${activeSection === item.href.substring(1) 
                      ? 'text-cyan-400 border-cyan-400/80' 
                      : 'text-slate-300 hover:text-cyan-300 hover:border-cyan-300/20'}`}
                  >
                    {item.label}
                  </a>
                ))}
                <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="group bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all transform hover:scale-105 flex items-center gap-1">
                  Connect
                  <ChevronRight className='w-4 h-4 transition-transform group-hover:translate-x-0.5' />
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-300 hover:text-cyan-400 p-2 border border-white/10 rounded-lg"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#01040f] border-t border-white/5">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="text-slate-300 hover:text-cyan-400 block px-3 py-2 rounded-md text-base font-medium"
                >
                  {item.label}
                </a>
              ))}
              <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="mt-4 block bg-gradient-to-r from-cyan-500 to-violet-600 text-white px-3 py-2 rounded-md text-base font-bold text-center">
                Contact Me
              </a>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <Section id="home" className="min-h-[calc(100vh-80px)] flex items-center justify-center pt-24 pb-12 md:pb-24">
          <div className="container mx-auto px-4 text-center z-10">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-sm font-mono tracking-wider animate-pulse">
              AI/ML Engineer
            </div>
            
            <h1 className="text-5xl md:text-8xl font-extrabold mb-8 tracking-tighter leading-none">
              Architecting <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-violet-400 transition-all duration-1000">
               AI & Intelligence
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Hello, I'm Karuppasamy. With 4+ years of experience, I specialize in leveraging LLMs to build intelligent bots, RAG applications, and scalable agentic systems.
            </p>

            <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
              <button onClick={(e) => scrollToSection(e, '#projects')} className="group bg-cyan-500 text-gray-900 px-8 py-3.5 rounded-xl font-extrabold flex items-center shadow-lg shadow-cyan-500/40 hover:shadow-cyan-500/60 hover:bg-cyan-400 transition-all transform hover:scale-[1.03]">
                View Deployed Projects
                <Rocket className="ml-3 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button className="group px-8 py-3.5 rounded-xl font-bold border-2 border-white/20 text-white backdrop-blur-sm hover:bg-white/10 hover:border-cyan-400 transition-all flex items-center">
                Download CV
                <Download className="ml-3 w-5 h-5 group-hover:text-cyan-400 transition-colors" />
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 border-t border-white/5 pt-12 max-w-5xl mx-auto">
              {[
                { label: 'Yrs Experience', value: '4+' },
                { label: 'Models Deployed', value: '5' },
                { label: 'Code Commits', value: '1k+' },
                { label: 'Tech Stack Mastery', value: '100%' },
              ].map((stat, i) => (
                <div key={i} className="p-4 border-l border-white/10 first:border-l-0 flex items-center flex-col">
                  <div className="text-4xl font-extrabold text-white mb-1.5 flex items-center justify-center md:justify-start">
                    {stat.value}
                  </div>
                  <div className="text-sm text-cyan-400 font-medium uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* About Section */}
        <Section id="about">
          <div className="container mx-auto px-4 max-w-6xl">
            <GlassCard className="p-8 md:p-12 hover:shadow-none hover:-translate-y-0 transition-none">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 border-b border-cyan-400/20 pb-3">
                    <Zap className="w-6 h-6 text-cyan-400" />
                    About Karuppasamy
                  </h2>
                  <div className="space-y-5 text-slate-300 leading-relaxed font-light">
                    <p>
                      I am an experienced "AI Architect" dedicated to building resilient and scalable generative AI learning infrastructure. My expertise lies in bridging the gap between cutting-edge research and production-grade software engineering.
                    </p>
                    <p>
                      My core focus areas include optimizing "Large Language Models (LLMs)" for low-latency inference, designing "Vector Databases" for retrieval-augmented generation (RAG), and developing high-throughput pipelines deployed on hybrid cloud environments.
                    </p>
                  </div>
                  
                  <div className="mt-10 space-y-4">
                    {[
                      { icon: MapPin, text: 'Based in India (Global Remote Contributor)' },
                      { icon: GraduationCap, text: 'M.C.A in Computer Applications' },
                      { icon: Languages, text: 'Bilingual (English/Tamil) | Expert in Python' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-slate-400 border-l-4 border-cyan-500/50 pl-3 py-1">
                        <item.icon className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm font-mono">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative flex flex-col items-center">
                  <div className="w-48 h-48 rounded-full p-2 bg-gradient-to-br from-cyan-400 to-violet-500 mb-8 shadow-2xl shadow-cyan-500/30 ring-4 ring-cyan-500/10">
                    <div className="w-full h-full rounded-full bg-[#01040f] flex items-center justify-center overflow-hidden">
                       <img src="https://placehold.co/200x200/01040f/00ffff?text=KS+Profile" alt="Profile" className="w-full h-full object-cover opacity-90 transition-opacity" />
                    </div>
                  </div>

                  {/* Mock Code Editor */}
                  <div className="w-full bg-[#151c2f] rounded-lg shadow-2xl border border-cyan-700/50 overflow-hidden font-mono text-xs">
                    <div className="bg-[#0b1120] px-4 py-2 flex items-center gap-2 border-b border-cyan-700/50">
                      <span className="text-cyan-500 font-bold tracking-wider">CODE/INFERENCE.PY</span>
                    </div>
                    <div className="p-4 space-y-1">
                      <div className="text-purple-400">from <span className="text-white">mlops.pipeline</span> <span className="text-purple-400">import</span> <span className="text-white">Predictor</span></div>
                      <div className="text-purple-400">import <span className="text-white">torch</span></div>
                      <br/>
                      <div><span className="text-cyan-400">class</span> <span className="text-yellow-300">ModelService</span>:</div>
                      <div className="pl-4">
                        <span className="text-cyan-400">def</span> __init__(self):
                        <div className="pl-4">self.<span className="text-white">model</span> = Predictor.load(<span className="text-green-400">"yolov8-quant"</span>)</div>
                        <div className="pl-4">self.<span className="text-white">device</span> = <span className="text-green-400">'cuda'</span> <span className="text-purple-400">if</span> torch.cuda.is_available() <span className="text-purple-400">else</span> <span className="text-green-400">'cpu'</span></div>
                      </div>
                      <div className="pl-4"><span className="text-cyan-400">def</span> <span className="text-yellow-300">run</span>(self, data):</div>
                      <div className="pl-8"><span className="text-purple-400">return</span> self.<span className="text-white">model</span>.predict(data.to(self.<span className="text-white">device</span>))</div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </Section>

        {/* Experience Section */}
        <Section id="experience" className='pt-10'>
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold mb-16 text-center text-cyan-400">Professional Journey</h2>
            <div className="space-y-12">
              {[
                {
                  role: ' AI/ML Engineer',
                  company: 'Acabes International',
                  period: '2024 - Present',
                  color: 'bg-cyan-500',
                  desc: [
                    'Architected and scaled a RAG system for internal knowledge, reducing resolution time by 40%.',
                    'Implemented CI/CD pipelines for allama bot and courtorder models using docker and GCP, reducing deployment time by 80%.',
                    'Utilized Fast MCP Server and OpenAPI MCP for tool calling, enabling agents to seamlessly access external APIs'
                  ]
                },
                {
                  role: 'Trainee AI/ML Engineer',
                  company: 'IGT Solutions Pvt Ltd',
                  period: '2023 - 2024',
                  color: 'bg-violet-500',
                  desc: [
                    'Gained hands-on experience in building conversational AI bots using LLMs, enabling seamless and context-aware interactions.',
                    'Designed and implemented Retrieval-Augmented Generation (RAG) pipelines leveraging LLM frameworks like LangChain for efficient document querying and knowledge retrieval',
                    'Acquired expertise in utilizing LangChain to integrate LLMs with external tools, databases, and APIs for scalable and intelligent applications.'
                  ]
                },
                {
                  role: 'Associate Software Engineer',
                  company: 'UST Global',
                  period: '2021-2023',
                  color: 'bg-purple-500',
                  desc: [
                    'Gained a strong foundation in coding and software development, learning best practices and methodologies',
                    'Learned how large organizations operate, including teamwork, communication, and project management.',
            
                  ]
                }
              ].map((job, i) => (
                <div key={i} className="relative pl-8 md:pl-0">
                  {/* Timeline Line (Desktop) - Adjusted for aesthetic */}
                  <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-1 bg-gray-800 -translate-x-1/2 rounded-full"></div>
                  
                  <div className={`md:flex items-center justify-between w-full ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="hidden md:block w-5/12"></div>
                    
                    {/* Timeline Dot - Highlighted */}
                    <div className="absolute left-0 md:left-1/2 w-5 h-5 rounded-full border-4 border-[#01040f] z-10 -translate-x-[7px] md:-translate-x-1/2 mt-7 flex items-center justify-center bg-white shadow-lg shadow-cyan-500/50" 
                        style={{ backgroundColor: job.color === 'bg-cyan-500' ? PRIMARY_COLOR : job.color === 'bg-violet-500' ? SECONDARY_COLOR : '#a855f7' }}>
                        <Zap className='w-3 h-3 text-gray-900'/>
                    </div>
                    
                    <div className="md:w-5/12">
                      <GlassCard className="p-6 relative group border-white/20">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{job.role}</h3>
                          <span className="text-xs font-mono text-cyan-300 bg-cyan-900/40 px-3 py-1 rounded-full border border-cyan-400/20">{job.period}</span>
                        </div>
                        <div className="text-slate-300 text-sm mb-4 font-medium">{job.company}</div>
                        <ul className="space-y-3">
                          {job.desc.map((point, idx) => (
                            <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                              {point}
                            </li>
                          ))}
                        </ul>
                      </GlassCard>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Skills Section */}
        <Section id="skills">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-cyan-400">Technical Platform</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Generative AI & ML Frameworks",
                  skills: ["Python", "Transformers", "BERT", "LangChain", "RAG", "Google-ADK","Agentic Systems","VectorDBs"]
                },
                {
                  icon: Server,
                  title: "Data Engineering & Cloud Platforms",
                  skills: ["GCP", "Docker", "Qdrant", "OCR", "FastAPI", "Kubernetes", "CI/CD Pipelines", "REST APIs"]
                },
                {
                  icon: Code,
                  title: "Machine Learning",
                  skills: ["Python", "Scikit-Learn", "XGBoost", "Linear Regression", "Logistic Regression", "Boosting algorithms"]
                }
              ].map((category, i) => (
                <GlassCard key={i} className="h-full">
                  <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-3">
                    <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10">
                      <category.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold">{category.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <SkillTag key={skill} name={skill} />
                    ))}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </Section>

        {/* Projects Section */}
        <Section id="projects">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center text-cyan-400">Deployed Artifacts</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Enterprise RAG System",
                  desc: "A highly-available RAG solution for secure, low-latency querying of proprietary documents using Azure gpt-4o-mini model.",
                  tags: ["LangChain", "Qdrant", "gpt-4o-mini", "Kubernetes"],
                  icon: Layers
                },
                {
                  title: "Query Bot with mongoDB MCP",
                  desc: "We utilized MongoDB MCP Server with Google's AI Agent Framework (ADK) for real-time interaction with MongoDB collections, enabling internal developers to efficiently complete tasks , packaged with FastAPI and deployed via Docker.",
                  tags: ["Google-ADK", "FastAPI", "MongodbMCP", "Docker"],
                  icon: Zap
                },
                {
                  title: "Court Order Agentic System",
                  desc: "A serverless Court Order multi-agent system deployed on GCP, capable of parsing legal documents and providing actionable insights using google-adk.",
                  tags: ["GCP", "FastAPI", "Google-ADK", "MongoDB","Qdrant"],
                  icon: Brain
                }
              ].map((project, i) => (
                <GlassCard key={i} className="group flex flex-col h-full">
                  <div className="h-48 mb-6 rounded-lg bg-gradient-to-br from-gray-800 to-gray-700 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <project.icon size={48} className="text-gray-600 group-hover:text-cyan-400 transition-colors duration-300 transform group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 flex-grow">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-xs text-violet-400 bg-violet-400/10 px-2 py-1 rounded border border-violet-400/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* <div className="flex gap-6 mt-auto border-t border-white/5 pt-4">
                    <a href="#" className="text-sm font-bold text-cyan-400 hover:text-white flex items-center gap-2 transition-all group">
                      <Github size={16} className='group-hover:scale-110' /> Code
                    </a>
                    <a href="#" className="text-sm font-bold text-cyan-400 hover:text-white flex items-center gap-2 transition-all group">
                      <ExternalLink size={16} className='group-hover:translate-x-0.5' /> Live Demo
                    </a>
                  </div> */}
                </GlassCard>
              ))}
            </div>
          </div>
        </Section>

        {/* Contact Section */}
        <Section id="contact" className="bg-gradient-to-t from-[#01040f] to-transparent pt-20 pb-4">
          <div className="container mx-auto px-4 text-center max-w-xl">
            <h2 className="text-4xl font-extrabold mb-6 text-white">Let's Connect and Build</h2>
            <p className="text-slate-400 mb-10 text-lg">
              I'm always open to discussing new projects, collaboration opportunities, or complex AI challenges. Send me a signal!
            </p>
            
            <div className="flex justify-center gap-6 mb-12">
              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/karuppasamy-ayyam/" },
                { icon: Github, href: "https://github.com/kpayyam1998" },
                { icon: Mail, href: "mailto:email@example.com" },
                { icon: Twitter, href: "https://x.com/KP00214?t=UcXIbXHnF1sUzj-I170Yug&s=09" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href={social.href}
                  className="w-14 h-14 rounded-full bg-gray-800 border border-cyan-700/50 flex items-center justify-center text-cyan-300 hover:bg-cyan-500 hover:text-gray-900 hover:border-cyan-500 transition-all duration-300 transform hover:scale-110 shadow-lg shadow-gray-900/50"
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>

            <a href="mailto:email@example.com" className="inline-block bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-extrabold py-4 px-12 rounded-full shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/60 transition-all transform hover:scale-105">
              Send Encrypted Message
            </a>

            <footer className="mt-20 pt-8 border-t border-white/5 text-slate-600 text-sm">
              <p>&copy; 2025 Karuppasamy. Designed and Engineered.</p>
            </footer>
          </div>
        </Section>
      </main>
    </div>
  );
}
// import React, { useState, useEffect, useRef } from 'react';
// import { 
//   Github, 
//   Linkedin, 
//   Mail, 
//   Twitter, 
//   ExternalLink, 
//   Code, 
//   Brain, 
//   Server, 
//   Terminal, 
//   Menu, 
//   X, 
//   Download, 
//   ArrowRight,
//   MapPin,
//   GraduationCap,
//   Languages,
//   ChevronRight
// } from 'lucide-react';
// import * as THREE from 'three';

// // --- Components ---

// const Section = ({ id, className, children }) => (
//   <section id={id} className={`py-20 relative ${className}`}>
//     {children}
//   </section>
// );

// const GlassCard = ({ children, className = "", hoverEffect = true }) => (
//   <div className={`
//     backdrop-blur-md bg-slate-900/70 border border-white/10 rounded-xl p-6 
//     ${hoverEffect ? 'transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:border-sky-400/30' : ''}
//     ${className}
//   `}>
//     {children}
//   </div>
// );

// const SkillTag = ({ name }) => (
//   <span className="px-3 py-1 rounded-full text-xs font-mono bg-slate-800 border border-slate-700 text-slate-300 hover:border-sky-400 hover:text-sky-400 transition-colors cursor-default">
//     {name}
//   </span>
// );

// const Background3D = () => {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     const container = mountRef.current;
//     if (!container) return;

//     // Scene Setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     camera.position.z = 30;

//     const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     // Particles
//     const particlesGeometry = new THREE.BufferGeometry();
//     const particlesCount = 150;
//     const posArray = new Float32Array(particlesCount * 3);

//     for (let i = 0; i < particlesCount * 3; i++) {
//       posArray[i] = (Math.random() - 0.5) * 60;
//     }
//     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

//     const particlesMaterial = new THREE.PointsMaterial({
//       size: 0.15,
//       color: 0x38bdf8, // Sky Blue
//       transparent: true,
//       opacity: 0.8,
//     });

//     const linesMaterial = new THREE.LineBasicMaterial({
//       color: 0x818cf8, // Indigo
//       transparent: true,
//       opacity: 0.15
//     });

//     const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particlesMesh);

//     // Mouse Interaction
//     let mouseX = 0;
//     let mouseY = 0;
//     const handleMouseMove = (event) => {
//       mouseX = event.clientX / window.innerWidth - 0.5;
//       mouseY = event.clientY / window.innerHeight - 0.5;
//     };
//     document.addEventListener('mousemove', handleMouseMove);

//     // Animation Loop
//     let animationFrameId;
//     const animate = () => {
//       animationFrameId = requestAnimationFrame(animate);

//       particlesMesh.rotation.y += 0.001;
//       particlesMesh.rotation.x += 0.0005;
//       particlesMesh.rotation.y += mouseX * 0.01;
//       particlesMesh.rotation.x += mouseY * 0.01;

//       // Dynamic Lines
//       const childrenToRemove = [];
//       scene.traverse((child) => {
//         if (child.isLine) childrenToRemove.push(child);
//       });
//       childrenToRemove.forEach((child) => scene.remove(child));

//       const positions = particlesMesh.geometry.attributes.position.array;
//       const lineGeo = new THREE.BufferGeometry();
//       const linePos = [];

//       for (let i = 0; i < particlesCount; i++) {
//         for (let j = i + 1; j < particlesCount; j++) {
//           const x1 = positions[i * 3];
//           const y1 = positions[i * 3 + 1];
//           const z1 = positions[i * 3 + 2];
//           const x2 = positions[j * 3];
//           const y2 = positions[j * 3 + 1];
//           const z2 = positions[j * 3 + 2];
//           const dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));

//           if (dist < 7) {
//             linePos.push(x1, y1, z1);
//             linePos.push(x2, y2, z2);
//           }
//         }
//       }

//       if (linePos.length > 0) {
//         lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
//         const lines = new THREE.LineSegments(lineGeo, linesMaterial);
//         scene.add(lines);
//       }

//       renderer.render(scene, camera);
//     };
//     animate();

//     // Resize Handler
//     const handleResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     window.addEventListener('resize', handleResize);

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('resize', handleResize);
//       cancelAnimationFrame(animationFrameId);
//       if (container && renderer.domElement) {
//         container.removeChild(renderer.domElement);
//       }
//       scene.clear();
//     };
//   }, []);

//   return <div ref={mountRef} className="fixed top-0 left-0 w-full h-screen -z-10 opacity-60" />;
// };

// // --- Main Application ---

// export default function Portfolio() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [activeSection, setActiveSection] = useState('home');

//   const navItems = [
//     { label: 'Home', href: '#home' },
//     { label: 'About', href: '#about' },
//     { label: 'Skills', href: '#skills' },
//     { label: 'Projects', href: '#projects' },
//   ];

//   const scrollToSection = (e, href) => {
//     e.preventDefault();
//     const element = document.querySelector(href);
//     if (element) {
//       const offset = 80;
//       const bodyRect = document.body.getBoundingClientRect().top;
//       const elementRect = element.getBoundingClientRect().top;
//       const elementPosition = elementRect - bodyRect;
//       const offsetPosition = elementPosition - offset;

//       window.scrollTo({
//         top: offsetPosition,
//         behavior: 'smooth'
//       });
//     }
//     setIsMenuOpen(false);
//     setActiveSection(href.substring(1));
//   };

//   return (
//     <div className="min-h-screen bg-[#0b1120] text-slate-200 font-sans selection:bg-sky-500/30 selection:text-sky-200">
//       <Background3D />

//       {/* Navigation */}
//       <nav className="fixed w-full z-50 top-0 border-b border-white/10 bg-[#0b1120]/80 backdrop-blur-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-20">
//             <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer" onClick={(e) => scrollToSection(e, '#home')}>
//               <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center text-slate-900 font-bold text-xl shadow-lg shadow-sky-500/20">
//                 KS
//               </div>
//               <span className="font-bold text-xl tracking-tight text-white">Karuppasamy</span>
//             </div>
            
//             {/* Desktop Nav */}
//             <div className="hidden md:block">
//               <div className="ml-10 flex items-baseline space-x-8">
//                 {navItems.map((item) => (
//                   <a
//                     key={item.label}
//                     href={item.href}
//                     onClick={(e) => scrollToSection(e, item.href)}
//                     className={`hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === item.href.substring(1) ? 'text-sky-400' : 'text-slate-300'}`}
//                   >
//                     {item.label}
//                   </a>
//                 ))}
//                 <a href="#contact" onClick={(e) => scrollToSection(e, '#contact')} className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-lg shadow-sky-500/20 hover:opacity-90 transition-all transform hover:scale-105">
//                   Contact Me
//                 </a>
//               </div>
//             </div>

//             {/* Mobile menu button */}
//             <div className="md:hidden">
//               <button
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="text-slate-300 hover:text-white p-2"
//               >
//                 {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden bg-[#0b1120] border-b border-white/10">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
//               {navItems.map((item) => (
//                 <a
//                   key={item.label}
//                   href={item.href}
//                   onClick={(e) => scrollToSection(e, item.href)}
//                   className="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
//                 >
//                   {item.label}
//                 </a>
//               ))}
//             </div>
//           </div>
//         )}
//       </nav>

//       <main className="pt-20">
//         {/* Hero Section */}
//         <Section id="home" className="min-h-[calc(100vh-80px)] flex items-center justify-center">
//           <div className="container mx-auto px-4 text-center z-10">
//             <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-mono">
//               AI / Machine Learning Engineer
//             </div>
            
//             <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight leading-tight">
//               Architecting <br className="hidden md:block" />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 animate-pulse">
//                 Intelligence
//               </span>
//             </h1>

//             <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
//               Hi, I'm Karuppasamy. I build scalable AI systems, specializing in Deep Learning, 
//               NLP, and MLOps. I turn data into decisions.
//             </p>

//             <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
//               <button onClick={(e) => scrollToSection(e, '#projects')} className="group bg-white text-slate-900 px-8 py-3.5 rounded-xl font-bold flex items-center hover:bg-slate-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
//                 View Projects
//                 <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
//               </button>
//               <button className="group px-8 py-3.5 rounded-xl font-bold border border-white/20 backdrop-blur-sm hover:bg-white/10 transition-all flex items-center">
//                 Download CV
//                 <Download className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
//               </button>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-white/5 pt-12 max-w-4xl mx-auto">
//               {[
//                 { label: 'Years Exp', value: '4+' },
//                 { label: 'Models Deployed', value: '20+' },
//                 { label: 'Papers Read', value: '15+' },
//                 { label: 'Commitment', value: '100%' },
//               ].map((stat, i) => (
//                 <div key={i} className="p-4">
//                   <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
//                   <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Section>

//         {/* About Section */}
//         <Section id="about">
//           <div className="container mx-auto px-4 max-w-6xl">
//             <GlassCard className="p-8 md:p-12">
//               <div className="grid md:grid-cols-2 gap-12 items-center">
//                 <div>
//                   <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
//                     <span className="w-1 h-8 bg-sky-500 rounded-full"></span>
//                     About Karuppasamy
//                   </h2>
//                   <div className="space-y-4 text-slate-300 leading-relaxed">
//                     <p>
//                       I am a passionate AI practitioner dedicated to solving real-world problems through innovative algorithms. 
//                       My journey started with robust statistical modeling and has evolved into building and deploying large-scale deep learning systems.
//                     </p>
//                     <p>
//                       Currently, I focus on optimizing Large Language Models (LLMs) for enterprise applications and creating 
//                       robust computer vision pipelines. I value clean code and explainable AI.
//                     </p>
//                   </div>
                  
//                   <div className="mt-8 space-y-3">
//                     {[
//                       { icon: MapPin, text: 'Based in India (Open to Remote)' },
//                       { icon: GraduationCap, text: 'M.S. in AI/ML' },
//                       { icon: Languages, text: 'English, Tamil, Python' },
//                     ].map((item, i) => (
//                       <div key={i} className="flex items-center gap-3 text-slate-400">
//                         <item.icon className="w-5 h-5 text-sky-400" />
//                         <span className="text-sm">{item.text}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="relative flex flex-col items-center">
//                   <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-br from-sky-400 to-purple-500 mb-8 shadow-2xl shadow-sky-500/20">
//                     <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
//                        <img src="https://via.placeholder.com/160/0f172a/38bdf8?text=KS" alt="Profile" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
//                     </div>
//                   </div>

//                   {/* Mock Code Editor */}
//                   <div className="w-full bg-[#1e293b] rounded-lg shadow-2xl border border-slate-700 overflow-hidden font-mono text-xs">
//                     <div className="bg-[#0f172a] px-4 py-2 flex items-center gap-2 border-b border-slate-700">
//                       <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
//                       <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
//                       <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
//                       <span className="ml-2 text-slate-500">inference.py</span>
//                     </div>
//                     <div className="p-4 space-y-1">
//                       <div className="text-purple-400">import <span className="text-white">torch</span></div>
//                       <div className="text-purple-400">from <span className="text-white">transformers</span> import <span className="text-white">pipeline</span></div>
//                       <br/>
//                       <div><span className="text-sky-400">def</span> <span className="text-yellow-300">predict</span>(input_text):</div>
//                       <div className="pl-4 text-slate-400"># Load optimized model</div>
//                       <div className="pl-4">model = pipeline(<span className="text-green-400">"text-generation"</span>)</div>
//                       <div className="pl-4"><span className="text-purple-400">return</span> model(input_text)</div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </GlassCard>
//           </div>
//         </Section>

//         {/* Experience Section */}
//         <Section id="experience">
//           <div className="container mx-auto px-4 max-w-5xl">
//             <h2 className="text-3xl font-bold mb-16 text-center">Professional Journey</h2>
//             <div className="space-y-8">
//               {[
//                 {
//                   role: 'Senior AI Engineer',
//                   company: 'TechCorp Solutions',
//                   period: '2023 - Present',
//                   color: 'bg-sky-500',
//                   desc: [
//                     'Led the development of a RAG-based chatbot reducing support tickets by 40%.',
//                     'Optimized transformer models for edge devices using quantization (ONNX).',
//                     'Mentored junior engineers in MLOps best practices.'
//                   ]
//                 },
//                 {
//                   role: 'Machine Learning Engineer',
//                   company: 'DataFlow Analytics',
//                   period: '2021 - 2023',
//                   color: 'bg-indigo-500',
//                   desc: [
//                     'Designed CV pipelines for manufacturing defect detection (99.2% accuracy).',
//                     'Built automated retraining pipelines using Kubeflow and Airflow.',
//                     'Collaborated with product teams to define AI capabilities.'
//                   ]
//                 },
//                 {
//                   role: 'Data Scientist',
//                   company: 'Innovate Startup',
//                   period: '2019 - 2021',
//                   color: 'bg-purple-500',
//                   desc: [
//                     'Developed predictive churn models using XGBoost.',
//                     'Conducted A/B testing on recommendation algorithms (+15% CTR).',
//                     'Visualized complex datasets for stakeholders.'
//                   ]
//                 }
//               ].map((job, i) => (
//                 <div key={i} className="relative pl-8 md:pl-0">
//                   {/* Timeline Line (Desktop) */}
//                   <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2"></div>
                  
//                   <div className={`md:flex items-center justify-between w-full ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
//                     <div className="hidden md:block w-5/12"></div>
                    
//                     {/* Timeline Dot */}
//                     <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full border-4 border-[#0b1120] z-10 -translate-x-[5px] md:-translate-x-1/2 mt-6" style={{ backgroundColor: job.color === 'bg-sky-500' ? '#38bdf8' : job.color === 'bg-indigo-500' ? '#6366f1' : '#a855f7' }}></div>
                    
//                     <div className="md:w-5/12">
//                       <GlassCard className="p-6 relative group">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors">{job.role}</h3>
//                           <span className="text-xs font-mono text-slate-500 bg-slate-800/50 px-2 py-1 rounded">{job.period}</span>
//                         </div>
//                         <div className="text-slate-400 text-sm mb-4 font-medium">{job.company}</div>
//                         <ul className="space-y-2">
//                           {job.desc.map((point, idx) => (
//                             <li key={idx} className="text-slate-300 text-sm flex items-start gap-2">
//                               <ChevronRight className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
//                               {point}
//                             </li>
//                           ))}
//                         </ul>
//                       </GlassCard>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Section>

//         {/* Skills Section */}
//         <Section id="skills">
//           <div className="container mx-auto px-4 max-w-6xl">
//             <h2 className="text-3xl font-bold mb-12 text-center">Technical Arsenal</h2>
//             <div className="grid md:grid-cols-3 gap-6">
//               {[
//                 {
//                   icon: Brain,
//                   title: "Core AI/ML",
//                   skills: ["PyTorch", "TensorFlow", "Scikit-learn", "OpenCV", "HuggingFace", "Llama-2/3", "RAG"]
//                 },
//                 {
//                   icon: Server,
//                   title: "MLOps & Cloud",
//                   skills: ["Docker", "Kubernetes", "AWS SageMaker", "MLFlow", "FastAPI", "GitHub Actions", "Terraform"]
//                 },
//                 {
//                   icon: Code,
//                   title: "Development",
//                   skills: ["Python", "SQL", "Pandas", "NumPy", "Git", "Linux", "React Basics"]
//                 }
//               ].map((category, i) => (
//                 <GlassCard key={i} className="h-full">
//                   <div className="flex items-center gap-3 mb-6">
//                     <div className="p-3 rounded-lg bg-sky-500/10 text-sky-400">
//                       <category.icon size={24} />
//                     </div>
//                     <h3 className="text-xl font-bold">{category.title}</h3>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {category.skills.map((skill) => (
//                       <SkillTag key={skill} name={skill} />
//                     ))}
//                   </div>
//                 </GlassCard>
//               ))}
//             </div>
//           </div>
//         </Section>

//         {/* Projects Section */}
//         <Section id="projects">
//           <div className="container mx-auto px-4 max-w-6xl">
//             <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
//             <div className="grid md:grid-cols-3 gap-8">
//               {[
//                 {
//                   title: "Enterprise RAG System",
//                   desc: "Secure document querying system using VectorDBs and LLMs for internal knowledge bases.",
//                   tags: ["LangChain", "Pinecone", "React"],
//                   icon: Terminal
//                 },
//                 {
//                   title: "Defect Detection API",
//                   desc: "Real-time computer vision API for manufacturing assembly lines using YOLOv8.",
//                   tags: ["CV", "FastAPI", "Docker"],
//                   icon: ExternalLink
//                 },
//                 {
//                   title: "Crypto Sentiment Analyzer",
//                   desc: "Market sentiment analysis engine processing Twitter/X streams using BERT models.",
//                   tags: ["NLP", "Transformers", "AWS"],
//                   icon: Brain
//                 }
//               ].map((project, i) => (
//                 <GlassCard key={i} className="group flex flex-col h-full">
//                   <div className="h-48 mb-6 rounded-lg bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center relative overflow-hidden">
//                     <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
//                     <project.icon size={48} className="text-slate-600 group-hover:text-sky-400 transition-colors duration-300 transform group-hover:scale-110" />
//                   </div>
//                   <h3 className="text-xl font-bold mb-2 group-hover:text-sky-400 transition-colors">{project.title}</h3>
//                   <p className="text-slate-400 text-sm mb-4 flex-grow">{project.desc}</p>
//                   <div className="flex flex-wrap gap-2 mb-6">
//                     {project.tags.map(tag => (
//                       <span key={tag} className="text-xs text-sky-400 bg-sky-400/10 px-2 py-1 rounded border border-sky-400/20">
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                   <div className="flex gap-4 mt-auto">
//                     <a href="#" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2">
//                       <Github size={16} /> Code
//                     </a>
//                     <a href="#" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-2">
//                       <ExternalLink size={16} /> Live Demo
//                     </a>
//                   </div>
//                 </GlassCard>
//               ))}
//             </div>
//           </div>
//         </Section>

//         {/* Contact Section */}
//         <Section id="contact" className="bg-gradient-to-t from-slate-900 to-transparent">
//           <div className="container mx-auto px-4 text-center max-w-2xl">
//             <h2 className="text-3xl font-bold mb-6">Let's Collaborate</h2>
//             <p className="text-slate-400 mb-10">
//               Interested in discussing AI strategy, LLM implementation, or just want to say hi? 
//               My inbox is always open.
//             </p>
            
//             <div className="flex justify-center gap-6 mb-12">
//               {[
//                 { icon: Linkedin, href: "#" },
//                 { icon: Github, href: "#" },
//                 { icon: Mail, href: "mailto:email@example.com" },
//                 { icon: Twitter, href: "#" }
//               ].map((social, i) => (
//                 <a 
//                   key={i} 
//                   href={social.href}
//                   className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all duration-300 transform hover:-translate-y-1"
//                 >
//                   <social.icon size={20} />
//                 </a>
//               ))}
//             </div>

//             <a href="mailto:email@example.com" className="inline-block bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-bold py-4 px-10 rounded-full shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 transition-all transform hover:scale-105">
//               Send Message
//             </a>

//             <footer className="mt-20 pt-8 border-t border-white/5 text-slate-600 text-sm">
//               <p>&copy; 2024 Karuppasamy. Built with React & Three.js.</p>
//             </footer>
//           </div>
//         </Section>
//       </main>
//     </div>
//   );
// }