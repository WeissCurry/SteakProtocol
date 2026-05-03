import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Beef, ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-grass-bg text-black font-sans selection:bg-grass-primary selection:text-black grid-bg">
      {/* Navigation */}
      <div className="sticky top-4 z-50 px-4">
        <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto bg-white/90 backdrop-blur-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-grass-primary border-2 border-black rounded-xl flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Beef className="text-black w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight uppercase">STEAK</span>
          </div>
          <Link
            to="/app"
            className="px-6 py-2 bg-grass-primary text-black border-2 border-black font-black uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-xl hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            Launch App
          </Link>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="px-8 pt-48 pb-48 max-w-7xl mx-auto text-center relative overflow-hidden">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10"
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white border-2 border-black mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-full"
          >
            <span className="w-3 h-3 bg-grass-primary border border-black animate-ping rounded-full" />
            <span className="text-xs font-black uppercase tracking-widest">
              Devnet is Live 🐐🛠️
            </span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase text-black"
          >
            Investasi <br />
            <span className="bg-grass-primary border-4 border-black px-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
              Masa Depan
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg text-black max-w-2xl mx-auto mb-12 leading-tight font-black uppercase tracking-tight"
          >
            Protokol RWA pertama di Solana untuk aset peternakan. Dapatkan imbal hasil stabil dengan
            aset fisik terverifikasi. 🌿🐄🐐
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col md:flex-row items-center justify-center gap-8"
          >
            <Link
              to="/app"
              className="group px-10 py-5 bg-grass-primary text-black text-xl font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase flex items-center gap-4"
            >
              Mulai Earn
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-white text-black text-xl font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all uppercase">
              Prospektus
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section - Infinite Carousel (Floating Cards) */}
      <section className="py-20 my-10 overflow-hidden flex whitespace-nowrap relative z-20">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-10 pr-10"
        >
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="flex gap-10">
              {[
                { label: 'Total Value Staked', value: 'Rp 12.4M+' },
                { label: 'Active Livestock', value: '45,000+' },
                { label: 'Yield Paid', value: 'Rp 2.1M+' },
                { label: 'Safety Rating', value: 'AA+' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-left bg-white border-2 border-black p-6 min-w-[220px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center rounded-3xl hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <p className="text-grass-subtext text-[10px] font-black uppercase tracking-widest mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-xl font-black text-black uppercase tracking-tighter">
                    {stat.value}
                  </h3>
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-40 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-black uppercase tracking-tighter leading-none">
            Keuntungan <br />
            <span className="text-grass-primary">Steak Earn</span>
          </h2>
          <p className="text-black text-lg max-w-2xl mx-auto font-black uppercase tracking-tight">
            Stabilitas tradisional bertemu dengan infrastruktur Solana yang cepat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: 'Fixed Rate Yield',
              desc: 'Imbal hasil yang pasti dan dibayarkan langsung ke wallet Anda dalam IDRX.',
              icon: TrendingUp,
              color: 'bg-emerald-400',
            },
            {
              title: 'Aset Fisik Nyata',
              desc: 'Setiap seri staking didukung oleh hewan ternak fisik yang berasuransi.',
              icon: Zap,
              color: 'bg-grass-primary',
            },
            {
              title: 'Sertifikat NFT',
              desc: 'Terima bukti kepemilikan digital dalam bentuk NFT yang transparan.',
              icon: Shield,
              color: 'bg-blue-400',
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-12 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-[40px] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] transition-all group"
            >
              <div
                className={`w-20 h-20 border-2 border-black flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform ${feature.color} rounded-2xl`}
              >
                <feature.icon size={40} className="text-black" />
              </div>
              <h4 className="text-3xl font-black mb-6 text-black uppercase tracking-tighter">
                {feature.title}
              </h4>
              <p className="text-black font-black uppercase text-sm leading-snug">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-32 border-t-4 border-black bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-black border-2 border-grass-primary flex items-center justify-center rounded-2xl">
              <Beef className="text-grass-primary w-10 h-10" />
            </div>
            <span className="text-4xl font-black tracking-tight uppercase">STEAK</span>
          </div>
          <p className="text-black text-lg font-black uppercase tracking-tight max-w-md text-center md:text-left leading-none">
            Membangun masa depan keuangan agrikultur yang terdesentralisasi. 🐐🌱🐄
          </p>
          <div className="flex gap-10">
            <a
              href="https://github.com/WeissCurry/SteakProtocol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-grass-primary hover:rotate-12 transition-all"
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
