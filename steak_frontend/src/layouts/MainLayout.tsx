import { ReactNode } from 'react';
import { Sidebar, Header } from '../components/Dashboard';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen w-screen bg-zinc-950 text-white flex overflow-hidden font-sans selection:bg-amber-500/30 selection:text-amber-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
