import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, TrendingUp, Zap } from 'lucide-react';

const GoatRain = () => {
  const [goats] = useState(() =>
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 10,
      rotateDir: Math.random() > 0.5 ? 1 : -1,
    })),
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {goats.map((goat) => (
        <motion.img
          key={goat.id}
          src="/Kambing.png"
          className="absolute w-16 h-16 md:w-24 md:h-24 opacity-10"
          initial={{
            top: -150,
            left: goat.left,
            rotate: 0,
          }}
          animate={{
            top: '120%',
            rotate: 360 * goat.rotateDir,
          }}
          transition={{
            duration: goat.duration,
            repeat: Infinity,
            ease: 'linear',
            delay: goat.delay,
          }}
        />
      ))}
    </div>
  );
};

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
    <div className="min-h-screen bg-grass-bg text-black font-sans selection:bg-grass-primary selection:text-black grid-bg relative overflow-hidden">
      <GoatRain />
      {/* Navigation */}
      <div className="sticky top-4 z-50 px-4">
        <nav className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto bg-white/90 backdrop-blur-md border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-3xl">
          <div className="flex items-center gap-3">
            <img
              src="/SteakProtocolLogo.png"
              alt="Steak Protocol Logo"
              className="h-12 w-auto object-contain"
            />
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
      <section className="px-8 pt-8 pb-48 max-w-7xl mx-auto text-center relative z-10 overflow-hidden">
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

          <motion.img
            src="/SteakProtocolMascot.png"
            alt="Steak Protocol Mascot"
            className="w-full max-w-[300px] md:max-w-[500px] h-auto mx-auto mb-12 drop-shadow-[20px_20px_0px_rgba(0,0,0,0.1)]"
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 0.3,
            }}
          />

          <motion.h1
            variants={fadeIn}
            className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 uppercase text-black"
          >
            Future <br />
            <span className="bg-grass-primary border-4 border-black px-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl">
              Investment
            </span>
          </motion.h1>

          <motion.p
            variants={fadeIn}
            className="text-lg text-black max-w-2xl mx-auto mb-12 leading-tight font-black uppercase tracking-tight"
          >
            The first RWA protocol on Solana for livestock assets. Get stable yields with
            verified physical assets. 🌿🐄🐐
          </motion.p>

          <motion.div
            variants={fadeIn}
            className="flex flex-col md:flex-row items-center justify-center gap-8"
          >
            <Link
              to="/app"
              className="group px-10 py-5 bg-grass-primary text-black text-xl font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase flex items-center gap-4"
            >
              Start Earning
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <button className="px-10 py-5 bg-white text-black text-xl font-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-2xl hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all uppercase">
              Prospectus
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
      <section className="px-8 py-40 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black mb-6 text-black uppercase tracking-tighter leading-none">
            Steak Earn <br />
            <span className="text-grass-primary">Benefits</span>
          </h2>
          <p className="text-black text-lg max-w-2xl mx-auto font-black uppercase tracking-tight">
            Traditional stability meets fast Solana infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: 'Fixed Rate Yield',
              desc: 'Guaranteed yields paid directly to your wallet in IDRX.',
              icon: TrendingUp,
              color: 'bg-emerald-400',
            },
            {
              title: 'Real Physical Assets',
              desc: 'Every staking series is backed by insured physical livestock.',
              icon: Zap,
              color: 'bg-grass-primary',
            },
            {
              title: 'NFT Certificate',
              desc: 'Receive digital proof of ownership in the form of transparent NFTs.',
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
              <p className="text-black font-black uppercase text-sm leading-snug mb-8">
                {feature.desc}
              </p>
              {feature.title === 'Sertifikat NFT' && (
                <div className="relative mt-4 group/nft overflow-hidden rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <img
                    src="/Mock-NFT.png"
                    alt="NFT Example"
                    className="w-full h-auto grayscale group-hover/nft:grayscale-0 transition-all duration-500 scale-110 group-hover/nft:scale-100"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/nft:opacity-100 transition-opacity">
                    <span className="bg-white text-black text-[10px] font-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase">
                      Preview Certificate
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-32 border-t-4 border-black bg-white relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex items-center gap-4">
            <img src="/SteakProtocolLogo.png" alt="Steak Protocol Logo" className="h-14 w-auto" />
          </div>
          <p className="text-black text-lg font-black uppercase tracking-tight max-w-md text-center md:text-left leading-none">
            Building a decentralized future for agricultural finance. 🐐🌱🐄
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
