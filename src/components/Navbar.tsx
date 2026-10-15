import React, { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import { createGeneralWhatsAppLink, WHATSAPP_DISPLAY_NUMBER } from '../utils/whatsapp';
import { MessageSquare, Menu, X, Shield, PhoneCall } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, setCurrentPage, isAdmin } = useVehicles();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'cars', label: 'All Cars' },
    { id: 'brands', label: 'Brands' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentPage(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B192C] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-2 group whitespace-nowrap shrink-0"
          >
            <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-display font-extrabold text-xl text-[#0B192C] shadow-inner tracking-tight">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl tracking-wider text-white uppercase group-hover:text-amber-400 transition-colors">
                AHAVA <span className="text-amber-400">AUTOS</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-slate-400 font-semibold">
                Nigeria Automarket
              </span>
            </div>
          </a>

          {/* Zone 2: Primary Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap hover:text-white cursor-pointer ${
                    isActive ? 'text-amber-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400" />
                  )}
                </button>
              );
            })}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Action CTA */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer hover:shadow"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-3">
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Direct WhatsApp"
              className="p-2 text-amber-400 hover:text-white rounded-md"
            >
              <MessageSquare className="w-6 h-6" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F223A] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2.5 rounded text-base font-medium cursor-pointer ${
                currentPage === item.id
                  ? 'bg-[#1E3E62] text-amber-400 font-semibold'
                  : 'text-slate-200 hover:bg-[#152D4A]'
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className="block w-full text-left px-3 py-2.5 rounded text-base font-medium text-amber-300 hover:bg-[#152D4A] cursor-pointer"
            >
              Admin Dashboard
            </button>
          )}

          <div className="pt-4 border-t border-slate-700/60 mt-3 flex flex-col gap-3">
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-slate-950 bg-amber-400 rounded-lg shadow cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Contact via WhatsApp (+234 703 332 5827)</span>
            </a>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Direct Sales Line: {WHATSAPP_DISPLAY_NUMBER}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
