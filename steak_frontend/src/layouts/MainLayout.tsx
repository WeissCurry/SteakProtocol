import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { Sidebar, Header } from '../components/Dashboard';

interface MainLayoutProps {
  children: ReactNode;
}

const GoatBackground = () => {
  const [goats] = useState(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 10,
      rotateDir: Math.random() > 0.5 ? 1 : -1,
      size: 40 + Math.random() * 40,
    })),
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.03]">
      {goats.map((goat) => (
        <motion.img
          key={goat.id}
          src="/Kambing.png"
          className="absolute"
          style={{ width: goat.size, height: goat.size }}
          initial={{ top: -150, left: goat.left, rotate: 0 }}
          animate={{ top: '120%', rotate: 360 * goat.rotateDir }}
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

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen w-screen bg-grass-bg text-black flex overflow-hidden font-sans selection:bg-grass-primary selection:text-black grid-bg relative">
      <GoatBackground />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
