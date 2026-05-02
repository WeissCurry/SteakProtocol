import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Beef, ArrowRight, Shield, TrendingUp, Zap, Globe } from 'lucide-react';

const LandingPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-amber-500/30 selection:text-amber-500">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Beef className="text-zinc-950 w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">STEAK</span>
        </div>
        <Link
          to="/app"
          className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all border border-zinc-700"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-20 pb-32 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Decorative Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse" />
        </div>

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10"
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Mainnet is Live
            </span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6"
          >
            STAKE YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-400">
              ANIMAL ASSETS
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The first Solana-powered protocol for <b>Real World Animal</b> (RWA) livestock
            fattening. Bridge digital liquidity to physical agricultural commerce with 50/50 profit
            sharing.
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/app"
              className="group px-10 py-5 bg-amber-500 text-zinc-950 text-xl font-black rounded-2xl flex items-center gap-3 hover:bg-amber-600 transition-all transform active:scale-95 shadow-xl shadow-amber-500/20"
            >
              Start Staking IDRX
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-zinc-900 text-white text-xl font-bold rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all">
              Read Litepaper
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-8 py-20 bg-zinc-900/30 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Total Value Locked', value: '$12.4M+' },
            { label: 'Active Livestock', value: '45,000+' },
            { label: 'Real Yield Paid', value: '$2.1M+' },
            { label: 'Security Score', value: '98/100' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">
                {stat.label}
              </p>
              <h3 className="text-3xl md:text-4xl font-black text-white">{stat.value}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Why Steak Protocol?</h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
            Traditional agricultural yields, accelerated by Solana's high-speed infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Real Yield',
              desc: 'Earnings come from physical commerce, not token emissions or inflation.',
              icon: TrendingUp,
              color: 'text-emerald-400',
            },
            {
              title: 'Solana Speed',
              desc: 'Instant settlement and fractional ownership of livestock assets.',
              icon: Zap,
              color: 'text-amber-400',
            },
            {
              title: 'Fully Insured',
              desc: 'Our livestock assets are 100% insured against disease and natural loss.',
              icon: Shield,
              color: 'text-blue-400',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-colors group"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${feature.color}`}
              >
                <feature.icon size={32} />
              </div>
              <h4 className="text-2xl font-bold mb-4">{feature.title}</h4>
              <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-20 border-t border-zinc-900 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3">
          <Beef className="text-amber-500 w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">STEAK</span>
        </div>
        <p className="text-zinc-600 text-sm italic">
          Built for the future of decentralized agricultural finance.
        </p>
        <div className="flex gap-6">
          <Globe className="text-zinc-400 hover:text-white cursor-pointer transition-colors" />
          <Zap className="text-zinc-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
