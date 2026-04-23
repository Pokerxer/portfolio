"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";

export default function Contact() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    let mouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const particles = Array.from({ length: 70 }, () => ({
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

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          p.x += dx * 0.01;
          p.y += dy * 0.01;
        }

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

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
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
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSubmitting(false);
    setSubmitted(true);
  };

  const socialLinks = [
    { 
      icon: "github", 
      href: "https://github.com/Pokerxer", 
      label: "GitHub",
      description: "Check my code"
    },
    { 
      icon: "linkedin", 
      href: "https://www.linkedin.com/in/jordan-waldehz-385a7b240", 
      label: "LinkedIn",
      description: "Connect with me"
    },
    { 
      icon: "twitter", 
      href: "https://twitter.com", 
      label: "X (Twitter)",
      description: "Follow me"
    },
    { 
      icon: "email", 
      href: "mailto:jrwaldehzx@gmail.com", 
      label: "Email",
      description: "jrwaldehzx@gmail.com"
    },
  ];

  return (
    <section className="min-h-screen relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f] z-0" />
      
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-neon-purple/5 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-neon-cyan/5 blur-[100px] animate-pulse" style={{ animationDuration: '5s' }} />

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
            <Link href="/projects" className="text-zinc-400 hover:text-white transition text-sm">
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

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-16">
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-neon-cyan font-display text-sm tracking-[0.3em] uppercase mb-4">
            Contact
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            Let&apos;s <span className="text-neon-cyan">Connect</span>
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto text-lg">
            Have a project in mind? Let&apos;s discuss how we can work together to bring your vision to life.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div
            className={`transition-all duration-700 delay-200 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-white/5 p-8 h-full">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-cyan" />
                Get in Touch
              </h2>
              
              <p className="text-zinc-400 mb-8">
                I&apos;m always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
              
              <div className="space-y-3">
                {socialLinks.map((link, i) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-neon-cyan/30 hover:bg-white/[0.02] transition-all group"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-neon-cyan/10 transition-colors">
                      {link.icon === "github" && (
                        <svg className="w-5 h-5 text-zinc-400 group-hover:text-neon-cyan" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                      )}
                      {link.icon === "linkedin" && (
                        <svg className="w-5 h-5 text-zinc-400 group-hover:text-neon-cyan" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      )}
                      {link.icon === "twitter" && (
                        <svg className="w-5 h-5 text-zinc-400 group-hover:text-neon-cyan" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26h8.41l7.227-8.26h-3.308l-5.373-6.139zm-1.161 17.52h1.833L7.084 4.75H5.117l7.966 11.139z" />
                        </svg>
                      )}
                      {link.icon === "email" && (
                        <svg className="w-5 h-5 text-zinc-400 group-hover:text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium group-hover:text-white transition-colors">{link.label}</p>
                      <p className="text-sm text-zinc-500">{link.description}</p>
                    </div>
                    <svg className="w-5 h-5 text-zinc-600 ml-auto group-hover:text-neon-cyan group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl bg-neon-cyan/5 border border-neon-cyan/20">
                <p className="text-sm text-zinc-400 mb-2">Prefer a direct approach?</p>
                <a href="mailto:jrwaldehzx@gmail.com" className="text-neon-cyan font-medium hover:underline">
                  jrwaldehzx@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-300 ${
              mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-white/5 p-8">
              <h2 className="font-display text-xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-cyan" />
                Send a Message
              </h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 rounded-full bg-neon-cyan/10 flex items-center justify-center mx-auto mb-6 animate-[scale_0.3s_ease-out]">
                    <svg className="w-10 h-10 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-xl font-medium mb-2">Message Sent!</p>
                  <p className="text-zinc-500">I&apos;ll get back to you within 24-48 hours.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="mt-6 text-sm text-zinc-500 hover:text-neon-cyan transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-neon-cyan/50 focus:outline-none focus:bg-white/10 transition-all peer"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-neon-cyan/50 focus:outline-none focus:bg-white/10 transition-all"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Tell me about your project..."
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      required
                      className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 focus:border-neon-cyan/50 focus:outline-none focus:bg-white/10 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-white text-black font-semibold hover:bg-neon-cyan hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {submitting ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
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