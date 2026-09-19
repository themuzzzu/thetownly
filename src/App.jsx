import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue 
} from 'framer-motion';
import { 
  Compass, 
  Radar, 
  Zap, 
  Layers, 
  Cpu, 
  Activity, 
  TrendingUp, 
  ArrowRight, 
  Smartphone, 
  Store, 
  ShoppingBag, 
  Coffee, 
  Wrench, 
  Pill, 
  Laptop, 
  CheckCircle2, 
  Globe, 
  DollarSign,
  Shield,
  Sparkles,
  Search,
  MapPin,
  ChevronRight,
  Radio,
  Clock,
  Flame,
  ArrowUpRight
} from 'lucide-react';

/* ─── 1. INTERACTIVE CANVAS STARFIELD / NEURAL MESH ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = Math.min(Math.floor((width * height) / 18000), 75);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 1.5 + 0.8,
      baseAlpha: Math.random() * 0.5 + 0.2,
    }));

    const mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.14;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw & update particles
      particles.forEach((p) => {
        // Mouse avoidance / pull
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius) * 1.5;
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.baseAlpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  );
}

/* ─── 2. SPOTLIGHT BENTO CARD (DYNAMIC MOUSE GLOW) ─── */
function SpotlightCard({ children, className = '', glowColor = 'rgba(0, 245, 255, 0.15)' }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: -200, y: -200 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#090D1A]/80 backdrop-blur-xl transition-all duration-300 hover:border-white/[0.18] ${className}`}
    >
      {/* Interactive Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─── 3. 3D GYRO TILT CARD ─── */
function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 220, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 220, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className={`relative transition-all duration-200 ${className}`}
    >
      <div style={{ transform: 'translateZ(30px)' }}>{children}</div>
    </motion.div>
  );
}

