"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const roles = [
  { text: "modern web apps", gradient: "from-cyan-400 to-blue-500" },
  { text: "elegant solutions", gradient: "from-purple-400 to-pink-500" },
  { text: "clean code", gradient: "from-green-400 to-cyan-500" },
  { text: "digital experiences", gradient: "from-orange-400 to-red-500" },
];

const socialLinks = [
  { icon: "github", href: "https://github.com/Pokerxer", label: "GitHub" },
  { icon: "linkedin", href: "https://www.linkedin.com/in/jordan-waldehz-385a7b240", label: "LinkedIn" },
  { icon: "twitter", href: "https://twitter.com", label: "Twitter" },
];

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
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
    const currentRole = roles[roleIndex];

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText(currentRole.text.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        setDisplayText(currentRole.text.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }

      if (!isDeleting && charIndex === currentRole.text.length) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }, isDeleting ? 25 : 50);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let particles: Particle[] = [];
    let mouse = { x: 0, y: 0, vx: 0, vy: 0 };

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseX: number;
      baseY: number;
      size: number;
      opacity: number;
      targetOpacity: number;
      color: { r: number; g: number; b: number };
      angle: number;
      radius: number;
      speed: number;
      connectDistance: number;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const targetX = e.clientX;
      const targetY = e.clientY;
      mouse.vx = (targetX - mouse.x) * 0.1;
      mouse.vy = (targetY - mouse.y) * 0.1;
      mouse.x = targetX;
      mouse.y = targetY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleMouseLeave = () => {
      mouse.vx = 0;
      mouse.vy = 0;
    };
    window.addEventListener("mouseout", handleMouseLeave);

    const initParticles = () => {
      particles = Array.from({ length: 150 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * Math.max(canvas.width, canvas.height) * 0.8;
        return {
          x: canvas.width / 2 + Math.cos(angle) * radius,
          y: canvas.height / 2 + Math.sin(angle) * radius,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          baseX: canvas.width / 2,
          baseY: canvas.height / 2,
          size: Math.random() * 2 + 0.5,
          opacity: 0,
          targetOpacity: Math.random() * 0.2 + 0.02,
          color: Math.random() > 0.5 
            ? { r: 0, g: 245, b: 255 } 
            : { r: 124, g: 58, b: 237 },
          angle: angle,
          radius: radius,
          speed: Math.random() * 0.002 + 0.001,
          connectDistance: Math.random() * 100 + 50,
        };
      });
    };

    const drawParticles = () => {
      time += 0.004;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.angle += p.speed;
        p.x += Math.cos(p.angle + time) * p.vx + (mouse.x - p.x) * 0.0003;
        p.y += Math.sin(p.angle + time) * p.vy + (mouse.y - p.y) * 0.0003;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200) {
          const repelForce = (200 - dist) / 200;
          p.x += (dx / dist) * repelForce * 2;
          p.y += (dy / dist) * repelForce * 2;
          p.targetOpacity = Math.random() * 0.4 + 0.1;
        } else {
          p.targetOpacity = Math.random() * 0.2 + 0.02;
        }

        p.opacity += (p.targetOpacity - p.opacity) * 0.02;

        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;

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

          if (dist < p1.connectDistance) {
            const force = (1 - dist / p1.connectDistance);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            const wave = Math.sin(time * 2 + dist * 0.05) * 20;
            ctx.quadraticCurveTo(midX + wave, midY + wave, p2.x, p2.y);
            
            ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${force * 0.12})`;
            ctx.lineWidth = force * 0.8;
            ctx.stroke();
          }
        });
      });

      if (mouse.x > 0 && mouse.y > 0) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 245, 255, 0.9)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 245, 255, 0.08)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 40, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0, 245, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.stroke();

        const rippleGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 80);
        rippleGradient.addColorStop(0, "rgba(0, 245, 255, 0)");
        rippleGradient.addColorStop(0.5, "rgba(0, 245, 255, 0.03)");
        rippleGradient.addColorStop(1, "rgba(0, 245, 255, 0)");
        
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
        ctx.fillStyle = rippleGradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(drawParticles);
    };

    initParticles();
    drawParticles();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  const currentRole = roles[roleIndex];

  return (
    <section className="min-h-screen relative overflow-hidden cursor-none">
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
            className={`font-display text-xl font-bold transition-all duration-700 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            <span className="text-neon-cyan">JW</span>
          </Link>

          <div
            className={`hidden md:flex items-center gap-8 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
          >
            {["About", "Skills", "Projects", "Experience", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.toLowerCase());
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-zinc-400 hover:text-white transition text-sm relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-neon-cyan transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <Link
            href="#contact"
            className={`hidden md:inline-flex bg-white text-black px-5 py-2 rounded-lg text-sm font-medium transition-all duration-500 hover:bg-neon-cyan hover:shadow-[0_0_20px_rgba(0,245,255,0.4)] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Let&apos;s Talk
          </Link>
        </div>
      </nav>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f] z-0" />

      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMGY1ZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDIwYzAtNi42MjcgNS4zNzMtMTIgMTItMTJzMTIgNS4zNzMgMTIgMTItNS4zNzMgMTItMTIgMTItMTItNS4zNzMtMTItMTItMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-neon-purple/5 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-cyan/5 blur-[100px] animate-pulse" style={{ animationDuration: '5s' }} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-white/5 opacity-30 animate-[spin_60s_linear_infinite]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 transition-all duration-700 delay-100 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span className="text-zinc-400 text-sm">Available for work</span>
          </div>

          <p
            className={`text-neon-cyan font-display text-sm tracking-[0.3em] uppercase mb-4 transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Full-Stack Developer
          </p>

          <h1
            className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 leading-tight transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Jordan{" "}
            <span className="relative">
              <span className="text-neon-cyan neon-text">Waldehz</span>
            </span>
          </h1>

          <div
            className={`overflow-hidden h-8 sm:h-10 mb-2 transition-all duration-700 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span
              className={`text-xl md:text-2xl font-medium bg-gradient-to-r ${currentRole.gradient} bg-clip-text text-transparent inline-block`}
            >
              {displayText}
            </span>
            <span className="typing-cursor" />
          </div>

          <p
            className={`text-zinc-500 mb-10 max-w-xl mx-auto leading-relaxed transition-all duration-700 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Passionate about creating performant, accessible, and beautiful web
            experiences. Turning complex problems into elegant solutions.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center mb-12 transition-all duration-700 delay-900 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <a
              href="/projects"
              className="group relative px-8 py-3.5 rounded-lg font-display font-semibold inline-flex items-center justify-center gap-2 bg-white text-black overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Projects
                <svg
                  className="w-4 h-4 group-hover:translate-y-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </span>
              <span className="absolute inset-0 bg-neon-cyan translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a
              href="/contact"
              className="px-8 py-3.5 rounded-lg font-display font-medium inline-flex items-center justify-center gap-2 border border-white/20 hover:border-neon-cyan/50 transition-colors"
            >
              Get In Touch
            </a>
          </div>

          <div
            className={`flex items-center justify-center gap-4 transition-all duration-700 delay-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full border border-white/10 hover:border-neon-cyan/50 hover:bg-white/5 transition-all duration-300 hover:scale-110"
                aria-label={link.label}
              >
                {link.icon === "github" && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                )}
                {link.icon === "linkedin" && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                )}
                {link.icon === "twitter" && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26h8.41l7.227-8.26h-3.308l-5.373-6.139zm-1.161 17.52h1.833L7.084 4.75H5.117l7.966 11.139z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-1200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="animate-bounce">
          <svg
            className="w-5 h-5 text-zinc-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}