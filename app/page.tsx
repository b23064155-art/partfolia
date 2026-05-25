"use client";

import { useEffect, useRef, useCallback } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  // ── STARS ANIMATION ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    interface Star {
      x: number; y: number; r: number; alpha: number;
      speed: number; twinkle: number; twinkleDir: number;
      gold: boolean; shooting?: boolean; sx?: number; sy?: number; life?: number;
    }
    let stars: Star[] = [];
    let shootingStars: Star[] = [];
    let animId: number;

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function mkStar(): Star {
      return {
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.8 + 0.2,
        alpha: Math.random(),
        speed: Math.random() * 0.25 + 0.03,
        twinkle: Math.random() * 0.015 + 0.003,
        twinkleDir: 1,
        gold: Math.random() > 0.82,
      };
    }

    for (let i = 0; i < 280; i++) stars.push(mkStar());

    function spawnShootingStar() {
      shootingStars.push({
        x: Math.random() * W * 0.8, y: Math.random() * H * 0.3,
        r: 2, alpha: 1,
        speed: 0, twinkle: 0, twinkleDir: 0, gold: Math.random() > 0.5,
        shooting: true,
        sx: 4 + Math.random() * 6,
        sy: 2 + Math.random() * 3,
        life: 60 + Math.random() * 40,
      });
    }

    let shootTimer = 0;

    function draw() {
      ctx!.clearRect(0, 0, W, H);

      // Regular stars
      stars.forEach(s => {
        s.alpha += s.twinkle * s.twinkleDir;
        if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
        if (s.alpha <= 0.05) { s.alpha = 0.05; s.twinkleDir = 1; }
        s.y -= s.speed;
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        if (s.gold) {
          ctx!.fillStyle = `rgba(201,168,76,${s.alpha})`;
          // Gold glow
          ctx!.shadowColor = "rgba(201,168,76,0.5)";
          ctx!.shadowBlur = 6;
        } else {
          ctx!.fillStyle = `rgba(200,210,255,${s.alpha * 0.7})`;
          ctx!.shadowColor = "transparent";
          ctx!.shadowBlur = 0;
        }
        ctx!.fill();
        ctx!.shadowBlur = 0;
      });

      // Shooting stars
      shootingStars = shootingStars.filter(s => {
        if (!s.life || s.life <= 0) return false;
        s.life--;
        s.x += s.sx!;
        s.y += s.sy!;
        s.alpha = s.life / 100;

        // Trail
        const gradient = ctx!.createLinearGradient(s.x, s.y, s.x - s.sx! * 12, s.y - s.sy! * 12);
        gradient.addColorStop(0, s.gold ? `rgba(201,168,76,${s.alpha})` : `rgba(0,212,255,${s.alpha})`);
        gradient.addColorStop(1, "transparent");
        ctx!.beginPath();
        ctx!.moveTo(s.x, s.y);
        ctx!.lineTo(s.x - s.sx! * 12, s.y - s.sy! * 12);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        // Head
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = s.gold ? `rgba(255,224,154,${s.alpha})` : `rgba(126,255,245,${s.alpha})`;
        ctx!.fill();

        return s.life > 0;
      });

      shootTimer++;
      if (shootTimer > 180 + Math.random() * 300) {
        spawnShootingStar();
        shootTimer = 0;
      }

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── CUSTOM CURSOR ──
  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;
    let animId: number;

    function onMove(e: MouseEvent) {
      mx = e.clientX; my = e.clientY;
      cursor!.style.left = mx + "px";
      cursor!.style.top = my + "px";
    }
    document.addEventListener("mousemove", onMove);

    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring!.style.left = rx + "px";
      ring!.style.top = ry + "px";
      animId = requestAnimationFrame(animRing);
    }
    animRing();

    const interactiveEls = document.querySelectorAll("a, button, .tech-item, .project-card, .company-card");
    const enterHandler = () => {
      cursor!.style.transform = "translate(-50%,-50%) scale(2.5)";
      ring!.style.transform = "translate(-50%,-50%) scale(1.5)";
      ring!.style.borderColor = "rgba(201,168,76,0.8)";
    };
    const leaveHandler = () => {
      cursor!.style.transform = "translate(-50%,-50%) scale(1)";
      ring!.style.transform = "translate(-50%,-50%) scale(1)";
      ring!.style.borderColor = "rgba(201,168,76,0.5)";
    };
    interactiveEls.forEach(el => {
      el.addEventListener("mouseenter", enterHandler);
      el.addEventListener("mouseleave", leaveHandler);
    });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
      interactiveEls.forEach(el => {
        el.removeEventListener("mouseenter", enterHandler);
        el.removeEventListener("mouseleave", leaveHandler);
      });
    };
  }, []);

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

  // ── REVEAL ON SCROLL ──
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add("visible"), i * 60);
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── SKILL BARS ──
  useEffect(() => {
    const barObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const fill = e.target.querySelector(".skill-bar-fill") as HTMLElement;
            if (fill) {
              setTimeout(() => {
                fill.style.width = fill.dataset.width || "0%";
              }, 200);
            }
            barObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll(".skill-bar-wrap").forEach((el) => barObs.observe(el));
    return () => barObs.disconnect();
  }, []);

  // ── COUNTER ANIMATION ──
  useEffect(() => {
    function animCount(el: Element, target: number) {
      const dur = 1500;
      const startTime = performance.now();
      function step(now: number) {
        const progress = Math.min((now - startTime) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const val = Math.floor(eased * target);
        el.textContent = val + "+";
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const countObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const text = e.target.textContent || "";
            if (text.includes("∞")) return;
            const num = parseInt(text);
            if (!isNaN(num)) animCount(e.target, num);
            countObs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll(".stat-num").forEach((el) => countObs.observe(el));
    return () => countObs.disconnect();
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

  // ── Particle mouse follow effect ──
  useEffect(() => {
    const particles: { x: number; y: number; vx: number; vy: number; life: number; gold: boolean }[] = [];
    let animId: number;
    let lastX = 0, lastY = 0;

    function onMove(e: MouseEvent) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);
      lastX = e.clientX;
      lastY = e.clientY;

      if (speed > 3) {
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: e.clientX + (Math.random() - 0.5) * 10,
            y: e.clientY + (Math.random() - 0.5) * 10,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            life: 30 + Math.random() * 20,
            gold: Math.random() > 0.5,
          });
        }
      }
    }

    document.addEventListener("mousemove", onMove);

    const particleCanvas = document.getElementById("particle-canvas") as HTMLCanvasElement;
    if (!particleCanvas) return;
    const pCtx = particleCanvas.getContext("2d");

    function resizeP() {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    }
    resizeP();
    window.addEventListener("resize", resizeP);

    function drawParticles() {
      if (!pCtx) return;
      pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        const alpha = p.life / 50;
        pCtx.beginPath();
        pCtx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        pCtx.fillStyle = p.gold
          ? `rgba(201,168,76,${alpha})`
          : `rgba(0,212,255,${alpha})`;
        pCtx.fill();
        if (p.life <= 0) particles.splice(i, 1);
      }
      animId = requestAnimationFrame(drawParticles);
    }
    drawParticles();

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resizeP);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <style>{`
        :root {
          --bg: #050508;
          --bg2: #09090f;
          --surface: #0f0f1a;
          --surface2: #141428;
          --gold: #c9a84c;
          --gold2: #f0c96a;
          --gold3: #ffe09a;
          --cyan: #00d4ff;
          --cyan2: #7efff5;
          --purple: #a855f7;
          --text: #e8e8f0;
          --text2: #9898b8;
          --text3: #5a5a7a;
          --border: rgba(201,168,76,0.12);
          --border2: rgba(0,212,255,0.1);
          --glow: 0 0 60px rgba(201,168,76,0.15);
          --glow2: 0 0 40px rgba(0,212,255,0.1);
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Cabinet Grotesk', 'Inter', sans-serif;
          overflow-x: hidden;
          cursor: none;
        }

        /* ── CUSTOM CURSOR ── */
        .cursor-dot {
          position: fixed; width: 12px; height: 12px;
          background: var(--gold); border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transform: translate(-50%,-50%);
          transition: transform 0.1s, background 0.2s;
          mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed; width: 40px; height: 40px;
          border: 1px solid rgba(201,168,76,0.5); border-radius: 50%;
          pointer-events: none; z-index: 9998;
          transform: translate(-50%,-50%);
          transition: all 0.15s ease;
        }

        /* ── CANVAS LAYERS ── */
        #stars-canvas, #particle-canvas {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 0; pointer-events: none;
        }
        #particle-canvas { z-index: 1; }

        /* ── NOISE OVERLAY ── */
        body::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1; opacity: 0.4;
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
          font-family: 'DM Mono', monospace;
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
          background: none; border: none; cursor: none;
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
          background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
          top: -200px; right: -200px;
          animation: orbFloat1 8s ease-in-out infinite;
        }
        .orb2 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%);
          bottom: -100px; left: -100px;
          animation: orbFloat2 10s ease-in-out infinite;
        }
        .orb3 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%,-50%);
          animation: orbFloat3 12s ease-in-out infinite;
        }
        @keyframes orbFloat1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,30px)} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-20px)} }
        @keyframes orbFloat3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-45%,-55%) scale(1.1)} }

        .hero-content { max-width: 900px; position: relative; }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
          color: var(--gold); border: 1px solid rgba(201,168,76,0.25);
          padding: 6px 16px; border-radius: 100px;
          background: rgba(201,168,76,0.05);
          margin-bottom: 32px;
          animation: fadeUp 0.8s ease both;
        }
        .hero-tag::before {
          content: ''; width: 6px; height: 6px;
          background: var(--gold); border-radius: 50%;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

        .hero-name {
          font-family: 'Syne', sans-serif;
          font-size: clamp(52px, 8vw, 100px);
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -3px;
          margin-bottom: 8px;
          animation: fadeUp 0.8s 0.1s ease both;
        }
        .hero-name .first { color: var(--text); }
        .hero-name .last {
          display: block;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold3) 30%, var(--cyan) 70%, var(--purple) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-size: 300% 300%;
          animation: gradShift 5s ease infinite, fadeUp 0.8s 0.2s ease both;
        }
        @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .hero-title {
          font-family: 'DM Mono', monospace;
          font-size: 18px; color: var(--cyan);
          letter-spacing: 1px; margin: 24px 0 20px;
          animation: fadeUp 0.8s 0.3s ease both;
        }
        .hero-title .typing-cursor {
          display: inline-block; width: 2px; height: 1em;
          background: var(--cyan); margin-left: 4px;
          animation: blink 1s step-end infinite;
          vertical-align: text-bottom;
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .hero-desc {
          font-size: 17px; color: var(--text2); line-height: 1.7;
          max-width: 580px; margin-bottom: 48px;
          animation: fadeUp 0.8s 0.4s ease both;
        }
        .hero-stats {
          display: flex; gap: 48px; margin-bottom: 48px;
          animation: fadeUp 0.8s 0.5s ease both;
        }
        .stat-item { text-align: center; }
        .stat-num {
          font-family: 'Syne', sans-serif; font-size: 40px; font-weight: 800;
          background: linear-gradient(135deg, var(--gold), var(--gold3));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          line-height: 1;
        }
        .stat-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 1.5px; color: var(--text3); margin-top: 4px;
          text-transform: uppercase;
        }
        .hero-actions {
          display: flex; gap: 16px; flex-wrap: wrap;
          animation: fadeUp 0.8s 0.6s ease both;
        }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, var(--gold), #a07828);
          color: #050508; font-weight: 700; font-size: 14px;
          padding: 14px 28px; border-radius: 8px; text-decoration: none;
          border: none; cursor: none; letter-spacing: 0.3px;
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
          border: 1px solid var(--border2); cursor: none;
          transition: all 0.3s; backdrop-filter: blur(8px);
        }
        .btn-secondary:hover { border-color: var(--cyan); color: var(--cyan); transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,212,255,0.15); }

        .hero-scroll {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: var(--text3); font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 2px; text-transform: uppercase;
          animation: fadeUp 1s 1s ease both;
        }
        .scroll-line {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }
        @keyframes scrollLine { 0%{transform:scaleY(0);transform-origin:top} 50%{transform:scaleY(1);transform-origin:top} 51%{transform:scaleY(1);transform-origin:bottom} 100%{transform:scaleY(0);transform-origin:bottom} }

        @keyframes fadeUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }

        /* ── SECTION COMMON ── */
        .section-wrap { padding: 120px 80px; }
        .section-tag {
          font-family: 'DM Mono', monospace; font-size: 12px;
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
          transition: all 0.3s; cursor: none;
        }
        .about-card:hover {
          border-color: rgba(201,168,76,0.4);
          transform: translateX(8px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .about-card-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(201,168,76,0.15), rgba(0,212,255,0.08));
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; flex-shrink: 0;
          border: 1px solid var(--border);
        }
        .about-card-label {
          font-family: 'DM Mono', monospace; font-size: 11px;
          letter-spacing: 1px; color: var(--text3); text-transform: uppercase;
        }
        .about-card-value { font-size: 15px; font-weight: 500; color: var(--text); margin-top: 2px; }
        .about-text { color: var(--text2); font-size: 16px; line-height: 1.8; }
        .about-text strong { color: var(--gold2); font-weight: 600; }
        .about-highlight {
          margin-top: 32px; padding: 20px 24px;
          background: linear-gradient(135deg, rgba(201,168,76,0.06), rgba(0,212,255,0.04));
          border: 1px solid var(--border);
          border-radius: 12px;
          font-family: 'DM Mono', monospace;
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
          transition: all 0.3s; position: relative; overflow: hidden;
          cursor: none;
        }
        .tech-item::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.06), rgba(0,212,255,0.04));
          opacity: 0; transition: opacity 0.3s;
        }
        .tech-item:hover { border-color: rgba(201,168,76,0.4); transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(201,168,76,0.1); }
        .tech-item:hover::before { opacity: 1; }
        .tech-icon { font-size: 28px; position: relative; z-index: 1; }
        .tech-name { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.5px; color: var(--text2); text-align: center; position: relative; z-index: 1; }
        .tech-level {
          width: 100%; height: 2px; background: var(--surface2); border-radius: 1px; overflow: hidden;
          position: relative; z-index: 1;
        }
        .tech-level-fill { height: 100%; border-radius: 1px; background: linear-gradient(to right, var(--gold), var(--cyan)); }

        /* ── EXPERIENCE ── */
        #experience { background: var(--bg2); }
        .exp-timeline { position: relative; }
        .exp-timeline::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 1px; background: linear-gradient(to bottom, var(--gold), var(--purple), transparent);
        }
        .exp-item {
          padding: 0 0 56px 40px; position: relative;
        }
        .exp-item::before {
          content: ''; position: absolute; left: -5px; top: 4px;
          width: 11px; height: 11px; border-radius: 50%;
          background: var(--gold); box-shadow: 0 0 20px rgba(201,168,76,0.5), 0 0 40px rgba(201,168,76,0.2);
        }
        .exp-period {
          font-family: 'DM Mono', monospace; font-size: 12px; color: var(--gold);
          letter-spacing: 1px; margin-bottom: 8px;
        }
        .exp-role { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .exp-company { font-size: 14px; color: var(--cyan); font-weight: 500; margin-bottom: 12px; }
        .exp-desc { color: var(--text2); line-height: 1.7; font-size: 15px; max-width: 560px; }
        .exp-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }

        /* ── PROJECTS ── */
        #projects { background: var(--bg); }
        .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
        .project-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
          transition: all 0.4s; cursor: none;
          position: relative;
        }
        .project-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(201,168,76,0.04) 0%, rgba(0,212,255,0.03) 100%);
          opacity: 0; transition: opacity 0.4s; z-index: 0;
        }
        .project-card:hover { transform: translateY(-8px); border-color: rgba(201,168,76,0.35); box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(201,168,76,0.08), var(--glow); }
        .project-card:hover::before { opacity: 1; }
        .project-header {
          padding: 28px 28px 20px;
          border-bottom: 1px solid var(--border);
          position: relative; z-index: 1;
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .project-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(201,168,76,0.2), rgba(0,212,255,0.1));
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; border: 1px solid var(--border);
        }
        .project-badge {
          font-family: 'DM Mono', monospace; font-size: 10px; letter-spacing: 1px;
          text-transform: uppercase; padding: 4px 10px; border-radius: 100px;
          background: rgba(0,212,255,0.08); color: var(--cyan); border: 1px solid rgba(0,212,255,0.2);
        }
        .project-body { padding: 20px 28px 28px; position: relative; z-index: 1; }
        .project-name { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 8px; color: var(--text); }
        .project-desc { color: var(--text2); font-size: 14px; line-height: 1.7; margin-bottom: 20px; }
        .project-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag {
          font-family: 'DM Mono', monospace; font-size: 11px;
          padding: 4px 10px; border-radius: 6px;
          background: rgba(201,168,76,0.07); color: var(--gold2);
          border: 1px solid rgba(201,168,76,0.15);
        }
        .project-link {
          display: inline-flex; align-items: center; gap: 6px;
          color: var(--cyan); font-size: 13px; font-weight: 500;
          text-decoration: none; margin-top: 20px;
          transition: gap 0.2s;
        }
        .project-link:hover { gap: 10px; }

        /* ── COMPANIES ── */
        #companies { background: var(--bg2); }
        .companies-row {
          display: flex; gap: 16px; flex-wrap: wrap;
        }
        .company-card {
          flex: 1 1 220px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; padding: 32px 28px;
          transition: all 0.35s; cursor: none; position: relative; overflow: hidden;
        }
        .company-card::after {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(to right, var(--gold), var(--cyan), var(--purple));
          transform: scaleX(0); transform-origin: left; transition: transform 0.35s;
        }
        .company-card:hover { border-color: rgba(201,168,76,0.3); transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
        .company-card:hover::after { transform: scaleX(1); }
        .company-emoji { font-size: 32px; margin-bottom: 16px; }
        .company-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .company-role { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--gold); letter-spacing: 0.5px; margin-bottom: 10px; }
        .company-desc { color: var(--text2); font-size: 13px; line-height: 1.6; }

        /* ── SKILLS ── */
        #skills { background: var(--bg); }
        .skills-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
        .skill-group-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; margin-bottom: 24px; color: var(--text); }
        .skill-bar-wrap { margin-bottom: 20px; }
        .skill-bar-top { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .skill-bar-name { font-size: 14px; color: var(--text); }
        .skill-bar-pct { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--gold); }
        .skill-bar { height: 3px; background: var(--surface2); border-radius: 2px; overflow: hidden; }
        .skill-bar-fill { height: 100%; border-radius: 2px; background: linear-gradient(to right, var(--gold), var(--cyan)); width: 0; transition: width 1.2s cubic-bezier(.16,1,.3,1); }

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
          background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .contact-inner::after {
          content: ''; position: absolute; bottom: -30%; left: -10%;
          width: 400px; height: 400px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%);
          pointer-events: none;
        }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .contact-title { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; letter-spacing: -2px; line-height: 1.05; margin-bottom: 20px; }
        .contact-sub { color: var(--text2); font-size: 16px; line-height: 1.7; margin-bottom: 40px; }
        .contact-links { display: flex; flex-direction: column; gap: 16px; }
        .contact-link {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 24px; border-radius: 12px;
          background: rgba(201,168,76,0.04); border: 1px solid var(--border);
          text-decoration: none; color: var(--text);
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .contact-link::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 3px; background: linear-gradient(to bottom, var(--gold), var(--cyan));
          transform: scaleY(0); transition: transform 0.3s;
        }
        .contact-link:hover { border-color: rgba(201,168,76,0.4); transform: translateX(8px); background: rgba(201,168,76,0.07); }
        .contact-link:hover::before { transform: scaleY(1); }
        .contact-link-icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(201,168,76,0.1); display: flex; align-items: center; justify-content: center; font-size: 18px; }
        .contact-link-info { flex: 1; }
        .contact-link-label { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 1px; color: var(--text3); text-transform: uppercase; margin-bottom: 3px; }
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
        .footer-social:hover { border-color: var(--gold); color: var(--gold); transform: translateY(-3px); box-shadow: 0 8px 20px rgba(201,168,76,0.2); }
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
        .footer-copy { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text3); }
        .footer-copy span { color: var(--gold); }
        .footer-made { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text3); }
        .footer-status {
          display: flex; align-items: center; gap: 8px;
          font-family: 'DM Mono', monospace; font-size: 12px; color: var(--text3);
        }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; animation: pulse 2s infinite; box-shadow: 0 0 12px rgba(34,197,94,0.5); }

        /* ── REVEAL ── */
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(.16,1,.3,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        /* ── GLOWING BORDER ANIMATION ── */
        @keyframes borderGlow {
          0%, 100% { border-color: rgba(201,168,76,0.2); }
          50% { border-color: rgba(0,212,255,0.3); }
        }

        /* ── MOBILE ── */
        @media (max-width: 768px) {
          body { cursor: auto; }
          .cursor-dot, .cursor-ring { display: none; }
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
          .companies-row { flex-direction: column; }
        }
        @media (max-width: 480px) {
          .footer-top { grid-template-columns: 1fr; gap: 24px; }
          .hero-stats { gap: 16px; }
          .stat-num { font-size: 28px; }
        }
      `}</style>

      {/* Cursor */}
      <div ref={cursorRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />

      {/* Stars */}
      <canvas ref={canvasRef} id="stars-canvas" />
      <canvas id="particle-canvas" />

      {/* HEADER */}
      <header ref={headerRef} id="header">
        <a href="#" className="logo">AM<span>.</span></a>
        <nav>
          <a href="#about" onClick={handleNavClick}>About</a>
          <a href="#stack" onClick={handleNavClick}>Stack</a>
          <a href="#experience" onClick={handleNavClick}>Experience</a>
          <a href="#projects" onClick={handleNavClick}>Projects</a>
          <a href="#companies" onClick={handleNavClick}>Companies</a>
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
        <a href="#experience" onClick={(e) => { handleNavClick(e); closeMenu(); }}>Experience</a>
        <a href="#projects" onClick={(e) => { handleNavClick(e); closeMenu(); }}>Projects</a>
        <a href="#companies" onClick={(e) => { handleNavClick(e); closeMenu(); }}>Companies</a>
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
              {"// Full-Stack Developer · AI Engineer · Startuper"}
              <span className="typing-cursor" />
            </p>
            <p className="hero-desc">
              4+ yillik tajriba bilan React, Next.js, Node.js va AI texnologiyalari bo&apos;yicha
              premium mahsulotlar yarataman. Freelance dan tortib Mars IT gacha — har bir
              proyektda professional darajada o&apos;z izimni qoldiraman.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-num">4+</div>
                <div className="stat-label">Years Exp</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">12+</div>
                <div className="stat-label">Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">3</div>
                <div className="stat-label">Companies</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">∞</div>
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
            <p className="section-sub">Biloljon Komiljonov — professional Full-Stack Developer va AI Engineer.</p>
            <div className="about-grid">
              <div className="about-info-cards">
                <div className="about-card reveal">
                  <div className="about-card-icon">👤</div>
                  <div>
                    <div className="about-card-label">Full Name</div>
                    <div className="about-card-value">Biloljon Komiljonov</div>
                  </div>
                </div>
                <div className="about-card reveal">
                  <div className="about-card-icon">🎂</div>
                  <div>
                    <div className="about-card-label">Age</div>
                    <div className="about-card-value">22 yosh</div>
                  </div>
                </div>
                <div className="about-card reveal">
                  <div className="about-card-icon">💼</div>
                  <div>
                    <div className="about-card-label">Profession</div>
                    <div className="about-card-value">Full-Stack Developer (React + Next.js + Node.js)</div>
                  </div>
                </div>
                <div className="about-card reveal">
                  <div className="about-card-icon">📧</div>
                  <div>
                    <div className="about-card-label">Email</div>
                    <div className="about-card-value">biloljonkomiljonov@gmail.com</div>
                  </div>
                </div>
                <div className="about-card reveal">
                  <div className="about-card-icon">📱</div>
                  <div>
                    <div className="about-card-label">Phone</div>
                    <div className="about-card-value">+998 90 520 03 50</div>
                  </div>
                </div>
                <div className="about-card reveal">
                  <div className="about-card-icon">📍</div>
                  <div>
                    <div className="about-card-label">Location</div>
                    <div className="about-card-value">Uzbekistan 🇺🇿</div>
                  </div>
                </div>
              </div>
              <div className="reveal">
                <p className="about-text">
                  Men <strong>Biloljon Komiljonov</strong> — 22 yoshli Full-Stack Developer va AI Engineer.
                  4+ yillik tajribam davomida <strong>React, Next.js, Node.js, TypeScript, Express.js, MongoDB</strong> va
                  ko&apos;plab zamonaviy texnologiyalar bilan ishlagan holda real-world loyihalar yaratib kelaman.
                </p>
                <p className="about-text" style={{ marginTop: "16px" }}>
                  <strong>Freelance, Albison, Mars IT</strong> kabi kompaniyalarda ishlash tajribam bor.
                  Shu paytgacha juda ko&apos;p muvaffaqiyatli proyektlarda qatnashganman — <strong>Adminly, Dachago.uz,
                  Adblogger.uz, Stilzone.uz, Alximik.uz, Elevato.uz</strong> va boshqalar.
                </p>
                <p className="about-text" style={{ marginTop: "16px" }}>
                  AI engineering va startup sohasida ham faol bo&apos;lib, zamonaviy AI texnologiyalarini amaliy
                  loyihalarga tatbiq etaman.
                </p>
                <div className="about-highlight">
                  <span style={{ color: "var(--gold)" }}>const</span> biloljon = &#123;<br />
                  &nbsp;&nbsp;name: <span style={{ color: "var(--gold3)" }}>&quot;Biloljon Komiljonov&quot;</span>,<br />
                  &nbsp;&nbsp;age: <span style={{ color: "var(--cyan)" }}>22</span>,<br />
                  &nbsp;&nbsp;role: <span style={{ color: "var(--gold3)" }}>&quot;Full-Stack Developer&quot;</span>,<br />
                  &nbsp;&nbsp;experience: <span style={{ color: "var(--cyan)" }}>&quot;4+ years&quot;</span>,<br />
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
                { icon: "🟢", name: "Node.js", level: 91 },
                { icon: "🚂", name: "Express.js", level: 90 },
                { icon: "🍃", name: "MongoDB", level: 88 },
                { icon: "🔴", name: "Redis", level: 80 },
                { icon: "🐘", name: "PostgreSQL", level: 82 },
                { icon: "🎨", name: "Tailwind CSS", level: 95 },
                { icon: "🐳", name: "Docker", level: 78 },
                { icon: "🤖", name: "AI / ML", level: 85 },
                { icon: "🔗", name: "GraphQL", level: 76 },
                { icon: "📦", name: "Zustand", level: 89 },
                { icon: "🔄", name: "React Query", level: 87 },
                { icon: "☁️", name: "AWS / Vercel", level: 75 },
                { icon: "🔐", name: "JWT / Auth", level: 92 },
                { icon: "🧪", name: "Jest / Testing", level: 80 },
                { icon: "📡", name: "Socket.io", level: 83 },
                { icon: "🎭", name: "Prisma ORM", level: 86 },
                { icon: "⚡", name: "Vite", level: 88 },
              ].map((tech) => (
                <div key={tech.name} className="tech-item reveal">
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

        {/* ── EXPERIENCE ── */}
        <section id="experience">
          <div className="section-wrap">
            <div className="section-tag">03 — Experience</div>
            <h2 className="section-title">Ish <em>tarixi</em></h2>
            <p className="section-sub">4+ yil davomida turli kompaniyalar va freelance loyihalarda o&apos;z tajribamni oshirdim.</p>
            <div className="exp-timeline">
              <div className="exp-item reveal">
                <div className="exp-period">2024 — Present</div>
                <div className="exp-role">Senior Full-Stack Developer</div>
                <div className="exp-company">Mars IT</div>
                <div className="exp-desc">
                  Next.js va Node.js asosidagi enterprise-darajali ilovalar yaratish.
                  Microservices arxitekturasi, CI/CD pipeline sozlash va junior
                  developerlarni mentoring qilish.
                </div>
                <div className="exp-tags">
                  <span className="tag">Next.js</span>
                  <span className="tag">Node.js</span>
                  <span className="tag">Microservices</span>
                  <span className="tag">CI/CD</span>
                </div>
              </div>
              <div className="exp-item reveal">
                <div className="exp-period">2023 — 2024</div>
                <div className="exp-role">Full-Stack Developer</div>
                <div className="exp-company">Albison</div>
                <div className="exp-desc">
                  React va TypeScript bilan complex SPA loyihalar. RESTful API va
                  GraphQL endpointlar yaratish. MongoDB va PostgreSQL bilan ishlash tajribasi.
                </div>
                <div className="exp-tags">
                  <span className="tag">React</span>
                  <span className="tag">TypeScript</span>
                  <span className="tag">GraphQL</span>
                  <span className="tag">MongoDB</span>
                </div>
              </div>
              <div className="exp-item reveal">
                <div className="exp-period">2021 — Present</div>
                <div className="exp-role">Freelance Developer & AI Engineer</div>
                <div className="exp-company">Self-Employed / Upwork / Telegram</div>
                <div className="exp-desc">
                  20+ ta muvaffaqiyatli loyiha. E-commerce, dashboard, AI chatbot va
                  avtomatlashtirish tizimlari yaratish. OpenAI API va LangChain bilan
                  AI mahsulotlar ishlab chiqish.
                </div>
                <div className="exp-tags">
                  <span className="tag">Freelance</span>
                  <span className="tag">AI</span>
                  <span className="tag">E-commerce</span>
                  <span className="tag">OpenAI</span>
                </div>
              </div>
              <div className="exp-item reveal">
                <div className="exp-period">2021 — 2022</div>
                <div className="exp-role">Junior Developer</div>
                <div className="exp-company">Startup Projects</div>
                <div className="exp-desc">
                  Dastlabki ish tajribasi. React, CSS, JavaScript asoslarini amalda
                  o&apos;rganish. Bir nechta startuplarda frontend va backend ishlarida qatnashish.
                </div>
                <div className="exp-tags">
                  <span className="tag">React</span>
                  <span className="tag">CSS</span>
                  <span className="tag">JavaScript</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── PROJECTS ── */}
        <section id="projects">
          <div className="section-wrap">
            <div className="section-tag">04 — Projects</div>
            <h2 className="section-title">Mening <em>loyihalarim</em></h2>
            <p className="section-sub">Real world problems uchun real world solutions — har bir loyiha o&apos;z hikoyasiga ega.</p>
            <div className="projects-grid">
              {[
                {
                  icon: "🛒", name: "Adminly", badge: "Live",
                  desc: "E-commerce uchun kuchli admin panel. Real-time analytics, order management va inventory tracking tizimi bilan to'liq CMS.",
                  tags: ["Next.js", "TypeScript", "MongoDB", "Tailwind"],
                  link: "https://adminly.uz",
                },
                {
                  icon: "🏡", name: "Dachago.uz", badge: "Live",
                  desc: "Dacha va ko'chmas mulk e'lonlari platformasi. Advanced filter, geo-location va xarita integratsiyasi.",
                  tags: ["React", "Node.js", "Maps API", "Express"],
                  link: "https://dachago.uz",
                },
                {
                  icon: "📢", name: "Adblogger.uz", badge: "Live",
                  desc: "Reklama va blogging platformasi. Content management, SEO optimization va monetization tizimi.",
                  tags: ["Next.js", "SEO", "CMS", "PostgreSQL"],
                  link: "https://adblogger.uz",
                },
                {
                  icon: "👗", name: "Stilzone.uz", badge: "Live",
                  desc: "Fashion e-commerce platforma. Virtual try-on, size recommendation va premium UI/UX dizayn.",
                  tags: ["React", "TypeScript", "Stripe", "Redis"],
                  link: "https://stilzone.uz",
                },
                {
                  icon: "⚗️", name: "Alximik.uz", badge: "Live",
                  desc: "Kimyo va fan bo'yicha ta'lim platformasi. Interactive laboratoriya simulatsiyalari va test tizimlari.",
                  tags: ["Next.js", "Animation", "Node.js", "MongoDB"],
                  link: "https://alximik.uz",
                },
                {
                  icon: "🏢", name: "Elevato.uz", badge: "Live",
                  desc: "Lift va elevator xizmatlari korporativ sayt. 3D animatsiyalar, online buyurtma va texnik xizmat tizimi.",
                  tags: ["React", "Three.js", "GSAP", "Express"],
                  link: "https://elevato.uz",
                },
              ].map((project) => (
                <div key={project.name} className="project-card reveal">
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

        {/* ── COMPANIES ── */}
        <section id="companies">
          <div className="section-wrap">
            <div className="section-tag">05 — Companies</div>
            <h2 className="section-title">Ishlagan <em>kompaniyalar</em></h2>
            <p className="section-sub">Har bir kompaniya o&apos;z tajribasi va saboqlarini berdi.</p>
            <div className="companies-row">
              <div className="company-card reveal">
                <div className="company-emoji">🚀</div>
                <div className="company-name">Mars IT</div>
                <div className="company-role">Senior Full-Stack Developer</div>
                <div className="company-desc">Innovatsion IT kompaniya. Enterprise-level loyihalar va cutting-edge texnologiyalar bilan ishlash.</div>
              </div>
              <div className="company-card reveal">
                <div className="company-emoji">💼</div>
                <div className="company-name">Albison</div>
                <div className="company-role">Full-Stack Developer</div>
                <div className="company-desc">Professional development muhiti. Complex SPA va API integratsiyalari bo&apos;yicha chuqur tajriba.</div>
              </div>
              <div className="company-card reveal">
                <div className="company-emoji">🌍</div>
                <div className="company-name">Freelance</div>
                <div className="company-role">Independent Developer</div>
                <div className="company-desc">Global mijozlar bilan ishlash. 20+ ta muvaffaqiyatli loyiha va 100% client satisfaction.</div>
              </div>
              <div className="company-card reveal">
                <div className="company-emoji">🤖</div>
                <div className="company-name">AI Startup</div>
                <div className="company-role">AI Engineer & Startuper</div>
                <div className="company-desc">AI mahsulotlar yaratish, LLM fine-tuning va intelligent automation tizimlari.</div>
              </div>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* ── SKILLS ── */}
        <section id="skills">
          <div className="section-wrap">
            <div className="section-tag">06 — Skills</div>
            <h2 className="section-title">Qobiliyat <em>darajam</em></h2>
            <p className="section-sub">Frontend dan backend gacha, AI dan DevOps gacha — to&apos;liq stack.</p>
            <div className="skills-cols">
              <div>
                <div className="skill-group-title">⚡ Frontend</div>
                {[
                  { name: "React / Next.js", pct: 96 },
                  { name: "TypeScript", pct: 92 },
                  { name: "Tailwind / CSS", pct: 95 },
                  { name: "Animations / GSAP", pct: 84 },
                ].map((s) => (
                  <div key={s.name} className="skill-bar-wrap reveal">
                    <div className="skill-bar-top">
                      <span className="skill-bar-name">{s.name}</span>
                      <span className="skill-bar-pct">{s.pct}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill" data-width={`${s.pct}%`} />
                    </div>
                  </div>
                ))}
                <div className="skill-group-title" style={{ marginTop: "32px" }}>🗄️ Backend</div>
                {[
                  { name: "Node.js / Express", pct: 91 },
                  { name: "MongoDB / Redis", pct: 88 },
                  { name: "PostgreSQL / Prisma", pct: 85 },
                ].map((s) => (
                  <div key={s.name} className="skill-bar-wrap reveal">
                    <div className="skill-bar-top">
                      <span className="skill-bar-name">{s.name}</span>
                      <span className="skill-bar-pct">{s.pct}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill" data-width={`${s.pct}%`} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="skill-group-title">🤖 AI & ML</div>
                {[
                  { name: "OpenAI API / LLMs", pct: 87 },
                  { name: "LangChain / RAG", pct: 80 },
                  { name: "AI Engineering", pct: 83 },
                ].map((s) => (
                  <div key={s.name} className="skill-bar-wrap reveal">
                    <div className="skill-bar-top">
                      <span className="skill-bar-name">{s.name}</span>
                      <span className="skill-bar-pct">{s.pct}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill" data-width={`${s.pct}%`} />
                    </div>
                  </div>
                ))}
                <div className="skill-group-title" style={{ marginTop: "32px" }}>🛠️ DevOps & Tools</div>
                {[
                  { name: "Docker / CI/CD", pct: 78 },
                  { name: "AWS / Vercel", pct: 75 },
                  { name: "Git / GitHub", pct: 93 },
                ].map((s) => (
                  <div key={s.name} className="skill-bar-wrap reveal">
                    <div className="skill-bar-top">
                      <span className="skill-bar-name">{s.name}</span>
                      <span className="skill-bar-pct">{s.pct}%</span>
                    </div>
                    <div className="skill-bar">
                      <div className="skill-bar-fill" data-width={`${s.pct}%`} />
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
            <div className="contact-inner reveal">
              <div className="contact-grid">
                <div>
                  <div className="section-tag" style={{ marginBottom: "16px" }}>07 — Contact</div>
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
                  <a href="mailto:akamljonmordayev@gmail.com" className="btn-primary" style={{ display: "inline-flex" }}>
                    📧 Email Yuborish
                  </a>
                </div>
                <div className="contact-links">
                  <a href="mailto:akamljonmordayev@gmail.com" className="contact-link">
                    <div className="contact-link-icon">📧</div>
                    <div className="contact-link-info">
                      <div className="contact-link-label">Email</div>
                      <div className="contact-link-value">akamljonmordayev@gmail.com</div>
                    </div>
                    <div className="contact-link-arrow">→</div>
                  </a>
                  <a href="tel:+998905200350" className="contact-link">
                    <div className="contact-link-icon">📱</div>
                    <div className="contact-link-info">
                      <div className="contact-link-label">Phone / Telegram</div>
                      <div className="contact-link-value">+998 90 520 03 50</div>
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
              Full-Stack Developer, AI Engineer va Startuper. Kelajakni kod bilan quraylik.
            </p>
            <div className="footer-socials">
              <a href="https://github.com/biloljonkomiljonov" target="_blank" rel="noopener noreferrer" className="footer-social">⌨️</a>
              <a href="https://t.me/biloljonkomiljonov" target="_blank" rel="noopener noreferrer" className="footer-social">✈️</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social">💼</a>
              <a href="mailto:akamljonmordayev@gmail.com" className="footer-social">📧</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Navigation</div>
            <ul className="footer-links">
              <li><a href="#about" onClick={handleNavClick}>About Me</a></li>
              <li><a href="#stack" onClick={handleNavClick}>Tech Stack</a></li>
              <li><a href="#experience" onClick={handleNavClick}>Experience</a></li>
              <li><a href="#projects" onClick={handleNavClick}>Projects</a></li>
              <li><a href="#companies" onClick={handleNavClick}>Companies</a></li>
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
              <li><a href="mailto:akamljonmordayev@gmail.com">Gmail</a></li>
              <li><a href="tel:+998905200350">+998 90 520 03 50</a></li>
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