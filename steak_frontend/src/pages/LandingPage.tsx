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
    <div className="min-h-screen bg-grass-bg text-black font-sans selection:bg-grass-primary selection:text-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-4 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-grass-primary border-2 border-black rounded-none flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Beef className="text-black w-8 h-8" />
          </div>
          <span className="text-3xl font-black tracking-tight uppercase">STEAK</span>
        </div>
        <Link
          to="/app"
          className="px-8 py-3 bg-grass-primary text-black border-2 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
        >
          Launch App
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-8 pt-32 pb-48 max-w-7xl mx-auto text-center relative overflow-hidden">
        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="relative z-10"
        >
          <motion.div
            variants={fadeIn}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white border-2 border-black mb-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <span className="w-3 h-3 bg-grass-primary border border-black animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest">
              Devnet is Live 🐐🛠️
            </span>
          </motion.div>

          <motion.h1
            variants={fadeIn}
            className="text-8xl md:text-[160px] font-black tracking-tighter leading-[0.8] mb-12 uppercase text-black"
          >
            Investasi <br />
            <span className="bg-grass-primary border-4 border-black px-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              Masa Depan
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-2xl text-black max-w-3xl mx-auto mb-16 leading-tight font-black uppercase tracking-tight"
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
              className="group px-16 py-8 bg-grass-primary text-black text-2xl font-black border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase flex items-center gap-4"
            >
              Mulai Earn
              <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="px-16 py-8 bg-white text-black text-2xl font-black border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all uppercase">
              Prospektus
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="px-8 py-32 bg-white border-y-4 border-black">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-16">
          {[
            { label: 'Total Value Staked', value: 'Rp 12.4M+' },
            { label: 'Active Livestock', value: '45,000+' },
            { label: 'Yield Paid', value: 'Rp 2.1M+' },
            { label: 'Safety Rating', value: 'AA+' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center bg-grass-bg border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <p className="text-grass-subtext text-xs font-black uppercase tracking-widest mb-4">
                {stat.label}
              </p>
              <h3 className="text-4xl font-black text-black uppercase tracking-tighter">
                {stat.value}
              </h3>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-40 max-w-7xl mx-auto">
        <div className="text-center mb-32">
          <h2 className="text-7xl md:text-9xl font-black mb-8 text-black uppercase tracking-tighter leading-none">
            Keuntungan <br />
            <span className="text-grass-primary">Steak Earn</span>
          </h2>
          <p className="text-black text-2xl max-w-3xl mx-auto font-black uppercase tracking-tight">
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
              className="p-12 bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[18px_18px_0px_0px_rgba(0,0,0,1)] transition-all group"
            >
              <div
                className={`w-20 h-20 border-2 border-black flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform ${feature.color}`}
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
            <div className="w-16 h-16 bg-black border-2 border-grass-primary flex items-center justify-center">
              <Beef className="text-grass-primary w-10 h-10" />
            </div>
            <span className="text-4xl font-black tracking-tight uppercase">STEAK</span>
          </div>
          <p className="text-black text-lg font-black uppercase tracking-tight max-w-md text-center md:text-left leading-none">
            Membangun masa depan keuangan agrikultur yang terdesentralisasi. 🐐🌱🐄
          </p>
          <div className="flex gap-10">
            <Globe
              className="text-black hover:text-grass-primary cursor-pointer transition-colors"
              size={32}
            />
            <Zap
              className="text-black hover:text-grass-primary cursor-pointer transition-colors"
              size={32}
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
