import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './providers/AppProvider';
import { MainLayout } from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import VaultsPage from './pages/VaultsPage';
import PortfolioPage from './pages/PortfolioPage';
import AnalyticsPage from './pages/AnalyticsPage';

const App = () => {
  return (
    <AppProvider>
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingPage />} />

        {/* App Dashboard Routes */}
        <Route
          path="/app/*"
          element={
            <MainLayout>
              <Routes>
                <Route index element={<Navigate to="vaults" replace />} />
                <Route path="vaults" element={<VaultsPage />} />
                <Route path="portfolio" element={<PortfolioPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                {/* Fallback for /app/* */}
                <Route path="*" element={<Navigate to="vaults" replace />} />
              </Routes>
            </MainLayout>
          }
        />

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
};

export default App;
