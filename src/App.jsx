import React, { useState, useEffect, useRef } from 'react';
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
  ShieldCheck,
  Search,
  MapPin,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  User,
  Star,
  Clock,
  PhoneCall
} from 'lucide-react';

/* ─── TOWNLY INTERACTIVE SATURN LOGO (PHYSICS MOONS) ─── */
class Moon {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.history = [];
    this.color = '#70b5ff';
    this.radius = Math.random() * 1.5 + 1;
    this.dead = false;
  }

  update(centerX, centerY, G, planetMass, planetRadius) {
    const dx = centerX - this.x;
    const dy = centerY - this.y;
    const distSq = dx * dx + dy * dy;
    const dist = Math.sqrt(distSq);

    if (dist > 10) {
      const force = (G * planetMass) / distSq;
      const ax = force * (dx / dist);
      const ay = force * (dy / dist);
      this.vx += ax;
      this.vy += ay;
    }

    this.x += this.vx;
    this.y += this.vy;

    this.history.push({ x: this.x, y: this.y });
    if (this.history.length > 25) this.history.shift();

    if (dist < planetRadius * 0.8 || Math.abs(this.x - centerX) > 160 || Math.abs(this.y - centerY) > 160) {
      this.dead = true;
    }
  }

  draw(ctx) {
    if (this.history.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 0.8;
      for (let i = 0; i < this.history.length - 1; i++) {
        ctx.globalAlpha = i / this.history.length;
        ctx.lineTo(this.history[i].x, this.history[i].y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.history[i].x, this.history[i].y);
      }
      ctx.lineTo(this.x, this.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    ctx.beginPath();
    ctx.fillStyle = '#FFFFFF';
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function TownlyPlanetLogo({ className = "w-14 h-14" }) {
  const canvasRef = useRef(null);
  const moonsRef = useRef([]);
  const requestRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const G = 0.45;
  const PLANET_MASS = 2800;
  const VIEW_SIZE = 300;
  const CENTER = VIEW_SIZE / 2;

  const spawnOrbitingMoon = (x, y) => {
    const dx = CENTER - x;
    const dy = CENTER - y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 30) return;
    const v = Math.sqrt((G * PLANET_MASS) / dist);
    const vx = (-dy / dist) * v;
    const vy = (dx / dist) * v;
    moonsRef.current.push(new Moon(x, y, vx, vy));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Initial moons
    spawnOrbitingMoon(CENTER + 75, CENTER);
    spawnOrbitingMoon(CENTER - 95, CENTER + 15);

    const animate = () => {
      ctx.clearRect(0, 0, VIEW_SIZE, VIEW_SIZE);
      for (let i = moonsRef.current.length - 1; i >= 0; i--) {
        const moon = moonsRef.current[i];
        moon.update(CENTER, CENTER, G, PLANET_MASS, 68);
        if (!moon.dead) {
          moon.draw(ctx);
        } else {
          moonsRef.current.splice(i, 1);
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  // Periodic orbital spawn
  useEffect(() => {
    const interval = setInterval(() => {
      if (moonsRef.current.length < 12) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 70 + Math.random() * 45;
        spawnOrbitingMoon(CENTER + Math.cos(angle) * dist, CENTER + Math.sin(angle) * dist);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`relative flex items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-[#007FFF]/20 blur-[28px] rounded-full -z-10" />
      <canvas
        ref={canvasRef}
        width={VIEW_SIZE}
        height={VIEW_SIZE}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full pointer-events-none relative z-10 overflow-visible"
      >
        <defs>
          <linearGradient id="townlyPlanetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#80bfff" />
            <stop offset="45%" stopColor="#007FFF" />
            <stop offset="100%" stopColor="#0047AB" />
          </linearGradient>
          <linearGradient id="ringEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Back Ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: isHovered ? 6 : 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "150px 150px" }}
        >
          <path
            d="M 50,150 A 100,30 0 0,1 250,150"
            fill="none"
            stroke="#007FFF"
            strokeWidth="11"
            strokeLinecap="round"
            transform="rotate(-18 150 150)"
            opacity="0.6"
          />
        </motion.g>

        {/* Planet Sphere */}
        <g transform="rotate(-5 150 150)">
          <circle cx="150" cy="150" r="70" fill="url(#townlyPlanetGrad)" />
          <path d="M 95,175 Q 150,195 205,165" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" transform="rotate(-15 150 150)" />
          <path d="M 105,188 Q 150,205 195,178" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="2" transform="rotate(-15 150 150)" />
          <ellipse cx="155" cy="115" rx="45" ry="25" fill="white" opacity="0.85" />
        </g>

        {/* Front Ring */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: isHovered ? 6 : 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "150px 150px" }}
        >
          <g transform="rotate(-18 150 150)">
            <path
              d="M 50,150 A 100,30 0 0,0 250,150"
              fill="none"
              stroke="#007FFF"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M 50,150 A 100,30 0 0,0 250,150"
              fill="none"
              stroke="url(#ringEdgeGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              transform="translate(0, -3)"
            />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}

/* ─── DYNAMIC TYPEWRITER SEARCH BAR ─── */
function TypewriterSearchBar() {
  const words = [
    "Plumbers & Electricians near me...",
    "Farm-fresh groceries under 20 mins...",
    "Top rated neighborhood cafes...",
    "24/7 Prescription pharmacies...",
    "Custom tailors & fashion boutiques..."
  ];

  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = words[currentWordIdx];
    const speed = isDeleting ? 30 : 70;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(fullText.substring(0, displayText.length + 1));
        if (displayText === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(fullText.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setCurrentWordIdx((prev) => (prev + 1) % words.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentWordIdx]);

  return (
    <div className="relative max-w-2xl mx-auto w-full">
      <div className="relative rounded-2xl border border-white/10 bg-[#0A1124]/90 backdrop-blur-xl p-2 sm:p-2.5 flex items-center gap-3 shadow-2xl shadow-[#007FFF]/10 transition-all focus-within:border-[#007FFF] focus-within:ring-2 focus-within:ring-[#007FFF]/20">
        <div className="w-10 h-10 rounded-xl bg-[#007FFF]/10 text-[#007FFF] flex items-center justify-center flex-shrink-0">
          <Search className="w-5 h-5" />
        </div>
        <div className="flex-1 text-left text-sm sm:text-base text-slate-300 font-medium truncate flex items-center">
          <span>{displayText}</span>
          <span className="w-0.5 h-5 bg-[#007FFF] ml-1 animate-pulse" />
        </div>
        <button className="px-5 py-2.5 rounded-xl bg-[#007FFF] hover:bg-[#0066d6] text-white text-xs font-bold transition-all shadow-md shadow-[#007FFF]/30 flex items-center gap-1.5 flex-shrink-0 active:scale-95">
          <span>Discover</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ─── SPOTLIGHT CARD (BLUE ACCENT) ─── */
function SpotlightCard({ children, className = '', glow = 'rgba(0, 127, 255, 0.18)' }) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#070D1F]/80 backdrop-blur-xl transition-all duration-300 hover:border-[#007FFF]/40 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(550px circle at ${pos.x}px ${pos.y}px, ${glow}, transparent 45%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ─── 3D GYRO TILT CARD ─── */
function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 240, damping: 22 };
  const rotateX = useTransform(useSpring(y, springConfig), [-0.5, 0.5], ['9deg', '-9deg']);
  const rotateY = useTransform(useSpring(x, springConfig), [-0.5, 0.5], ['-9deg', '9deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      <div style={{ transform: 'translateZ(25px)' }}>{children}</div>
    </motion.div>
  );
}

/* ─── MASTER TOWNLY WEB EXPERIENCE ─── */
export default function App() {
  const [viewMode, setViewMode] = useState('users'); // 'users' or 'merchants'

  // Cursor Aura
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 180 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 180 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  // Selected Radar Node
  const [selectedRadarIdx, setSelectedRadarIdx] = useState(0);

  const radarNodes = [
    {
      id: 0,
      name: "Tadipatri Central Grocers",
      category: "Daily Essentials & Organic",
      distance: "280m away",
      eta: "14 min drop",
      status: "Verified Partner",
      rating: "4.9 ★ (220+ orders)",
      deal: "0% markup &bull; ₹45 saved vs apps",
      pos: { top: '35%', left: '42%' }
    },
    {
      id: 1,
      name: "Apex Precision Electricals",
      category: "Home & Industrial Services",
      distance: "600m away",
      eta: "Instant call available",
      status: "Master Certified",
      rating: "4.98 ★ (115 reviews)",
      deal: "Direct booking &bull; No middlemen fee",
      pos: { top: '25%', left: '70%' }
    },
    {
      id: 2,
      name: "CityCare 24/7 Medix",
      category: "Emergency & General Pharmacy",
      distance: "410m away",
      eta: "9 min dispatch",
      status: "Open Now",
      rating: "4.92 ★ (340 reviews)",
      deal: "Genuine MRP &bull; Direct pharmacist advice",
      pos: { top: '65%', left: '32%' }
    },
    {
      id: 3,
      name: "Heritage Roast Cafe",
      category: "Artisanal Coffee & Bakery",
      distance: "820m away",
      eta: "18 min pickup",
      status: "Live Counter",
      rating: "4.88 ★ (190 reviews)",
      deal: "Store menu prices &bull; Fresh morning batch",
      pos: { top: '70%', left: '68%' }
    }
  ];

  // Merchant Revenue Slider
  const [monthlySales, setMonthlySales] = useState(300000);
  const aggregatorFee = Math.round(monthlySales * 0.28);
  const annualSavings = aggregatorFee * 12;

  return (
    <div className="relative min-h-screen bg-[#040814] text-slate-100 selection:bg-[#007FFF] selection:text-white font-sans overflow-x-hidden">
      
      {/* Dynamic Cursor Light Aura in Brand Blue */}
      <motion.div
        className="pointer-events-none fixed -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#007FFF]/20 via-[#0055c4]/15 to-transparent blur-[110px] z-0"
        style={{ x: springX, y: springY }}
      />

      {/* Top Ambient Light Flare */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[450px] bg-gradient-to-b from-[#007FFF]/15 via-[#0047AB]/5 to-transparent blur-[120px] z-0" />

      {/* ─── HEADER ─── */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-4 z-50 max-w-5xl mx-auto px-4"
      >
        <div className="rounded-2xl border border-white/[0.08] bg-[#060C1B]/85 backdrop-blur-2xl px-5 py-3 flex items-center justify-between shadow-2xl shadow-black/80">
          
          {/* Logo & Brand Identity */}
          <a href="/" className="flex items-center gap-3 group">
            <TownlyPlanetLogo className="w-10 h-10" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-[#70b5ff] bg-clip-text text-transparent">
                Townly
              </span>
              <span className="text-[9px] font-mono tracking-wider text-[#007FFF] font-bold uppercase -mt-1">
                thetownly.in
              </span>
            </div>
          </a>

          {/* Perspective Switcher: Shopper vs Merchant */}
          <div className="hidden sm:flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => setViewMode('users')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'users' ? 'bg-[#007FFF] text-white shadow-md shadow-[#007FFF]/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>For Customers</span>
            </button>
            <button
              onClick={() => setViewMode('merchants')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'merchants' ? 'bg-[#007FFF] text-white shadow-md shadow-[#007FFF]/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>For Businesses</span>
            </button>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-3">
            <motion.a
              href="#app"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#007FFF] to-[#005bb5] shadow-lg shadow-[#007FFF]/25 flex items-center gap-1.5 border border-[#007FFF]/40"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Get App</span>
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative z-10 pt-20 pb-16 md:pt-32 md:pb-24 max-w-5xl mx-auto px-6 text-center">
        
        {/* Live Town Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#007FFF]/30 bg-[#007FFF]/10 text-xs font-mono text-[#80bfff] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#007FFF] animate-pulse" />
          <span>YOUR TOWN &bull; YOUR STORES &bull; ZERO COMMISSIONS</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.06] text-white max-w-4xl mx-auto"
        >
          Your Town's Local Marketplace, <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#007FFF] via-[#54a3ff] to-[#99ccff] bg-clip-text text-transparent">
            Without Middlemen Taxes.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Discover certified stores, hire trusted neighborhood pros, and order directly with instant WhatsApp or audio connect. 
          Real shop prices with 100% earnings kept by local merchants.
        </motion.p>

        {/* Typewriter Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-10"
        >
          <TypewriterSearchBar />
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#radar"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-[#007FFF] hover:bg-[#0066d6] shadow-xl shadow-[#007FFF]/30 flex items-center justify-center gap-2.5 text-sm transition-all"
          >
            <Radar className="w-4 h-4 text-white" />
            <span>Open Neighborhood Sonar</span>
            <ArrowRight className="w-4 h-4" />
          </motion.a>

          <motion.a
            href="#calculator"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-slate-200 border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all flex items-center justify-center gap-2.5 text-sm"
          >
            <Store className="w-4 h-4 text-[#007FFF]" />
            <span>Store Onboarding &amp; Savings</span>
          </motion.a>
        </motion.div>

        {/* Value Metrics */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-white/[0.08] pt-10"
        >
          <div>
            <div className="text-3xl font-black text-white">0%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Commission Surcharge</div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#007FFF]">&lt; 25m</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Local Town Drops</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Direct UPI Settlement</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400">₹0 Fee</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Customer Convenience Tax</div>
          </div>
        </motion.div>
      </section>

      {/* ─── LIVE TOWN SONAR (RADAR INTERACTIVE) ─── */}
      <section id="radar" className="relative z-10 py-20 max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#007FFF] uppercase tracking-widest mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Live Geofence Scanner</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Town Sonar Telemetry.
          </h2>
          <p className="mt-3 text-slate-400 text-sm">
            Click any active store blip to view live dispatch availability and connect directly with the merchant.
          </p>
        </div>

        <SpotlightCard className="p-8 sm:p-12 border-[#007FFF]/20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Info Console */}
            <div className="md:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#007FFF]/10 border border-[#007FFF]/30 text-xs font-mono text-[#80bfff]">
                <span>[ TARGET NODE: {selectedRadarIdx + 1} / {radarNodes.length} ]</span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {radarNodes[selectedRadarIdx].name}
                </h3>
                <p className="text-xs text-[#007FFF] font-mono mt-1">
                  {radarNodes[selectedRadarIdx].category}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Distance</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">{radarNodes[selectedRadarIdx].distance}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-slate-500 text-[10px] uppercase">Fulfillment ETA</div>
                  <div className="text-[#007FFF] font-bold text-sm mt-0.5">{radarNodes[selectedRadarIdx].eta}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#061026] border border-[#007FFF]/30 text-xs">
                <div className="text-[#80bfff] text-[11px] font-mono uppercase tracking-wider font-semibold">Direct Advantage</div>
                <div className="text-slate-200 mt-1 font-medium">{radarNodes[selectedRadarIdx].deal}</div>
              </div>

              <motion.a
                href="#app"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-[#007FFF] hover:bg-[#0066d6] flex items-center justify-center gap-2 text-xs shadow-lg shadow-[#007FFF]/30"
              >
                <span>Connect Direct with {radarNodes[selectedRadarIdx].name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>

            {/* Right Sonar Visual Display */}
            <div className="md:col-span-6 flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-[#007FFF]/30 bg-[#030713] flex items-center justify-center shadow-2xl shadow-[#007FFF]/10 overflow-hidden">
                
                {/* Sonar Rings */}
                <div className="absolute w-[80%] h-[80%] rounded-full border border-[#007FFF]/15" />
                <div className="absolute w-[55%] h-[55%] rounded-full border border-[#007FFF]/20" />
                <div className="absolute w-[30%] h-[30%] rounded-full border border-[#007FFF]/25" />

                {/* Radar Axes */}
                <div className="absolute w-full h-[1px] bg-[#007FFF]/15" />
                <div className="absolute h-full w-[1px] bg-[#007FFF]/15" />

                {/* Sweeping Sonar Needle */}
                <div className="absolute inset-0 animate-radar origin-center pointer-events-none">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-[#007FFF]/35 via-[#007FFF]/5 to-transparent rounded-tl-full" />
                </div>

                {/* Center User Hub */}
                <div className="relative z-20 w-4 h-4 rounded-full bg-[#007FFF] flex items-center justify-center shadow-lg shadow-[#007FFF]">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Interactive Blips */}
                {radarNodes.map((node) => {
                  const active = selectedRadarIdx === node.id;
                  return (
                    <motion.button
                      key={node.id}
                      onClick={() => setSelectedRadarIdx(node.id)}
                      style={{ top: node.pos.top, left: node.pos.left }}
                      whileHover={{ scale: 1.4 }}
                      className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                    >
                      <div className="relative flex items-center justify-center">
                        {active && (
                          <div className="absolute -inset-2 rounded-full border border-[#80bfff] animate-ping" />
                        )}
                        <span className={`w-3.5 h-3.5 rounded-full ${active ? 'bg-white shadow-lg shadow-white' : 'bg-[#007FFF]'} border-2 border-[#040814]`}></span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </div>
        </SpotlightCard>
      </section>

      {/* ─── MERCHANT 0% SAVINGS SIMULATOR ─── */}
      <section id="calculator" className="relative z-10 py-20 max-w-5xl mx-auto px-6">
        <TiltCard>
          <SpotlightCard className="p-8 sm:p-14 border-[#007FFF]/30">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#007FFF]/10 text-[#007FFF] text-xs font-mono font-bold mb-3 border border-[#007FFF]/30">
                <DollarSign className="w-3.5 h-3.5" />
                <span>MERCHANT REVENUE SIMULATOR</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Keep 100% of Every Single Rupee.
              </h2>
              <p className="mt-3 text-slate-400 text-sm">
                Calculate how much your business loses each month to standard 28% food and delivery commissions:
              </p>
            </div>

            {/* Slider */}
            <div className="mt-12 max-w-xl mx-auto">
              <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-3">
                <span>ESTIMATED MONTHLY DELIVERY SALES:</span>
                <span className="text-2xl font-black text-[#007FFF]">₹{monthlySales.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="30000"
                max="1200000"
                step="20000"
                value={monthlySales}
                onChange={(e) => setMonthlySales(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#007FFF]"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                <span>₹30,000 / mo</span>
                <span>₹6,00,000 / mo</span>
                <span>₹12,00,000 / mo</span>
              </div>
            </div>

            {/* Comparison Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 text-center">
                <div className="text-[11px] font-mono uppercase text-red-400 font-semibold tracking-wider">
                  Lost to 28% Aggregator Commission
                </div>
                <div className="text-3xl sm:text-4xl font-black text-red-400 mt-3">
                  - ₹{aggregatorFee.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-slate-500 mt-1">Paid out every month to middlemen</div>
              </div>

              <div className="p-6 rounded-2xl bg-[#007FFF]/10 border border-[#007FFF]/50 text-center shadow-xl shadow-[#007FFF]/10">
                <div className="text-[11px] font-mono uppercase text-[#80bfff] font-semibold tracking-wider">
                  Retained With Townly (0% Commission)
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mt-3">
                  + ₹{aggregatorFee.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-[#80bfff] font-bold mt-1">
                  ₹{annualSavings.toLocaleString('en-IN')} annual profit back in your pocket
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <motion.a
                href="mailto:partner@thetownly.in?subject=Townly%20Merchant%20Partnership"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-[#007FFF] hover:bg-[#0066d6] shadow-xl shadow-[#007FFF]/30 text-sm"
              >
                <span>Partner Your Store for 0% Commission</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </SpotlightCard>
        </TiltCard>
      </section>

      {/* ─── APP DOWNLOAD SECTION ─── */}
      <section id="app" className="relative z-10 py-20 max-w-5xl mx-auto px-6 border-t border-white/[0.08]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#007FFF]/10 text-[#007FFF] text-xs font-mono font-bold mb-3 border border-[#007FFF]/30">
              <Smartphone className="w-3.5 h-3.5" />
              <span>MOBILE DISPATCH GATEWAY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Carry your town wherever you go.
            </h2>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Real-time town radar, direct WhatsApp & audio calling with shopkeepers, zero-convenience fee orders, and live delivery updates.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#" className="px-6 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-[#007FFF] flex items-center gap-3 text-xs transition-all">
                <Smartphone className="w-6 h-6 text-[#007FFF]" />
                <div className="text-left font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">Available on</div>
                  <div className="font-bold text-white">Android APK</div>
                </div>
              </a>

              <a href="#" className="px-6 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-[#007FFF] flex items-center gap-3 text-xs transition-all">
                <Globe className="w-6 h-6 text-[#80bfff]" />
                <div className="text-left font-mono">
                  <div className="text-[10px] text-slate-400 uppercase">Instant Access</div>
                  <div className="font-bold text-white">Launch Web App</div>
                </div>
              </a>
            </div>
          </div>

          <div className="flex justify-center">
            <TiltCard>
              <div className="relative w-64 h-[440px] rounded-[38px] border-4 border-slate-700 bg-[#060C1B] p-4 shadow-2xl shadow-[#007FFF]/20 flex flex-col justify-between overflow-hidden">
                <div className="w-20 h-3.5 bg-slate-800 rounded-full mx-auto" />

                <div className="space-y-3 flex-1 overflow-hidden pt-4 text-xs">
                  <div className="p-3 rounded-xl bg-[#007FFF]/10 border border-[#007FFF]/30 font-mono">
                    <div className="text-[10px] text-[#007FFF]">LIVE TOWN RADAR</div>
                    <div className="font-bold text-white mt-0.5">84 Stores Open Nearby</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>RUNNER EN ROUTE</span>
                      <span className="text-emerald-400 font-bold">12m ETA</span>
                    </div>
                    <div className="font-bold text-white">Daily Farm-Fresh Milk & Bread</div>
                    <div className="text-[10px] text-slate-500">Zero surcharge applied</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] font-mono space-y-1">
                    <div className="text-[10px] text-[#007FFF]">COMMISSION SAVED</div>
                    <div className="text-white font-bold">₹110 on Direct Order</div>
                  </div>
                </div>

                <div className="w-16 h-1 bg-slate-700 rounded-full mx-auto" />
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-white/[0.08] bg-[#02050E] py-12 font-mono text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <TownlyPlanetLogo className="w-8 h-8" />
            <div>
              <div className="text-white font-bold tracking-wider">TOWNLY</div>
              <div className="text-[10px] text-[#007FFF]">thetownly.in &bull; HYPERLOCAL COMMUNITY COMMERCE</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="mailto:support@thetownly.in" className="hover:text-[#007FFF] transition-colors">support@thetownly.in</a>
            <a href="/robots.txt" className="hover:text-[#007FFF] transition-colors">robots.txt</a>
            <a href="/sitemap.xml" className="hover:text-[#007FFF] transition-colors">sitemap.xml</a>
          </div>

          <div className="text-slate-600 text-[11px]">
            &copy; {new Date().getFullYear()} Townly. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
