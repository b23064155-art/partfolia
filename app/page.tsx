"use client";

import { useEffect, useRef, useCallback } from "react";
 
export default function Home() {
  const headerRef = useRef<HTMLElement>(null);

  // ── HEADER SCROLL ──
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    function onScroll() {
      header!.classList.toggle("scrolled", window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── MOUSE SPOTLIGHT EFFECT ──
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    }
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // ── SMOOTH NAV ──
  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute("href");
    if (href && href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  // ── MOBILE MENU STATE ──
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = useCallback(() => {
    const menu = mobileMenuRef.current;
    const btn = hamburgerRef.current;
    if (menu && btn) {
      menu.classList.toggle("active");
      btn.classList.toggle("active");
    }
  }, []);

  const closeMenu = useCallback(() => {
    const menu = mobileMenuRef.current;
    const btn = hamburgerRef.current;
    if (menu && btn) {
      menu.classList.remove("active");
      btn.classList.remove("active");
    }
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg: #060609;
          --bg2: #0b0b10;
          --surface: rgba(20, 20, 31, 0.45);
          --surface2: rgba(29, 29, 45, 0.6);
          --gold: #dcae4e;
          --gold2: #e9c26f;
          --gold3: #f5d796;
          --cyan: #38bdf8;
          --cyan2: #7dd3fc;
          --purple: #a78bfa;
          --text: #f4f4f5;
          --text2: #a1a1aa;
          --text3: #71717a;
          --border: rgba(220, 174, 78, 0.1);
          --border2: rgba(56, 189, 248, 0.1);
          --glow: 0 0 60px rgba(220, 174, 78, 0.08);
          --glow2: 0 0 40px rgba(56, 189, 248, 0.06);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        
        /* ── CUSTOM SCROLLBAR ── */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: var(--bg);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, var(--gold), var(--cyan));
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, var(--gold2), var(--cyan2));
        }

        body, button, input, select, textarea {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        body {
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
          position: relative;
        }

        /* ── NOISE OVERLAY ── */
        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 10; opacity: 0.3;
        }

        /* ── MOUSE SPOTLIGHT OVERLAY ── */
        body::after {
          content: '';
          position: fixed; inset: 0;
          background: radial-gradient(800px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), rgba(56, 189, 248, 0.05) 0%, rgba(167, 139, 250, 0.02) 40%, transparent 80%);
          pointer-events: none; z-index: 1;
        }

        /* ── HEADER ── */
        header {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 0 48px;
          height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(5,5,8,0.6);
          backdrop-filter: blur(24px) saturate(180%);
          border-bottom: 1px solid var(--border);
          transition: all 0.3s;
        }
        header.scrolled {
          background: rgba(5,5,8,0.92);
          box-shadow: 0 4px 40px rgba(0,0,0,0.6);
        }
        .logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          letter-spacing: -0.5px;
          background: linear-gradient(135deg, var(--gold), var(--gold3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-decoration: none;
        }
        .logo span {
          background: linear-gradient(135deg, var(--cyan), var(--cyan2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        nav { display: flex; gap: 6px; align-items: center; }
        nav a {
          color: var(--text2); text-decoration: none;
          font-size: 13px; font-weight: 500; letter-spacing: 0.5px;
          padding: 8px 16px; border-radius: 6px;
          border: 1px solid transparent;
          transition: all 0.25s; position: relative; overflow: hidden;
          font-family: 'JetBrains Mono', monospace;
        }
        nav a::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.08), rgba(0,212,255,0.05));
          opacity: 0; transition: opacity 0.25s;
        }
        nav a:hover { color: var(--gold2); border-color: var(--border); }
        nav a:hover::before { opacity: 1; }
        .nav-cta {
          background: linear-gradient(135deg, var(--gold), #a07828) !important;
          color: var(--bg) !important; font-weight: 700 !important;
          border-color: transparent !important;
          padding: 8px 20px !important;
          -webkit-text-fill-color: var(--bg) !important;
        }
        .nav-cta:hover { filter: brightness(1.15); transform: translateY(-1px); }

        /* ── HAMBURGER ── */
        .hamburger {
          display: none;
          flex-direction: column; gap: 5px;
          background: none; border: none; cursor: pointer;
          z-index: 200; padding: 8px;
        }
        .hamburger span {
          display: block; width: 24px; height: 2px;
          background: var(--gold); transition: all 0.3s;
          border-radius: 2px;
        }
        .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
        .hamburger.active span:nth-child(2) { opacity: 0; }
        .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

        /* ── MOBILE NAV OVERLAY ── */
        .mobile-nav {
          display: none;
          position: fixed; inset: 0;
          background: rgba(5,5,8,0.97);
          backdrop-filter: blur(30px);
          z-index: 150;
          flex-direction: column;
          align-items: center; justify-content: center; gap: 24px;
          opacity: 0; pointer-events: none;
          transition: opacity 0.4s;
        }
        .mobile-nav.active { opacity: 1; pointer-events: all; }
        .mobile-nav a {
          color: var(--text); text-decoration: none;
          font-family: 'Syne', sans-serif;
          font-size: 28px; font-weight: 700;
          letter-spacing: -0.5px;
          transition: color 0.3s;
          opacity: 0; transform: translateY(20px);
          transition: all 0.4s;
        }
        .mobile-nav.active a {
          opacity: 1; transform: translateY(0);
        }
        .mobile-nav a:hover { color: var(--gold); }

        /* ── MAIN ── */
        main { position: relative; z-index: 2; }
        section { position: relative; }

        /* ── HERO ── */
        #hero {
          min-height: 100vh;
          display: flex; align-items: center;
          padding: 120px 80px 80px;
          overflow: hidden;
        }
        .hero-bg-orb {
          position: absolute; border-radius: 50%;
          filter: blur(100px); pointer-events: none;
        }
        .orb1 {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba(220,174,78,0.05) 0%, transparent 70%);
          top: -200px; right: -200px;
        }
        .orb2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%);
          bottom: -100px; left: -100px;
        }
        .orb3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
        }

        .hero-content { max-width: 900px; position: relative; }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--gold); border: 1px solid rgba(220,174,78,0.25);
          padding: 6px 16px; border-radius: 100px;
          background: rgba(220,174,78,0.05);
          margin-bottom: 32px;
        }
        .hero-tag::before {
          content: ''; width: 6px; height: 6px;
          background: var(--gold); border-radius: 50%;
          flex-shrink: 0;
        }

        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .hero-name {
          font-family: 'Syne', sans-serif;
          font-size: clamp(52px, 8vw, 100px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -3px;
          margin-bottom: 8px;
        }
        .hero-name .first { color: var(--text); }
        .hero-name .last {
          display: block;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold3) 30%, var(--cyan) 70%, var(--purple) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-size: 300% 300%;
          animation: gradientFlow 8s ease infinite;
        }

        .hero-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px; color: var(--cyan);
          letter-spacing: 1px; margin: 24px 0 20px;
        }

        .hero-desc {
          font-size: 17px; color: var(--text2); line-height: 1.7;
          max-width: 580px; margin-bottom: 48px;
        }
        .hero-stats {
          display: flex; gap: 48px; margin-bottom: 48px;
        }
        .stat-item { text-align: center; }
        .stat-num {
          font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800;
          background: linear-gradient(135deg, var(--gold), var(--gold3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        .stat-label {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          letter-spacing: 1.5px; color: var(--text3); margin-top: 4px;
          text-transform: uppercase;
        }
        .hero-actions {
          display: flex; gap: 16px; flex-wrap: wrap;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, var(--gold), #a07828);
          color: #050508; font-weight: 700; font-size: 14px;
          padding: 14px 28px; border-radius: 8px; text-decoration: none;
          border: none; cursor: pointer; letter-spacing: 0.3px;
          transition: all 0.3s; box-shadow: 0 8px 32px rgba(201,168,76,0.3);
          position: relative; overflow: hidden;
        }
        .btn-primary::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%); transition: transform 0.6s;
        }
        .btn-primary:hover::after { transform: translateX(100%); }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 48px rgba(201,168,76,0.4); filter: brightness(1.1); }
        .btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          background: transparent; color: var(--text);
          font-size: 14px; font-weight: 500;
          padding: 14px 28px; border-radius: 8px; text-decoration: none;
          border: 1px solid var(--border2); cursor: pointer;
          transition: all 0.3s; backdrop-filter: blur(8px);
        }
        .btn-secondary:hover { border-color: var(--cyan); color: var(--cyan); transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,212,255,0.15); }

        .hero-scroll {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: var(--text3); font-family: 'JetBrains Mono', monospace; font-size: 11px;
          letter-spacing: 2px; text-transform: uppercase;
        }
        .scroll-line {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, var(--gold), transparent);
        }

        /* ── SECTION COMMON ── */
        .section-wrap { padding: 120px 80px; }
        .section-tag {
          font-family: 'JetBrains Mono', monospace; font-size: 12px;
          letter-spacing: 3px; text-transform: uppercase;
          color: var(--gold); margin-bottom: 16px;
          display: flex; align-items: center; gap: 12px;
        }
        .section-tag::before { content: ''; flex: 0 0 32px; height: 1px; background: var(--gold); }
        .section-title {
          font-family: 'Syne', sans-serif; font-size: clamp(36px, 5vw, 60px);
          font-weight: 800; letter-spacing: -2px; line-height: 1.05;
          margin-bottom: 16px;
        }
        .section-title em {
          font-style: normal;
          background: linear-gradient(135deg, var(--gold), var(--cyan));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .section-sub { color: var(--text2); font-size: 16px; max-width: 500px; line-height: 1.7; margin-bottom: 72px; }
        .divider {
          height: 1px; background: linear-gradient(to right, transparent, var(--border), transparent);
          margin: 0 80px;
        }

        /* ── ABOUT ME ── */
        #about { background: var(--bg2); }
        .about-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 80px; align-items: center;
        }
        .about-info-cards { display: flex; flex-direction: column; gap: 16px; }
        .about-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 20px 24px;
          display: flex; align-items: center; gap: 16px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .about-card:hover {
          border-color: rgba(56, 189, 248, 0.3);
          transform: translateY(-5px);
          box-shadow: 0 16px 32px rgba(0,0,0,0.4), var(--glow2);
        }
        .about-card-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(0,212,255,0.08));
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          border: 1px solid var(--border);
        }
        .about-card-label {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          letter-spacing: 1px; color: var(--text3); text-transform: uppercase;
        }
        .about-card-value { font-size: 15px; font-weight: 500; color: var(--text); margin-top: 2px; }
        .about-text { color: var(--text2); font-size: 16px; line-height: 1.8; }
        .about-text strong { color: var(--gold2); font-weight: 600; }
        .about-highlight {
          margin-top: 32px; padding: 20px 24px;
          background: linear-gradient(135deg, rgba(220,174,78,0.06), rgba(56,189,248,0.04));
          border: 1px solid var(--border);
          border-radius: 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px; color: var(--cyan);
          line-height: 1.8;
        }

        /* ── TECH STACK ── */
        #stack { background: var(--bg); }
        .tech-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 12px;
        }
        .tech-item {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 16px 12px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden;
          cursor: pointer;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .tech-item::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(220,174,78,0.06), rgba(56,189,248,0.04));
          opacity: 0; transition: opacity 0.3s;
        }
        .tech-item:hover { border-color: rgba(56, 189, 248, 0.3); transform: translateY(-6px); box-shadow: 0 12px 24px rgba(0,0,0,0.4), var(--glow2); }
        .tech-item:hover::before { opacity: 1; }
        .tech-icon { font-size: 28px; position: relative; z-index: 1; }
        .tech-name { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.5px; color: var(--text2); text-align: center; position: relative; z-index: 1; }
        .tech-level {
          width: 100%; height: 2px; background: var(--surface2); border-radius: 1px; overflow: hidden;
          position: relative; z-index: 1;
        }
        .tech-level-fill { height: 100%; border-radius: 1px; background: linear-gradient(to right, var(--gold), var(--cyan)); }

        /* ── PROJECTS ── */
        #projects { background: var(--bg); }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
        .project-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer;
          position: relative;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .project-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(220,174,78,0.04) 0%, rgba(56,189,248,0.03) 100%);
          opacity: 0; transition: opacity 0.4s; z-index: 0;
        }
        .project-card:hover { transform: translateY(-8px); border-color: rgba(56, 189, 248, 0.35); box-shadow: 0 24px 64px rgba(0,0,0,0.5), var(--glow2); }
        .project-card:hover::before { opacity: 1; }
        .project-header {
          padding: 28px 28px 20px;
          border-bottom: 1px solid var(--border);
          position: relative; z-index: 1;
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .project-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(220,174,78,0.2), rgba(56,189,248,0.1));
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; border: 1px solid var(--border);
        }
        .project-badge {
          font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 1px;
          text-transform: uppercase; padding: 4px 10px; border-radius: 100px;
          background: rgba(56,189,248,0.08); color: var(--cyan); border: 1px solid rgba(56,189,248,0.2);
        }
        .project-body { padding: 20px 28px 28px; position: relative; z-index: 1; }
        .project-name { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
        .project-desc { color: var(--text2); font-size: 14px; line-height: 1.7; margin-bottom: 20px; }
        .project-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag {
          font-family: 'JetBrains Mono', monospace; font-size: 11px;
          padding: 4px 10px; border-radius: 6px;
          background: rgba(220,174,78,0.07); color: var(--gold2);
          border: 1px solid rgba(220,174,78,0.15);
        }
        .project-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: var(--cyan); font-size: 13px; font-weight: 500;
          text-decoration: none; margin-top: 20px;
          transition: gap 0.2s;
        }
        .project-link:hover { gap: 10px; }

        /* ── SKILLS ── */
        #skills { background: var(--bg); }
        .skills-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
        .skill-group-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 24px; color: var(--text); }
        .skill-bar-wrap { margin-bottom: 20px; }
        .skill-bar-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .skill-bar-name { font-size: 14px; color: var(--text); }
        .skill-bar-pct { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--gold); }
        .skill-bar { height: 3px; background: var(--surface2); border-radius: 2px; overflow: hidden; }
        .skill-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(to right, var(--gold), var(--cyan)); }

        /* ── CONTACT ── */
        #contact { background: var(--bg2); overflow: hidden; }
        .contact-inner {
          background: linear-gradient(135deg, var(--surface) 0%, var(--surface2) 100%);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 72px 80px;
          position: relative; overflow: hidden;
        }
        .contact-inner::before {
          content: ''; position: absolute; top: -50%; right: -20%;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(220,174,78,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .contact-inner::after {
          content: ''; position: absolute; bottom: -30%; left: -10%;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(56,189,248,0.04) 0%, transparent 70%);
          pointer-events: none;
        }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .contact-title { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; letter-spacing: -2px; line-height: 1.05; margin-bottom: 20px; }
        .contact-sub { color: var(--text2); font-size: 16px; line-height: 1.7; margin-bottom: 40px; }
        .contact-links { display: flex; flex-direction: column; gap: 16px; }
        .contact-link {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 24px; border-radius: 12px;
          background: rgba(220,174,78,0.02); border: 1px solid var(--border);
          text-decoration: none; color: var(--text);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .contact-link::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: linear-gradient(to bottom, var(--gold), var(--cyan));
          transform: scaleY(0); transition: transform 0.3s;
        }
        .contact-link:hover { border-color: rgba(56, 189, 248, 0.3); transform: translateY(-4px); background: rgba(56, 189, 248, 0.04); }
        .contact-link:hover::before { transform: scaleY(1); }
        .contact-link-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(220,174,78,0.06); display: flex; align-items: center; justify-content: center; font-size: 18px; border: 1px solid var(--border); }
        .contact-link-info { flex: 1; }
        .contact-link-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 1px; color: var(--text3); text-transform: uppercase; margin-bottom: 3px; }
        .contact-link-value { font-size: 14px; font-weight: 500; }
        .contact-link-arrow { color: var(--gold); opacity: 0; transform: translateX(-8px); transition: all 0.3s; }
        .contact-link:hover .contact-link-arrow { opacity: 1; transform: translateX(0); }

        /* ── FOOTER ── */
        footer {
          background: var(--bg); padding: 0 80px;
          border-top: 1px solid var(--border);
          position: relative; z-index: 2;
        }
        .footer-top {
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 60px; padding: 72px 0 56px;
        }
        .footer-logo {
          font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
          background: linear-gradient(135deg, var(--gold), var(--gold3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          display: block; margin-bottom: 16px;
        }
        .footer-tagline { color: var(--text2); font-size: 14px; line-height: 1.7; max-width: 260px; margin-bottom: 28px; }
        .footer-socials { display: flex; gap: 10px; }
        .footer-social {
          width: 38px; height: 38px; border-radius: 10px;
          border: 1px solid var(--border); background: var(--surface);
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; text-decoration: none; color: var(--text2);
          transition: all 0.25s;
        }
        .footer-social:hover { border-color: var(--cyan); color: var(--cyan); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(56,189,248,0.2); }
        .footer-col-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; margin-bottom: 20px; color: var(--text); letter-spacing: 0.5px; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .footer-links a { color: var(--text3); text-decoration: none; font-size: 14px; transition: color 0.2s; display: inline-flex; align-items: center; gap: 6px; }
        .footer-links a::before { content: ''; width: 0; height: 1px; background: var(--gold); transition: width 0.25s; }
        .footer-links a:hover { color: var(--gold); }
        .footer-links a:hover::before { width: 12px; }
        .footer-bottom {
          border-top: 1px solid var(--border); padding: 24px 0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .footer-copy { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text3); }
        .footer-copy span { color: var(--gold); }
        .footer-made { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text3); }
        .footer-status {
          display: flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text3);
        }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 12px rgba(34,197,94,0.5); }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          header { padding: 0 24px; }
          nav { display: none; }
          .hamburger { display: flex; }
          .mobile-nav { display: flex; }
          #hero { padding: 100px 24px 60px; }
          .hero-stats { gap: 24px; flex-wrap: wrap; }
          .hero-name { font-size: clamp(40px, 12vw, 70px); }
          .section-wrap { padding: 80px 24px; }
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
          .skills-cols { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; gap: 40px; }
          .contact-inner { padding: 48px 32px; }
          .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
          footer { padding: 0 24px; }
          .divider { margin: 0 24px; }
          .projects-grid { grid-template-columns: 1fr; }
          .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
        }
        @media (max-width: 480px) {
          .footer-top { grid-template-columns: 1fr; gap: 24px; }
          .hero-stats { gap: 16px; }
          .stat-num { font-size: 28px; }
        }
      `}</style>

      {/* HEADER */}
      <header ref={headerRef} id="header">
        <a href="#" className="logo">Kb<span>.</span></a>
        <nav>
          <a href="#about" onClick={handleNavClick}>About</a>
          <a href="#stack" onClick={handleNavClick}>Stack</a>
          <a href="#projects" onClick={handleNavClick}>Projects</a>
          <a href="#skills" onClick={handleNavClick}>Skills</a>
          <a href="#contact" onClick={handleNavClick} className="nav-cta">Hire Me →</a>
        </nav>
        <button ref={hamburgerRef} className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </header>

      {/* MOBILE NAV */}
      <div ref={mobileMenuRef} className="mobile-nav">
        <a href="#about" onClick={(e) => { handleNavClick(e); closeMenu(); }}>About</a>
        <a href="#stack" onClick={(e) => { handleNavClick(e); closeMenu(); }}>Stack</a>
        <a href="#projects" onClick={(e) => { handleNavClick(e); closeMenu(); }}>Projects</a>
        <a href="#skills" onClick={(e) => { handleNavClick(e); closeMenu(); }}>Skills</a>
        <a href="#contact" onClick={(e) => { handleNavClick(e); closeMenu(); }}>Contact</a>
      </div>

      <main>
        {/* ── HERO ── */}
        <section id="hero">
          <div className="hero-bg-orb orb1" />
          <div className="hero-bg-orb orb2" />
          <div className="hero-bg-orb orb3" />
          <div className="hero-content">
            <div className="hero-tag">Available for work</div>
            <h1 className="hero-name">
              <span className="first">Biloljon</span>
              <span className="last">Komiljonov</span>
            </h1>
            <p className="hero-title">
              {"// HTML · JavaScript · TypeScript Frontend Developer"}
            </p>
            <p className="hero-desc">
              HTML, JavaScript va TypeScript texnologiyalari bo&apos;yicha
              premium frontend interfeyslar yarataman. Har bir proyektda professional darajada o&apos;z izimni qoldiraman.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-num">1+</div>
                <div className="stat-label">Year Exp</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">1+</div>
                <div className="stat-label">Project</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">10+</div>
                <div className="stat-label">Ideas</div>
              </div>
            </div>
            <div className="hero-actions">
              <a href="#projects" onClick={handleNavClick} className="btn-primary">🚀 View Projects</a>
              <a href="#contact" onClick={handleNavClick} className="btn-secondary">📬 Contact Me</a>
            </div>
          </div>
          <div className="hero-scroll">
            <div className="scroll-line" />
            scroll
          </div>
        </section>

        <div className="divider" />

        {/* ── ABOUT ME ── */}
        <section id="about">
          <div className="section-wrap">
            <div className="section-tag">01 — About Me</div>
            <h2 className="section-title">Men <em>haqimda</em></h2>
            <p className="section-sub">Biloljon Komiljonov — React, Next.js va TypeScript Developer.</p>
            <div className="about-grid">
              <div className="about-info-cards">
                <div className="about-card">
                  <div className="about-card-icon">👤</div>
                  <div>
                    <div className="about-card-label">Full Name</div>
                    <div className="about-card-value">Biloljon Komiljonov</div>
                  </div>
                </div>
                <div className="about-card">
                  <div className="about-card-icon">🎂</div>
                  <div>
                    <div className="about-card-label">Age</div>
                    <div className="about-card-value">13 yosh</div>
                  </div>
                </div>
                <div className="about-card">
                  <div className="about-card-icon">💼</div>
                  <div>
                    <div className="about-card-label">Profession</div>
                    <div className="about-card-value">Frontend Developer (React + Next.js + TypeScript)</div>
                  </div>
                </div>
                <div className="about-card">
                  <div className="about-card-icon">📧</div>
                  <div>
                    <div className="about-card-label">Email</div>
                    <div className="about-card-value">b23064155@gmail.com</div>
                  </div>
                </div>
                <div className="about-card">
                  <div className="about-card-icon">📱</div>
                  <div>
                    <div className="about-card-label">Phone</div>
                    <div className="about-card-value">+998 95 020 51 61</div>
                  </div>
                </div>
                <div className="about-card">
                  <div className="about-card-icon">📍</div>
                  <div>
                    <div className="about-card-label">Location</div>
                    <div className="about-card-value">Uzbekistan 🇺🇿</div>
                  </div>
                </div>
              </div>
              <div>
                <p className="about-text">
                  Men <strong>Biloljon Komiljonov</strong> — 13 yoshli Frontend Developer.
                  Tajribam davomida <strong>React, Next.js, TypeScript</strong> va
                  ko&apos;plab zamonaviy texnologiyalar bilan ishlagan holda <strong>Adminly</strong> loyihasini yaratganman.
                </p>
                <div className="about-highlight">
                  <span style={{ color: "var(--gold)" }}>const</span> biloljon = &#123;<br />
                  &nbsp;&nbsp;name: <span style={{ color: "var(--gold3)" }}>&quot;Biloljon Komiljonov&quot;</span>,<br />
                  &nbsp;&nbsp;age: <span style={{ color: "var(--cyan)" }}>13</span>,<br />
                  &nbsp;&nbsp;role: <span style={{ color: "var(--gold3)" }}>&quot;Frontend Developer&quot;</span>,<br />
                  &nbsp;&nbsp;experience: <span style={{ color: "var(--cyan)" }}>&quot;1 year&quot;</span>,<br />
                  &nbsp;&nbsp;passion: <span style={{ color: "var(--gold3)" }}>&quot;Building the future with code&quot;</span><br />
                  &#125;;
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── TECH STACK ── */}
        <section id="stack">
          <div className="section-wrap">
            <div className="section-tag">02 — Tech Stack</div>
            <h2 className="section-title">Mening <em>qurollarim</em></h2>
            <p className="section-sub">Har bir proyekt uchun eng mos texnologiyalarni tanlash mening kuchim.</p>
            <div className="tech-grid">
              {[
                { icon: "⚛️", name: "React", level: 96 },
                { icon: "▲", name: "Next.js", level: 94 },
                { icon: "🟦", name: "TypeScript", level: 92 },
                { icon: "🎨", name: "Tailwind CSS", level: 95 },
                { icon: "📜", name: "JavaScript", level: 94 },
                { icon: "🌐", name: "HTML5 & CSS3", level: 97 },
              ].map((tech) => (
                <div key={tech.name} className="tech-item">
                  <div className="tech-icon">{tech.icon}</div>
                  <div className="tech-name">{tech.name}</div>
                  <div className="tech-level">
                    <div className="tech-level-fill" style={{ width: `${tech.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── PROJECTS ── */}
        <section id="projects">
          <div className="section-wrap">
            <div className="section-tag">03 — Projects</div>
            <h2 className="section-title">Mening <em>loyihalarim</em></h2>
            <p className="section-sub">Real world problems uchun real world solutions — har bir loyiha o&apos;z hikoyasiga ega.</p>
            <div className="projects-grid">
              {[
                {
                  icon: "🛒", name: "Adminly", badge: "Live",
                  desc: "E-commerce uchun kuchli admin panel. Real-time analytics, order management va inventory tracking tizimi bilan to'liq CMS.",
                  tags: ["Next.js", "TypeScript", "React", "CSS"],
                  link: "https://adminly-tan.vercel.app/auth/signin",
                },
              ].map((project) => (
                <div key={project.name} className="project-card">
                  <div className="project-header">
                    <div className="project-icon">{project.icon}</div>
                    <div className="project-badge">{project.badge}</div>
                  </div>
                  <div className="project-body">
                    <div className="project-name">{project.name}</div>
                    <div className="project-desc">{project.desc}</div>
                    <div className="project-tags">
                      {project.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                    </div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                      {project.link.replace("https://", "")} →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── SKILLS ── */}
        <section id="skills">
          <div className="section-wrap">
            <div className="section-tag">04 — Skills</div>
            <h2 className="section-title">Qobiliyat <em>darajam</em></h2>
            <p className="section-sub">Frontend texnologiyalari bo&apos;yicha professional darajada mukammallik.</p>
            <div className="skills-cols" style={{ gridTemplateColumns: "1fr", maxWidth: "600px", margin: "0 auto" }}>
              <div>
                <div className="skill-group-title">⚡ Core Frontend</div>
                {[
                  { name: "React & Next.js", pct: 96 },
                  { name: "TypeScript", pct: 92 },
                  { name: "JavaScript (ES6+)", pct: 94 },
                  { name: "HTML5 & CSS3", pct: 97 },
                ].map((s) => (
                  <div key={s.name} className="skill-bar-wrap">
                    <div className="skill-bar-top">
                      <span className="skill-bar-name">{s.name}</span>
                      <span className="skill-bar-pct">{s.pct}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill" style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── CONTACT ── */}
        <section id="contact">
          <div className="section-wrap">
            <div className="contact-inner">
              <div className="contact-grid">
                <div>
                  <div className="section-tag" style={{ marginBottom: "16px" }}>05 — Contact</div>
                  <div className="contact-title">
                    Birgalikda{" "}
                    <em style={{
                      fontStyle: "normal",
                      background: "linear-gradient(135deg,var(--gold),var(--cyan))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>katta</em>{" "}
                    narsalar yarataylik
                  </div>
                  <p className="contact-sub">
                    Yangi loyiha, hamkorlik yoki shunchaki salom aytish uchun murojaat qiling.
                    Har doim ochiqman.
                  </p>
                  <a href="mailto:b23064155@gmail.com" className="btn-primary" style={{ display: "inline-flex" }}>
                    📧 Email Yuborish
                  </a>
                </div>
                <div className="contact-links">
                  <a href="mailto:b23064155@gmail.com" className="contact-link">
                    <div className="contact-link-icon">📧</div>
                    <div className="contact-link-info">
                      <div className="contact-link-label">Email</div>
                      <div className="contact-link-value">b23064155@gmail.com</div>
                    </div>
                    <div className="contact-link-arrow">→</div>
                  </a>
                  <a href="tel:+998950205161" className="contact-link">
                    <div className="contact-link-icon">📱</div>
                    <div className="contact-link-info">
                      <div className="contact-link-label">Phone / Telegram</div>
                      <div className="contact-link-value">+998 95 020 51 61</div>
                    </div>
                    <div className="contact-link-arrow">→</div>
                  </a>
                  <a href="https://github.com/biloljonkomiljonov" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <div className="contact-link-icon">💻</div>
                    <div className="contact-link-info">
                      <div className="contact-link-label">GitHub</div>
                      <div className="contact-link-value">github.com/biloljonkomiljonov</div>
                    </div>
                    <div className="contact-link-arrow">→</div>
                  </a>
                  <a href="https://t.me/biloljonkomiljonov" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <div className="contact-link-icon">✈️</div>
                    <div className="contact-link-info">
                      <div className="contact-link-label">Telegram</div>
                      <div className="contact-link-value">@biloljonkomiljonov</div>
                    </div>
                    <div className="contact-link-arrow">→</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-top">
          <div>
            <span className="footer-logo">Biloljon Komiljonov</span>
            <p className="footer-tagline">
              HTML, JavaScript va TypeScript Developer. Kelajakni kod bilan quraylik.
            </p>
            <div className="footer-socials">
              <a href="https://github.com/biloljonkomiljonov" target="_blank" rel="noopener noreferrer" className="footer-social">⌨️</a>
              <a href="https://t.me/biloljonkomiljonov" target="_blank" rel="noopener noreferrer" className="footer-social">✈️</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social">💼</a>
              <a href="mailto:b23064155@gmail.com" className="footer-social">📧</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-links">
              <li><a href="#about" onClick={handleNavClick}>About Me</a></li>
              <li><a href="#stack" onClick={handleNavClick}>Tech Stack</a></li>
              <li><a href="#projects" onClick={handleNavClick}>Projects</a></li>
              <li><a href="#skills" onClick={handleNavClick}>Skills</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Projects</div>
            <ul className="footer-links">
              <li><a href="https://adminly.uz" target="_blank" rel="noopener noreferrer">Adminly.uz</a></li>
              <li><a href="https://dachago.uz" target="_blank" rel="noopener noreferrer">Dachago.uz</a></li>
              <li><a href="https://adblogger.uz" target="_blank" rel="noopener noreferrer">Adblogger.uz</a></li>
              <li><a href="https://stilzone.uz" target="_blank" rel="noopener noreferrer">Stilzone.uz</a></li>
              <li><a href="https://alximik.uz" target="_blank" rel="noopener noreferrer">Alximik.uz</a></li>
              <li><a href="https://elevato.uz" target="_blank" rel="noopener noreferrer">Elevato.uz</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <ul className="footer-links">
              <li><a href="mailto:b23064155@gmail.com">Gmail</a></li>
              <li><a href="tel:+998950205161">+998 95 020 51 61</a></li>
              <li><a href="https://t.me/biloljonkomiljonov" target="_blank" rel="noopener noreferrer">Telegram</a></li>
              <li><a href="https://github.com/biloljonkomiljonov" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2025 <span>Biloljon Komiljonov</span> · All rights reserved</div>
          <div className="footer-status"><div className="status-dot" /> Open to opportunities</div>
          <div className="footer-made">Crafted with 💛 in Uzbekistan</div>
        </div>
      </footer>
    </>
  );
}