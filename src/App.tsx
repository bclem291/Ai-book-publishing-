import React from 'react';
import { VehicleProvider, useVehicles } from './context/VehicleContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { HomePage } from './pages/HomePage';
import { AllCarsPage } from './pages/AllCarsPage';
import { CarDetailsPage } from './pages/CarDetailsPage';
import { BrandsPage } from './pages/BrandsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

const AppContent: React.FC = () => {
  const { currentPage } = useVehicles();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'cars':
        return <AllCarsPage />;
      case 'car-details':
        return <CarDetailsPage />;
      case 'brands':
        return <BrandsPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-400 selection:text-slate-950 font-sans">
      <Navbar />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />
      {currentPage !== 'admin' && <WhatsAppFloatingButton />}
    </div>
  );
};

export default function App() {
  return (
    <VehicleProvider>
      <AppContent />
    </VehicleProvider>
  );
}
