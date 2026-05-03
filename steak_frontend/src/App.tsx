import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider';
import { MainLayout } from './layouts/MainLayout';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const EarnPage = lazy(() => import('./pages/VaultsPage'));
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  return (
    <AppProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* App Dashboard Routes */}
          <Route
            path="/app/*"
            element={
              <MainLayout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route index element={<Navigate to="earn" replace />} />
                    <Route path="earn" element={<EarnPage />} />
                    <Route path="portfolio" element={<PortfolioPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    {/* Fallback for /app/* */}
                    <Route path="*" element={<Navigate to="earn" replace />} />
                  </Routes>
                </Suspense>
              </MainLayout>
            }
          />

          {/* Global Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AppProvider>
  );
};

export default App;
