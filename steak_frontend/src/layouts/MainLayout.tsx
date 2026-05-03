import { ReactNode } from 'react';
import { Sidebar, Header } from '../components/Dashboard';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen w-screen bg-grass-bg text-black flex overflow-hidden font-sans selection:bg-grass-primary selection:text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};
