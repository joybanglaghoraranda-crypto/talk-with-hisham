'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animId: number;
    let mouseX = -1000;
    let mouseY = -1000;
    let scrollY = 0;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      init();
    }

    function init() {
      const isMobile = canvas!.width < 768;
      const maxCount = isMobile ? 45 : 100;
      const divisor = isMobile ? 16000 : 10000;
      const count = Math.min(maxCount, Math.floor((canvas!.width * canvas!.height) / divisor));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas!.width,
          y: Math.random() * canvas!.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          hue: 120 + Math.random() * 30, // green tones 120-150
        });
      }
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const parallaxY = scrollY * 0.1;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + (mouseX - p.x) * 0.0005;
        p.y += p.vy + (mouseY - p.y) * 0.0005;

        const drawY = p.y + parallaxY * (p.x / canvas.width);

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (drawY < -20) p.y = canvas.height + 20 + parallaxY;
        if (drawY > canvas.height + 20) p.y = -20 - parallaxY;

        // Brighter glow dot
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 55%, ${p.opacity})`;
        ctx.fill();

        // Glow halo
        const distToMouse = Math.hypot(p.x - mouseX, drawY - mouseY);
        const mouseBoost = distToMouse < 180 ? (1 - distToMouse / 180) * 0.15 : 0;
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 55%, ${p.opacity * 0.08 + mouseBoost})`;
        ctx.fill();

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const drawY2 = p2.y + parallaxY * (p2.x / canvas.width);
          const dx = p.x - p2.x;
          const dy = drawY - drawY2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const linkDist = canvas!.width < 768 ? 110 : 150;
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.25;
            const midHue = (p.hue + p2.hue) / 2;
            ctx.beginPath();
            ctx.moveTo(p.x, drawY);
            ctx.lineTo(p2.x, drawY2);
            ctx.strokeStyle = `hsla(${midHue}, 60%, 60%, ${alpha})`;
            ctx.lineWidth = Math.max(0.3, 1 - dist / 150);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      draw();
      animId = requestAnimationFrame(animate);
    }

    resize();
    animate();

    const onMouse = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; };
    const onClick = (e: MouseEvent) => {
      // Burst particles on click
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
        const speed = 1.5 + Math.random() * 2.5;
        particles.push({
          x: mouseX,
          y: mouseY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 3 + 1.5,
          opacity: 0.7 + Math.random() * 0.3,
          hue: 100 + Math.random() * 60,
        });
      }
      // Cap total particles
      if (particles.length > 200) particles.splice(0, particles.length - 200);
    };
    const onScroll = () => { scrollY = window.scrollY; };

    window.addEventListener('resize', resize);
    window.addEventListener('click', onClick);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.85 }}
    />
  );
}
