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
  Navigation, 
  Radar, 
  Zap, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  Store, 
  ShoppingBag, 
  Coffee, 
  Wrench, 
  Pill, 
  Laptop, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Activity, 
  TrendingUp, 
  ExternalLink,
  MessageSquare,
  Globe,
  Compass,
  DollarSign
} from 'lucide-react';

export default function App() {
  // Mouse position for aura
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Active Category filter state
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Interactive Merchant Savings Calculator
  const [monthlySales, setMonthlySales] = useState(150000);
  const legacyCommissionFee = Math.round(monthlySales * 0.28);
  const townlyRetainedEarnings = legacyCommissionFee;

  // Real-time Simulated Live Stream
  const [liveEvents, setLiveEvents] = useState([
    { id: 1, text: 'Order dispatched: Fresh Sourdough @ Old Town Bakery', time: '2s ago', dist: '0.8 km' },
    { id: 2, text: 'Direct Inquiry: Electrician assigned in Downtown Block 4', time: '11s ago', dist: '1.4 km' },
    { id: 3, text: 'Verified Store: Artisan Leathercraft joined the grid', time: '28s ago', dist: '2.1 km' },
  ]);

  useEffect(() => {
    const stream = [
      { text: 'Instant Settlement: ₹1,240 cleared for Green Grocers', dist: '0.4 km' },
      { text: 'Order dispatched: Specialty Cold Brew @ Corner Cafe', dist: '1.1 km' },
      { text: 'Service Booked: AC Deep Clean verified with Resident', dist: '1.9 km' },
      { text: 'Zero Markup: Saved ₹280 on direct Pharmacy pickup', dist: '0.6 km' },
      { text: 'New Merchant: Apex Hardware plugged into Townly Grid', dist: '2.8 km' },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const nextItem = stream[idx % stream.length];
      setLiveEvents(prev => [
        { id: Date.now(), text: nextItem.text, time: 'Just now', dist: nextItem.dist },
        ...prev.slice(0, 3)
      ]);
      idx++;
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Radar Blips state
  const [activeBlip, setActiveBlip] = useState(null);

  const blips = [
    { id: 'b1', name: 'Artisan Bakery', x: '35%', y: '40%', cat: 'Food', rating: '4.9 ★', dist: '400m' },
    { id: 'b2', name: 'Apex Pharmacy', x: '68%', y: '30%', cat: 'Health', rating: '4.8 ★', dist: '650m' },
    { id: 'b3', name: 'Smart Electronics', x: '55%', y: '65%', cat: 'Tech', rating: '4.9 ★', dist: '850m' },
    { id: 'b4', name: 'Urban Threads', x: '25%', y: '70%', cat: 'Fashion', rating: '4.7 ★', dist: '500m' },
    { id: 'b5', name: 'Pro Plumbing Care', x: '75%', y: '75%', cat: 'Services', rating: '5.0 ★', dist: '1.2km' },
  ];

  const categories = [
    { id: 'all', label: 'All Sectors', icon: Globe },
    { id: 'groceries', label: 'Groceries & Foods', icon: ShoppingBag },
    { id: 'services', label: 'Home & Auto Services', icon: Wrench },
    { id: 'dining', label: 'Cafes & Dining', icon: Coffee },
    { id: 'health', label: 'Pharmacies', icon: Pill },
    { id: 'tech', label: 'Electronics', icon: Laptop },
  ];

  const showcaseItems = [
    {
      id: 1,
      cat: 'groceries',
      name: 'Old Town Organic Greens',
      desc: 'Farm-fresh hydroponic veggies & seasonal harvest from local growers.',
      tag: '0% Markup',
      rating: '4.95',
      time: '18 min delivery',
      accent: 'from-emerald-500/20 to-teal-500/10'
    },
    {
      id: 2,
      cat: 'services',
      name: 'VoltCraft Precision Electrical',
      desc: 'Master certified home wiring, EV charger setup & smart metering.',
      tag: 'Direct Chat',
      rating: '4.98',
      time: 'Available today',
      accent: 'from-amber-500/20 to-orange-500/10'
    },
    {
      id: 3,
      cat: 'dining',
      name: 'The Foundry Espresso Bar',
      desc: 'Micro-lot single origin roasts & hand-kneaded sourdough bagels.',
      tag: 'Store Price',
      rating: '4.91',
      time: '12 min pickup',
      accent: 'from-blue-500/20 to-indigo-500/10'
    },
    {
      id: 4,
      cat: 'tech',
      name: 'NovaTech Component Hub',
      desc: 'High-speed NVMe storage, custom cabling, microcontrollers & repair.',
      tag: 'Local Warranty',
      rating: '4.89',
      time: 'Same-day drop',
      accent: 'from-cyan-500/20 to-blue-500/10'
    },
    {
      id: 5,
      cat: 'health',
      name: 'CityCare 24/7 Wellness Pharmacy',
      desc: 'Prescription refills, diagnostics kits & verified genuine pharmaceuticals.',
      tag: 'Direct Dispense',
      rating: '4.97',
      time: '15 min dispatch',
      accent: 'from-rose-500/20 to-pink-500/10'
    },
    {
      id: 6,
      cat: 'groceries',
      name: 'Artisan Sourdough & Patisserie',
      desc: 'Slow fermented sourdough loaves, flaky croissants & French pastries.',
      tag: 'Fresh Daily',
      rating: '5.0',
      time: 'Morning batch',
      accent: 'from-purple-500/20 to-indigo-500/10'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? showcaseItems 
    : showcaseItems.filter(item => item.cat === selectedCategory);

  return (
    <div className="relative min-h-screen bg-[#06080F] text-slate-100 overflow-x-hidden tech-grid selection:bg-cyan-400 selection:text-black">
      
      {/* Dynamic Cursor Light Aura */}
      <motion.div 
        className="pointer-events-none fixed -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-cyan-500/15 via-blue-600/15 to-purple-600/15 blur-3xl z-30"
        style={{ x: springX, y: springY }}
      />

      {/* Cyberpunk ambient top lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Futuristic Floating Header */}
      <motion.header 
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-4 z-50 max-w-6xl mx-auto px-4"
      >
        <div className="glass-panel-glow rounded-2xl px-6 py-3.5 flex items-center justify-between border border-white/10 shadow-2xl backdrop-blur-xl">
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '24s' }} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">
                Townly
              </span>
              <span className="text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase">thetownly.in</span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
            <a href="#radar" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Radar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Radar</span>
            </a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">Protocol</a>
            <a href="#network" className="hover:text-cyan-400 transition-colors">Categories</a>
            <a href="#calculator" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Merchant ROI</span>
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <motion.a 
              href="#app" 
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-cyan-500/25 border border-cyan-400/40"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Get App</span>
            </motion.a>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Live System Beacon */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 text-xs font-mono text-cyan-300 shadow-lg shadow-cyan-500/10 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span>HYPERLOCAL DECENTRALIZED COMMERCE // INDIA</span>
          </motion.div>

          {/* Glitch / Tech Headline */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08]"
          >
            Autonomous Local Commerce. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Zero Commissions. Instant Town Pulse.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Townly unlocks high-speed neighborhood discovery, real-time merchant peer-to-peer ordering, and local logistics—without the 30% predatory middleman tax.
          </motion.p>

          {/* Action CTAs */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.a 
              href="#radar"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-black bg-gradient-to-r from-cyan-400 to-teal-300 hover:from-cyan-300 hover:to-teal-200 shadow-xl shadow-cyan-400/20 transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              <Compass className="w-4 h-4 text-black" />
              <span>Explore Live Town Radar</span>
              <ArrowRight className="w-4 h-4" />
            </motion.a>

            <motion.a 
              href="#calculator"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-200 bg-slate-900/90 border border-slate-700 hover:border-cyan-500/50 hover:text-white transition-all flex items-center justify-center gap-2.5 text-sm"
            >
              <Store className="w-4 h-4 text-cyan-400" />
              <span>Merchant 0% Calculator</span>
            </motion.a>
          </motion.div>

          {/* Live Telemetry Ticker */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 glass-panel rounded-xl p-3 max-w-xl mx-auto border border-white/5 flex items-center justify-between text-xs font-mono text-slate-400"
          >
            <div className="flex items-center gap-2 text-cyan-400">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="font-bold">LIVE FEED:</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap text-slate-300 truncate max-w-xs sm:max-w-md">
              <AnimatePresence mode="wait">
                <motion.span 
                  key={liveEvents[0].id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="inline-block"
                >
                  {liveEvents[0].text} ({liveEvents[0].dist})
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">LIVE</span>
          </motion.div>
        </div>

        {/* Live Cyber Radar Simulation Section */}
        <div id="radar" className="mt-20 max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-6 sm:p-10 glass-panel-glow border border-cyan-500/20 overflow-hidden">
            
            {/* Background scanner line */}
            <div className="absolute inset-0 pointer-events-none opacity-30 tech-grid-dense" />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              
              {/* Radar Console Info */}
              <div className="max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold mb-3 border border-cyan-500/20">
                  <Radar className="w-3.5 h-3.5" />
                  <span>GEOLOCAL SCANNER // 2.5 KM RADIUS</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Real-time Node Detection.
                </h3>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                  Hover over active town blips on the radar to inspect verified merchants, live order slots, and direct communication channels.
                </p>

                {/* Blip Info Card (if selected) */}
                <div className="mt-6 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 font-mono text-xs">
                  {activeBlip ? (
                    <div>
                      <div className="flex justify-between items-center text-cyan-400 font-bold text-sm">
                        <span>{activeBlip.name}</span>
                        <span className="text-emerald-400">{activeBlip.dist}</span>
                      </div>
                      <div className="mt-2 text-slate-400 flex items-center justify-between">
                        <span>Sector: {activeBlip.cat}</span>
                        <span className="text-yellow-400">{activeBlip.rating}</span>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-emerald-400 text-[10px]">● READY FOR DISPATCH</span>
                        <a href="#app" className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]">
                          Connect Direct &rarr;
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic flex items-center gap-2">
                      <Compass className="w-4 h-4 animate-spin text-cyan-500/50" />
                      <span>Hover any pulse node on the radar grid to lock target...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* The Visual Radar Display */}
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full border border-cyan-500/30 flex items-center justify-center bg-slate-950/80 shadow-2xl shadow-cyan-500/10">
                {/* Concentric rings */}
                <div className="absolute w-3/4 h-3/4 rounded-full border border-cyan-500/20" />
                <div className="absolute w-1/2 h-1/2 rounded-full border border-cyan-500/20" />
                <div className="absolute w-1/4 h-1/4 rounded-full border border-cyan-500/30" />
                
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-cyan-500/20" />
                <div className="absolute h-full w-[1px] bg-cyan-500/20" />

                {/* Rotating Scanner Needle */}
                <div className="absolute inset-0 animate-radar origin-center pointer-events-none">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/30 via-cyan-500/5 to-transparent rounded-tl-full" />
                </div>

                {/* Center user dot */}
                <div className="w-4 h-4 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 z-20 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                </div>

                {/* Interactive Blips */}
                {blips.map((blip) => (
                  <motion.div
                    key={blip.id}
                    onMouseEnter={() => setActiveBlip(blip)}
                    whileHover={{ scale: 1.5 }}
                    style={{ top: blip.y, left: blip.x }}
                    className="absolute cursor-pointer z-30"
                  >
                    <div className="relative">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border border-white"></span>
                    </div>
                  </motion.div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* High-Tech Pillars / Architecture Protocol */}
      <section id="features" className="py-24 border-t border-white/5 bg-slate-950/60 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="text-xs font-mono font-bold text-cyan-400 tracking-widest uppercase">Protocol Specs</div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Engineered to bypass platform lock-in.
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Traditional food & delivery aggregators extract up to 35% fees and own customer data. Townly re-architects local transactions.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 transition-all relative group"
            >
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Direct Peer Settlement</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Money flows directly from customer to store owner. No 7-day escrow holdbacks, no hidden commission deductions, zero surprise penalties.
              </p>
              <div className="mt-6 text-xs font-mono text-cyan-400 flex items-center gap-1">
                <span>// 0% RETAINED COMMISSIONS</span>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/40 transition-all relative group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Decentralized Neighborhood Fleet</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Empower your town's trusted delivery riders. Dynamic route matching assigns hyperlocal runners for lightning sub-25-minute drops.
              </p>
              <div className="mt-6 text-xs font-mono text-purple-400 flex items-center gap-1">
                <span>// HYPERLOCAL LATENCY &lt; 25m</span>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -6 }}
              className="p-8 rounded-2xl glass-panel border border-white/10 hover:border-emerald-500/40 transition-all relative group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">AI Multi-Language Sync</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Automatic real-time translation across local Indian languages (Telugu, Hindi, Kannada, Tamil) so merchants can list seamlessly via voice or text.
              </p>
              <div className="mt-6 text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span>// MULTI-LINGUAL AI READY</span>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Interactive Category Filter Grid */}
      <section id="network" className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">Network Grid</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Active Town Sectors</h2>
          </div>

          {/* Filter Pills with layoutId spring */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                    isSelected ? 'text-black' : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-300 rounded-xl"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sector Cards */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                      {item.tag}
                    </span>
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      ★ {item.rating}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </h4>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {item.time}
                  </span>
                  <a href="#app" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold">
                    <span>Order</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Interactive Merchant ROI Calculator */}
      <section id="calculator" className="py-24 border-t border-white/5 bg-gradient-to-b from-[#0a0f1e]/80 to-[#06080f]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl p-8 sm:p-12 glass-panel-glow border border-emerald-500/30">
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
                <DollarSign className="w-3.5 h-3.5" />
                <span>MERCHANT REVENUE SIMULATOR</span>
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">
                See How Much Profit Townly Keeps in Your Pocket.
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Legacy delivery aggregators take 25%–35% of every single sale. Slide to calculate how much you retain with Townly:
              </p>
            </div>

            {/* Range Slider */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="flex justify-between items-center text-sm font-mono text-slate-300 mb-2">
                <span>Estimated Monthly Online Orders:</span>
                <span className="text-cyan-400 font-bold text-base">₹{monthlySales.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range"
                min="20000"
                max="1000000"
                step="10000"
                value={monthlySales}
                onChange={(e) => setMonthlySales(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2">
                <span>₹20,000 / mo</span>
                <span>₹5,00,000 / mo</span>
                <span>₹10,00,000 / mo</span>
              </div>
            </div>

            {/* Comparison Metrics Output */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-center">
                <div className="text-xs font-mono text-rose-400 uppercase tracking-wider font-semibold">
                  Lost to 28% Aggregator Commission
                </div>
                <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-rose-400">
                  - ₹{legacyCommissionFee.toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs text-slate-400">Paid out to middlemen every month</div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center shadow-xl shadow-emerald-500/10">
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  Saved with Townly (0% Commission)
                </div>
                <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-emerald-300">
                  + ₹{townlyRetainedEarnings.toLocaleString('en-IN')}
                </div>
                <div className="mt-2 text-xs text-emerald-400/80 font-bold">100% Retained in your bank account</div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <motion.a 
                href="mailto:partner@thetownly.in?subject=Townly%20Merchant%20Onboarding" 
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-emerald-400 to-teal-300 shadow-xl shadow-emerald-500/20"
              >
                <span>Claim Your Free Digital Storefront</span>
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* App Terminal & Mobile Download */}
      <section id="app" className="py-24 max-w-7xl mx-auto px-6 border-t border-white/5">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">Mobile Gateway</div>
            <h2 className="mt-3 text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Carry your whole town in your pocket.
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Available now for Android and iOS. Instant real-time order tracking, live audio and direct chat with local shopkeepers, and exclusive neighborhood flash deals.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <strong className="text-white">Smart Radar Navigation</strong> — Discover open pharmacies, electricians, and organic grocers within walking distance.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300">
                  <strong className="text-white">Instant UPI Settlement</strong> — Pay merchants directly using Google Pay, PhonePe, or Paytm with zero hidden convenience fees.
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#" className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 flex items-center gap-3 transition-all">
                <Smartphone className="w-6 h-6 text-cyan-400" />
                <div className="text-left">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Download for</div>
                  <div className="text-sm font-bold text-white">Android APK</div>
                </div>
              </a>

              <a href="#" className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 flex items-center gap-3 transition-all">
                <Globe className="w-6 h-6 text-purple-400" />
                <div className="text-left">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Launch directly in</div>
                  <div className="text-sm font-bold text-white">Web App (PWA)</div>
                </div>
              </a>
            </div>
          </div>

          {/* Interactive Cyber Mockup Graphic */}
          <div className="w-full lg:w-96 flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.02, rotateY: 5 }}
              className="relative w-72 h-[480px] rounded-[36px] bg-slate-950 border-4 border-slate-800 shadow-2xl shadow-cyan-500/20 p-4 flex flex-col justify-between overflow-hidden"
            >
              {/* Phone top notch */}
              <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-950" />
              </div>

              {/* Mockup screen content */}
              <div className="space-y-3 flex-1 overflow-hidden">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-900/60 to-cyan-900/40 border border-cyan-500/30 text-xs">
                  <div className="text-[10px] text-cyan-400 font-mono">NEIGHBORHOOD RADAR</div>
                  <div className="font-bold text-white mt-1">Old Town Market &bull; 84 Stores Open</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>DISPATCH ACTIVE</span>
                    <span className="text-emerald-400 font-bold">12m ETA</span>
                  </div>
                  <div className="font-semibold text-white">Sourdough Loaf + Cold Brew</div>
                  <div className="text-[10px] text-slate-500">Runner: Zaid K. (0.4 km away)</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>COMMISSION SAVED</span>
                    <span className="text-cyan-400 font-bold">₹110</span>
                  </div>
                  <div className="font-semibold text-white">Direct Merchant Price</div>
                  <div className="text-[10px] text-slate-500">Zero surcharge applied</div>
                </div>
              </div>

              {/* Phone bottom bar */}
              <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-3" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cyber Footer */}
      <footer className="border-t border-white/10 bg-slate-950 py-14 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
              T
            </div>
            <div>
              <div className="text-white font-bold tracking-wide">TOWNLY COMMERCE GRID</div>
              <div className="text-[10px] text-slate-400">thetownly.in &bull; SYSTEM VERSION 3.8.4</div>
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
