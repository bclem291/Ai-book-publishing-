import React from 'react';
import { useVehicles } from '../context/VehicleContext';
import { WHATSAPP_DISPLAY_NUMBER, WHATSAPP_LOCAL_NUMBER, createGeneralWhatsAppLink } from '../utils/whatsapp';
import { MessageSquare, Phone, MapPin, ShieldCheck, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useVehicles();

  return (
    <footer className="bg-[#070F1A] text-slate-300 border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded bg-amber-400 flex items-center justify-center font-display font-black text-xl text-[#0B192C]">
                A
              </div>
              <span className="font-display font-black text-2xl tracking-wider text-white uppercase">
                AHAVA <span className="text-amber-400">AUTOS</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              "Your Next Car Starts Here."
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nigeria&apos;s trusted automobile advertising and sales showroom. Explore quality verified foreign-used, brand-new, and Nigerian-used vehicles with seamless WhatsApp enquiries.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-amber-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Inspection First, Transparent Transactions</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('cars')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  All Cars Inventory
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('brands')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Browse by Brand
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('about')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  About AHAVA AUTOS
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('contact')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Contact & Enquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#category/SUVs"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  SUVs & 4x4s
                </a>
              </li>
              <li>
                <a
                  href="#category/Sedans"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Executive Sedans
                </a>
              </li>
              <li>
                <a
                  href="#category/Luxury Cars"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Luxury Cars
                </a>
              </li>
              <li>
                <a
                  href="#category/Affordable Cars"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Affordable Daily Drivers
                </a>
              </li>
              <li>
                <a
                  href="#category/Foreign Used Cars"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Foreign Used (Tokunbo)
                </a>
              </li>
            </ul>
          </div>

          {/* Direct Seller Contact */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Direct Contact
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <div className="text-xs text-slate-400">Official WhatsApp</div>
                  <a
                    href={createGeneralWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-amber-400 font-semibold"
                  >
                    {WHATSAPP_DISPLAY_NUMBER}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                <div>
                  <div className="text-xs text-slate-400">Direct Phone Line</div>
                  <a href={`tel:${WHATSAPP_LOCAL_NUMBER}`} className="text-white hover:text-amber-400">
                    {WHATSAPP_LOCAL_NUMBER}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                <div>
                  <div className="text-xs text-slate-400">Primary Market</div>
                  <span className="text-slate-300">Lagos & Abuja, Nigeria</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={createGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded shadow transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer & Policy strip */}
        <div className="border-t border-slate-800/80 pt-8 mt-8 text-xs text-slate-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} AHAVA AUTOS. All rights reserved. Sample inventory items are clearly labeled for demonstration. Actual listings and physical inspections arranged directly via WhatsApp.
          </p>

          <div className="flex items-center gap-6 text-xs shrink-0">
            <button
              onClick={() => setCurrentPage('about')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setCurrentPage('about')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setCurrentPage('admin')}
              className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
              title="Administrator Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
