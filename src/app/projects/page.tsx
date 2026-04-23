"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "Swiftpro",
    description: "A modern Next.js application with TypeScript, featuring a sleek UI and optimized performance for web applications.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
    github: "https://github.com/Pokerxer/swiftpro",
    demo: "https://swiftpro-bice.vercel.app",
    gradient: "from-cyan-400 to-blue-600",
    accent: "cyan",
  },
  {
    id: 2,
    title: "Kentaz",
    description: "E-commerce and booking platform with modern UI, product catalog, shopping cart, checkout flow, and booking system.",
    tags: ["Next.js", "TypeScript", "Redux", "Tailwind CSS"],
    github: "https://github.com/Pokerxer/kentaz-backend",
    demo: "https://www.kentazemporium.com",
    gradient: "from-purple-400 to-pink-600",
    accent: "purple",
  },
  {
    id: 3,
    title: "Kentaz Admin",
    description: "Admin dashboard with inventory management, order tracking, customer management, and analytics.",
    tags: ["Next.js", "TypeScript", "Admin", "Dashboard"],
    github: "https://github.com/Pokerxer/kentaz-backend",
    demo: "https://admin.kentazemporium.com",
    gradient: "from-green-400 to-cyan-600",
    accent: "green",
  },
  {
    id: 4,
    title: "Christy Empire",
    description: "Modern e-commerce platform with responsive design and product catalog for fashion retail.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "E-commerce"],
    github: "https://github.com/Pokerxer/Christy-empire",
    demo: "https://christy-empire.vercel.app",
    gradient: "from-orange-400 to-red-600",
    accent: "orange",
  },
  {
    id: 5,
    title: "Ball & Boujee",
    description: "Sports and lifestyle e-commerce platform bridging basketball culture with high fashion from Abuja.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "E-commerce"],
    github: "https://github.com/Pokerxer/ballandboujee",
    demo: "https://ballandboujee.com",
    gradient: "from-violet-400 to-purple-600",
    accent: "violet",
  },
  {
    id: 6,
    title: "Real-Time Chat",
    description: "Collaborative workspace with live cursors, comments, and real-time synchronization using WebSockets.",
    tags: ["React", "Socket.io", "Redis", "Node.js"],
    github: "https://github.com/Pokerxer",
    demo: "#",
    gradient: "from-rose-400 to-pink-600",
    accent: "rose",
  },
];

export default function Projects() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.15 + 0.02,
      color: Math.random() > 0.5 
        ? { r: 0, g: 245, b: 255 } 
        : { r: 124, g: 58, b: 237 },
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.opacity})`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.06;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
            ctx.lineWidth = 0.3;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));
  
  const filteredProjects = selectedTag
    ? projects.filter((p) => p.tags.includes(selectedTag))
    : projects;

  return (
    <section className="min-h-screen relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f] z-0" />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-black/80 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <Link
            href="/"
            className="font-display text-xl font-bold text-neon-cyan"
          >
            JW
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-zinc-400 hover:text-white transition text-sm">
              Home
            </Link>
            <Link href="/projects" className="text-white text-sm">
              Projects
            </Link>
            <Link
              href="/contact"
              className="hidden md:inline-flex bg-white text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-neon-cyan transition"
            >
              Let&apos;s Talk
            </Link>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-16">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-neon-cyan font-display text-sm tracking-[0.3em] uppercase mb-4">
            My Work
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Featured <span className="text-neon-cyan">Projects</span>
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto text-lg">
            A collection of projects showcasing my expertise in building modern,
            performant web applications.
          </p>
        </div>

        <div
          className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
              selectedTag === null
                ? "bg-neon-cyan text-black"
                : "bg-white/5 border border-white/10 hover:border-neon-cyan/50"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                selectedTag === tag
                  ? "bg-neon-cyan text-black"
                  : "bg-white/5 border border-white/10 hover:border-neon-cyan/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <a
              key={project.id}
              href={project.demo !== "#" ? project.demo : project.github}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#12121a] to-[#0d0d14] border border-white/5 group-hover:border-white/20 transition-colors duration-300" />

              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${project.gradient}`}
              />

              <div className="relative p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded bg-${project.accent}-500/10 text-${project.accent}-400`}>
                    {project.tags[0]}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {project.demo !== "#" && (
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Demo
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-display text-xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">
                  {project.title}
                </h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.slice(1).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded text-xs bg-white/5 text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1 text-sm text-zinc-500 group-hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Code
                  </span>
                  <span className="flex items-center gap-1 text-sm text-zinc-500 group-hover:text-neon-cyan transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    {project.demo !== "#" ? "Live" : "View"}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div
          className={`mt-16 text-center transition-all duration-700 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-zinc-500 mb-4">
            Interested in working together?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-medium hover:bg-neon-cyan transition-colors"
          >
            Get In Touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      <footer className="relative z-10 py-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Jordan Waldehz. Built with passion.
          </p>
        </div>
      </footer>
    </section>
  );
}