/* ─── 4. ANIMATED BORDER BEAM ─── */
function BorderBeam({ size = 200, duration = 8, delay = 0 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      style={{
        maskImage: 'linear-gradient(transparent, transparent), linear-gradient(white, white)',
        maskClip: 'padding-box, border-box',
        maskComposite: 'intersect',
      }}
    >
      <motion.div
        className="absolute aspect-square bg-gradient-to-l from-cyan-400 via-purple-400 to-transparent opacity-80"
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round inherit)`,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay,
        }}
      />
    </div>
  );
}

/* ─── MAIN MASTER APPLICATION ─── */
export default function App() {
  // Cursor Spring Follower
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 28, stiffness: 200 };
  const auraX = useSpring(cursorX, springConfig);
  const auraY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  // Active Radar Lock Target
  const [selectedTarget, setSelectedTarget] = useState(0);

  const targets = [
    {
      id: 0,
      name: 'Old Town Organic Bakery',
      category: 'Artisanal Bakery',
      coords: '17.3850° N, 78.4867° E',
      distance: '340m',
      eta: '11 min drop',
      status: 'Open & Dispatching',
      rating: '4.96 (180+ reviews)',
      items: 'Sourdough Loaf, Pain au Chocolat, Bagels',
      pos: { top: '38%', left: '42%' },
      color: 'from-cyan-400 to-teal-400',
    },
    {
      id: 1,
      name: 'VoltCraft Master Electricians',
      category: 'Local On-Demand Pro',
      coords: '17.3872° N, 78.4891° E',
      distance: '620m',
      eta: 'Immediate Dispatch',
      status: 'Verified Contractor',
      rating: '4.98 (94 reviews)',
      items: 'Panel Wiring, Smart Home, Emergency Fix',
      pos: { top: '24%', left: '68%' },
      color: 'from-amber-400 to-orange-400',
    },
    {
      id: 2,
      name: 'CityCare 24/7 Medix Pharmacy',
      category: 'Certified Health Store',
      coords: '17.3831° N, 78.4839° E',
      distance: '480m',
      eta: '8 min delivery',
      status: '24/7 Dispensing',
      rating: '4.91 (310+ reviews)',
      items: 'Prescriptions, Rapid Diagnostics, Essentials',
      pos: { top: '65%', left: '30%' },
      color: 'from-rose-400 to-red-400',
    },
    {
      id: 3,
      name: 'NovaTech Micro-Electronics',
      category: 'Hardware & Components',
      coords: '17.3895° N, 78.4912° E',
      distance: '890m',
      eta: 'Same-day slot',
      status: 'Store Open',
      rating: '4.89 (76 reviews)',
      items: 'Custom Cables, NVMe SSDs, Arduino Kits',
      pos: { top: '72%', left: '74%' },
      color: 'from-purple-400 to-indigo-400',
    },
  ];

  // Live Simulated Stream
  const [telemetryStream, setTelemetryStream] = useState([
    { id: 1, type: 'DISPATCH', text: 'Order #4190 assigned to Local Runner Zaid (0.3km away)', time: '3s ago' },
    { id: 2, type: 'SAVINGS', text: '₹340 platform fee retained directly by merchant GreenHarvest', time: '14s ago' },
    { id: 3, type: 'CONNECT', text: 'Resident direct chat initiated with VoltCraft Electrical', time: '29s ago' },
  ]);

  useEffect(() => {
    const queue = [
      { type: 'DISPATCH', text: 'Micro-fulfillment: Artisanal Espresso delivered in 14 mins' },
      { type: 'VERIFIED', text: 'New local store "Crown Leatherworks" onboarded to townly grid' },
      { type: 'SAVINGS', text: 'Customer saved ₹85 with direct shopfront shelf pricing' },
      { type: 'INSTANT_PAY', text: 'UPI settlement of ₹1,850 completed with 0s latency' },
    ];
    let idx = 0;
    const timer = setInterval(() => {
      const item = queue[idx % queue.length];
      setTelemetryStream((prev) => [
        { id: Date.now(), type: item.type, text: item.text, time: 'Just now' },
        ...prev.slice(0, 3),
      ]);
      idx++;
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Category filter
  const [activeTab, setActiveTab] = useState('all');

  // ROI Calculator
  const [monthlyTurnover, setMonthlyTurnover] = useState(250000);
  const commissionLostToLegacy = Math.round(monthlyTurnover * 0.28);
  const annualSavings = commissionLostToLegacy * 12;

  // Staggered words for Hero Headline
  const headlineWords = ["Your", "Town's", "Entire", "Economy,", "Directly", "In", "Your", "Hands."];

  return (
    <div className="relative min-h-screen bg-[#04060B] text-slate-100 selection:bg-cyan-400 selection:text-black font-sans overflow-x-hidden">
      
      {/* 1. Dynamic Particle Mesh */}
      <ParticleCanvas />

      {/* 2. Mouse Aura Follower */}
      <motion.div
        className="pointer-events-none fixed -top-48 -left-48 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-cyan-500/12 via-blue-600/10 to-purple-600/12 blur-[100px] z-10"
        style={{ x: auraX, y: auraY }}
      />

      {/* 3. Deep Atmospheric Lighting Gradients */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-cyan-600/10 via-blue-700/5 to-transparent blur-[120px] z-0" />

      {/* 4. Glassmorphic Sticky Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-5 z-50 max-w-5xl mx-auto px-4"
      >
        <div className="relative rounded-2xl border border-white/[0.08] bg-[#070B16]/80 backdrop-blur-2xl px-6 py-3.5 flex items-center justify-between shadow-2xl shadow-black/80">
          <BorderBeam size={150} duration={10} />

          {/* Logo */}
          <a href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#050811] rounded-[11px] flex items-center justify-center">
                <Compass className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '20s' }} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-cyan-100 to-slate-400 bg-clip-text text-transparent">
                Townly
              </span>
              <span className="text-[9px] font-mono tracking-widest text-cyan-400/80 -mt-1 font-semibold">
                thetownly.in
              </span>
            </div>
          </a>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
            <a href="#radar" className="hover:text-cyan-300 transition-colors flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Town Radar</span>
            </a>
            <a href="#protocol" className="hover:text-cyan-300 transition-colors">Protocol</a>
            <a href="#network" className="hover:text-cyan-300 transition-colors">Sectors</a>
            <a href="#calculator" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Merchant 0%</span>
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <motion.a
              href="#app"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-4 py-2 rounded-xl text-xs font-bold text-black bg-gradient-to-r from-cyan-400 to-teal-300 shadow-md shadow-cyan-400/20 flex items-center gap-1.5"
            >
              <span>Launch App</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 pt-24 pb-20 md:pt-36 md:pb-28 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Top telemetry tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/[0.05] text-[11px] font-mono text-cyan-300 mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span>HYPERLOCAL COMMERCE PROTOCOL &bull; INDIA</span>
            <span className="text-slate-500">|</span>
            <span className="text-emerald-400 font-semibold">0% COMMISSIONS</span>
          </motion.div>

          {/* Staggered Blur-In Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.04] text-white">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 35, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`inline-block mr-3 sm:mr-4 ${
                  i === 3 || i === 4
                    ? 'bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent'
                    : ''
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-8 text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Connect instantly with neighborhood stores, verified contractors, and local creators. 
            Direct communication, true shelf rates, and lightning fulfillment without predator aggregators.
          </motion.p>

          {/* Interactive CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a
              href="#radar"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-300 shadow-xl shadow-cyan-400/25 flex items-center justify-center gap-2.5 text-sm cursor-pointer"
            >
              <Radar className="w-4 h-4 text-black" />
              <span>Scan Active Neighborhood Radar</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a
              href="#calculator"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-200 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              <Store className="w-4 h-4 text-cyan-400" />
              <span>Merchant Retained Profits</span>
            </motion.a>
          </motion.div>

          {/* Live Telemetry Ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-14 max-w-xl mx-auto rounded-2xl border border-white/[0.08] bg-[#090D1A]/90 p-3 flex items-center justify-between text-xs font-mono backdrop-blur-xl shadow-xl shadow-black/50"
          >
            <div className="flex items-center gap-2 text-cyan-400 font-bold pl-2">
              <Activity className="w-4 h-4 animate-pulse" />
              <span>LIVE PULSE:</span>
            </div>

            <div className="overflow-hidden whitespace-nowrap text-slate-300 truncate max-w-xs sm:max-w-md px-2">
              <AnimatePresence mode="wait">
                <motion.span
                  key={telemetryStream[0].id}
                  initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                  transition={{ duration: 0.35 }}
                  className="inline-block"
                >
                  <span className="text-cyan-300 font-semibold mr-1.5">[{telemetryStream[0].type}]</span>
                  {telemetryStream[0].text}
                </motion.span>
              </AnimatePresence>
            </div>

            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
              ACTIVE
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─── LIVE NEIGHBORHOOD CYBER RADAR (HIGH TECH INTERACTION) ─── */}
      <section id="radar" className="relative z-10 py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">
            <Radio className="w-3.5 h-3.5" />
            <span>Interactive Geofence Telemetry</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Live Town Sonar.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Click any pulsing node on the radar grid to lock target telemetry, verify merchant proximity, and dispatch direct orders.
          </p>
        </div>

        <SpotlightCard className="p-8 sm:p-12 border-cyan-500/20" glowColor="rgba(0, 245, 255, 0.12)">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Console Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                <span>[ TARGET LOCKED: {targets[selectedTarget].id + 1} OF {targets.length} ]</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {targets[selectedTarget].name}
                </h3>
                <p className="text-xs font-mono text-cyan-400 mt-1">
                  Sector: {targets[selectedTarget].category} &bull; {targets[selectedTarget].coords}
                </p>
              </div>

              {/* Target Data Matrix */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Distance</div>
                  <div className="text-emerald-400 font-bold text-base mt-0.5">{targets[selectedTarget].distance}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Est. Fulfillment</div>
                  <div className="text-cyan-400 font-bold text-base mt-0.5">{targets[selectedTarget].eta}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Node Status</div>
                  <div className="text-white font-bold text-xs mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {targets[selectedTarget].status}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Community Trust</div>
                  <div className="text-amber-300 font-bold text-xs mt-1">{targets[selectedTarget].rating}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="text-slate-400 text-[11px] mb-1 font-mono">Popular Catalog Highlights:</div>
                <div className="text-slate-200 font-medium">{targets[selectedTarget].items}</div>
              </div>

              <motion.a
                href="#app"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl font-bold text-black bg-gradient-to-r from-cyan-400 to-teal-300 flex items-center justify-center gap-2 text-xs shadow-lg shadow-cyan-400/20"
              >
                <span>Connect with {targets[selectedTarget].name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>

            {/* Right Sonar Visual Grid */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full border border-cyan-500/30 bg-[#03060E] flex items-center justify-center shadow-2xl shadow-cyan-500/10 overflow-hidden">
                
                {/* Concentric Sonar Rings */}
                <div className="absolute w-[80%] h-[80%] rounded-full border border-cyan-500/15" />
                <div className="absolute w-[55%] h-[55%] rounded-full border border-cyan-500/20" />
                <div className="absolute w-[30%] h-[30%] rounded-full border border-cyan-500/25" />
                <div className="absolute w-[10%] h-[10%] rounded-full border border-cyan-500/30" />

                {/* Radar Grid Axes */}
                <div className="absolute w-full h-[1px] bg-cyan-500/20" />
                <div className="absolute h-full w-[1px] bg-cyan-500/20" />
                <div className="absolute w-full h-[1px] bg-cyan-500/10 rotate-45" />
                <div className="absolute w-full h-[1px] bg-cyan-500/10 -rotate-45" />

                {/* Sweeping Sonar Beam */}
                <div className="absolute inset-0 animate-radar origin-center pointer-events-none">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/35 via-cyan-500/10 to-transparent rounded-tl-full" />
                </div>

                {/* Pulse ripples radiating from center */}
                <motion.div
                  className="absolute rounded-full border border-cyan-400/40 pointer-events-none"
                  animate={{ width: ['0%', '100%'], height: ['0%', '100%'], opacity: [0.8, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
                />

                {/* Center User Hub Pin */}
                <div className="relative z-20 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center shadow-xl shadow-cyan-400/80">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>

                {/* Interactive Target Blips */}
                {targets.map((t) => {
                  const isSelected = selectedTarget === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      onClick={() => setSelectedTarget(t.id)}
                      style={{ top: t.pos.top, left: t.pos.left }}
                      whileHover={{ scale: 1.35 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute z-30 -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                    >
                      <div className="relative flex items-center justify-center">
                        {isSelected && (
                          <motion.div
                            layoutId="sonarReticle"
                            className="absolute -inset-2.5 rounded-full border-2 border-cyan-300 animate-spin"
                            style={{ animationDuration: '6s' }}
                          />
                        )}
                        <span className="relative flex h-3.5 w-3.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className={`relative inline-flex rounded-full h-3.5 w-3.5 ${isSelected ? 'bg-cyan-300' : 'bg-emerald-400'} border-2 border-slate-950`}></span>
                        </span>
                      </div>
                      <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-cyan-500/40">
                        {t.name}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </div>
        </SpotlightCard>
      </section>

      {/* ─── 3. HIGH-TECH BENTO ARCHITECTURE ─── */}
      <section id="protocol" className="relative z-10 py-24 max-w-6xl mx-auto px-6 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">Protocol Architecture</div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            How Townly Eradicates the Middleman.
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Engineered from first principles to return profits to local merchants and genuine pricing to customers.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1: Direct Settlement (Big 8-col) */}
          <SpotlightCard className="md:col-span-8 p-8 sm:p-10 flex flex-col justify-between" glowColor="rgba(0, 245, 255, 0.15)">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider mb-2">
                P2P Value Routing
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Zero Commission. Direct Bank Settlement.
              </h3>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xl">
                Unlike corporate delivery apps that deduct 25% to 35% fees and hold back weekly payouts, 
                every rupee spent on Townly flows directly into the shopkeeper's account with instant UPI settlement.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>100% Retained Revenue</span>
              </div>
              <div className="flex items-center gap-2 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant UPI & QR Payouts</span>
              </div>
              <div className="text-slate-500">// COMMISSIONS: 0.00%</div>
            </div>
          </SpotlightCard>

          {/* Card 2: Decentralized Logistics (4-col) */}
          <SpotlightCard className="md:col-span-4 p-8 sm:p-10 flex flex-col justify-between" glowColor="rgba(168, 85, 247, 0.15)">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider mb-2">
                Hyperlocal Runners
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Under 25-Min Town Drops.
              </h3>
              <p className="mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed">
                Empower neighborhood riders already within your locality. Smarter routes mean faster hot food, fresher groceries, and authentic care.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs font-mono text-purple-300">
              AVERAGE ETA: 18.4 MINS
            </div>
          </SpotlightCard>

          {/* Card 3: AI Sync & Multilingual (4-col) */}
          <SpotlightCard className="md:col-span-4 p-8 sm:p-10 flex flex-col justify-between" glowColor="rgba(16, 185, 129, 0.15)">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider mb-2">
                Voice & Regional AI
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Built for Bharat.
              </h3>
              <p className="mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed">
                Merchants update catalogs using spoken local audio (Telugu, Hindi, Kannada, Tamil). AI auto-structures pricing, tags, and photos.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/[0.06] text-xs font-mono text-emerald-400">
              VOICE RECOGNITION ENABLED
            </div>
          </SpotlightCard>

          {/* Card 4: Direct Merchant Chat (8-col) */}
          <SpotlightCard className="md:col-span-8 p-8 sm:p-10 flex flex-col justify-between" glowColor="rgba(56, 189, 248, 0.15)">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <div className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider mb-2">
                Human-First Commerce
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Direct Communication With Store Owners.
              </h3>
              <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xl">
                No dumb automated chatbots. Message or call your local tailor, grocer, or electrician directly.
                Customize cuts, check fresh stock, and negotiate special volume discounts in real-time.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-cyan-300">REAL SHOPPING WITH REAL PEOPLE</span>
              <span>// ZERO ALGORITHMIC BIAS</span>
            </div>
          </SpotlightCard>

        </div>
      </section>

      {/* ─── 4. INTERACTIVE 0% RETENTION SIMULATOR ─── */}
      <section id="calculator" className="relative z-10 py-24 max-w-5xl mx-auto px-6">
        <TiltCard>
          <SpotlightCard className="p-8 sm:p-14 border-emerald-500/30" glowColor="rgba(16, 185, 129, 0.15)">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold mb-3 border border-emerald-500/30">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>MERCHANT REVENUE TELEMETRY</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Stop Paying The 28% Middleman Tax.
              </h2>
              <p className="mt-3 text-slate-400 text-sm sm:text-base">
                Slide your current monthly delivery volume to simulate how much profit Townly saves:
              </p>
            </div>

            {/* Slider */}
            <div className="mt-12 max-w-xl mx-auto">
              <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-3">
                <span>MONTHLY STORE SALES:</span>
                <span className="text-2xl font-black text-cyan-400">₹{monthlyTurnover.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="30000"
                max="1500000"
                step="20000"
                value={monthlyTurnover}
                onChange={(e) => setMonthlyTurnover(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                <span>₹30,000 / mo</span>
                <span>₹7,50,000 / mo</span>
                <span>₹15,00,000 / mo</span>
              </div>
            </div>

            {/* Output Matrix */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 text-center">
                <div className="text-[11px] font-mono uppercase text-red-400 font-semibold tracking-wider">
                  Lost to 28% Aggregator Commission
                </div>
                <div className="text-3xl sm:text-4xl font-black text-red-400 mt-3">
                  - ₹{commissionLostToLegacy.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 mt-1">Every single month</div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/50 text-center shadow-xl shadow-emerald-500/10">
                <div className="text-[11px] font-mono uppercase text-emerald-400 font-semibold tracking-wider">
                  Retained With Townly (0%)
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-300 mt-3">
                  + ₹{commissionLostToLegacy.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-emerald-400/80 font-bold mt-1">
                  ₹{annualSavings.toLocaleString('en-IN')} saved per year!
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <motion.a
                href="mailto:partner@thetownly.in?subject=Townly%20Merchant%20Onboarding"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-300 shadow-xl shadow-emerald-400/25 text-sm"
              >
                <span>Claim Your Free Merchant Onboarding</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </SpotlightCard>
        </TiltCard>
      </section>

      {/* ─── 5. APP GATEWAY SECTION ─── */}
      <section id="app" className="relative z-10 py-24 max-w-6xl mx-auto px-6 border-t border-white/[0.06]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold mb-3 border border-cyan-500/30">
              <Smartphone className="w-3.5 h-3.5" />
              <span>MOBILE ACCESS POINT</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Hyperlocal commerce in your pocket.
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Explore your live town radar, chat with store owners, track micro-runners, and claim exclusive neighborhood flash deals.
            </p>

            <div className="mt-8 space-y-4 font-mono text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Zero convenience surcharges on orders</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Live runner GPS coordinates & direct audio calls</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Instant UPI direct payment & cash on delivery</span>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-cyan-400/50 flex items-center gap-3 text-xs"
              >
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <div className="text-left font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">Direct APK</div>
                  <div className="font-bold text-white">Android Download</div>
                </div>
              </motion.a>

              <motion.a
                href="#"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-6 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-purple-400/50 flex items-center gap-3 text-xs"
              >
                <Globe className="w-5 h-5 text-purple-400" />
                <div className="text-left font-mono">
                  <div className="text-[9px] text-slate-500 uppercase">Instant PWA</div>
                  <div className="font-bold text-white">Launch In Browser</div>
                </div>
              </motion.a>
            </div>
          </div>

          {/* Holographic Phone Mockup */}
          <div className="flex justify-center">
            <TiltCard>
              <div className="relative w-72 h-[480px] rounded-[40px] border-4 border-slate-700/80 bg-[#070B16] p-4 shadow-2xl shadow-cyan-500/20 flex flex-col justify-between overflow-hidden">
                <BorderBeam size={200} duration={8} />

                {/* Notch */}
                <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>

                {/* Screen Feed */}
                <div className="space-y-3 flex-1 overflow-hidden pt-4">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/40 to-cyan-900/30 border border-cyan-500/30 font-mono text-xs">
                    <div className="flex justify-between items-center text-[10px] text-cyan-400">
                      <span>RADAR ACTIVE</span>
                      <span className="text-emerald-400">84 NODES</span>
                    </div>
                    <div className="font-bold text-white text-sm mt-1">Downtown Market Sector</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>RUNNER EN ROUTE</span>
                      <span className="text-emerald-400 font-bold">ETA 9M</span>
                    </div>
                    <div className="font-bold text-white">Cold Brew + Fresh Croissant</div>
                    <div className="text-[10px] text-slate-500">From Old Town Bakery &bull; ₹140</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>SAVED BY YOU</span>
                      <span className="text-cyan-400 font-bold">₹82.00</span>
                    </div>
                    <div className="text-slate-300">0% Surcharge Direct Deal</div>
                  </div>
                </div>

                {/* Home Indicator */}
                <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto" />
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#03050A] py-14 font-mono text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-black">
              T
            </div>
            <div>
              <div className="text-white font-bold tracking-wider">TOWNLY COMMERCE GRID</div>
              <div className="text-[10px] text-slate-400">thetownly.in &bull; AUTONOMOUS LOCAL PROTOCOL</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="mailto:support@thetownly.in" className="hover:text-cyan-400 transition-colors">support@thetownly.in</a>
            <a href="/robots.txt" className="hover:text-cyan-400 transition-colors">robots.txt</a>
            <a href="/sitemap.xml" className="hover:text-cyan-400 transition-colors">sitemap.xml</a>
          </div>

          <div className="text-slate-600 text-[11px]">
            &copy; {new Date().getFullYear()} Townly. Deployed autonomously on Cloudflare Edge.
          </div>
        </div>
      </footer>

    </div>
  );
}
