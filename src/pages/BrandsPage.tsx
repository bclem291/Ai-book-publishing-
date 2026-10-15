import React from 'react';
import { useVehicles } from '../context/VehicleContext';
import { POPULAR_BRANDS } from '../data/initialVehicles';
import { Car, ChevronRight, MessageSquare } from 'lucide-react';
import { createGeneralWhatsAppLink } from '../utils/whatsapp';

export const BrandsPage: React.FC = () => {
  const { vehicles, setActiveBrandFilter, setCurrentPage } = useVehicles();

  // All manufacturers list as requested
  const allBrands = [
    { name: 'Toyota', origin: 'Japan', desc: 'Legendary reliability, high resale value and accessible parts across Nigeria.' },
    { name: 'Mercedes-Benz', origin: 'Germany', desc: 'Precision luxury engineering, AMG styling and executive commanding presence.' },
    { name: 'Lexus', origin: 'Japan', desc: 'Refined craftsmanship, premium comfort and bulletproof V6/V8 reliability.' },
    { name: 'Honda', origin: 'Japan', desc: 'Punchy VTEC performance, modern styling and outstanding fuel economy.' },
    { name: 'Land Rover', origin: 'United Kingdom', desc: 'Unmatched off-road prestige, Terrain Response technology and Range Rover luxury.' },
    { name: 'Hyundai', origin: 'South Korea', desc: 'Cutting-edge modern tech, high value packaging and fuel-efficient mobility.' },
    { name: 'Kia', origin: 'South Korea', desc: 'Sharp contemporary designs, intuitive cabin tech and reliable daily driving.' },
    { name: 'BMW', origin: 'Germany', desc: 'The ultimate driving machine, twin-turbo dynamics and athletic luxury.' },
    { name: 'Ford', origin: 'United States', desc: 'Rugged pickup capability, spacious family cabins and EcoBoost performance.' },
    { name: 'Nissan', origin: 'Japan', desc: 'Accessible daily commuting, solid SUV choices and dependable platforms.' },
    { name: 'Audi', origin: 'Germany', desc: 'Quattro all-wheel drive, futuristic virtual cockpits and executive finish.' },
    { name: 'Peugeot', origin: 'France', desc: 'Nigerian road heritage, European ride comfort and contemporary French styling.' },
    { name: 'Volkswagen', origin: 'Germany', desc: 'TSI turbocharged efficiency, solid body construction and German ergonomics.' },
    { name: 'Chevrolet', origin: 'United States', desc: 'Classic V8 capability, spacious utility and American road presence.' },
  ];

  const handleSelectBrand = (brandName: string) => {
    setActiveBrandFilter(brandName);
    setCurrentPage('cars');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            Browse Vehicles by Brand
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Select a manufacturer to explore in-stock listings, compare specifications, and arrange vehicle inspections directly with AHAVA AUTOS.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBrands.map((brand) => {
            const count = vehicles.filter(
              (v) => v.brand.toLowerCase() === brand.name.toLowerCase()
            ).length;

            return (
              <div
                key={brand.name}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
                      <Car className="w-6 h-6 text-slate-700" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-100">
                      {count} {count === 1 ? 'Car Available' : 'Cars Available'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {brand.name}
                  </h3>
                  <div className="text-[11px] font-medium text-slate-400 mb-3">
                    Origin: {brand.origin}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {brand.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {count > 0 ? (
                    <button
                      onClick={() => handleSelectBrand(brand.name)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
                    >
                      <span>View {brand.name} Listings ({count})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <a
                      href={createGeneralWhatsAppLink(`Hello AHAVA AUTOS, I am looking for a ${brand.name} vehicle. Do you have any arriving soon?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Request on WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Request Banner */}
        <div className="mt-14 bg-[#0B192C] text-white rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Looking for a specific marque or customized trim?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We source verified vehicles directly across major ports and dealer networks. Tell us your target brand, model year, and budget.
            </p>
          </div>

          <a
            href={createGeneralWhatsAppLink('Hello AHAVA AUTOS, I have a specific car brand request that is not listed.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors whitespace-nowrap"
          >
            Chat with Car Specialist
          </a>
        </div>

      </div>
    </div>
  );
};
