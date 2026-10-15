import React, { useState } from 'react';
import { Vehicle } from '../types/vehicle';
import { formatNaira } from '../utils/currency';
import { createVehicleWhatsAppLink } from '../utils/whatsapp';
import { useVehicles } from '../context/VehicleContext';
import { MessageSquare, MapPin, Gauge, Fuel, Eye, AlertCircle } from 'lucide-react';

interface VehicleCardProps {
  car: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ car }) => {
  const { setSelectedVehicle, setCurrentPage, logEnquiry } = useVehicles();
  const [imageError, setImageError] = useState(false);

  const handleViewDetails = () => {
    setSelectedVehicle(car);
    window.location.hash = `#car/${car.id}`;
    setCurrentPage('car-details');
  };

  const handleWhatsAppEnquiry = () => {
    // Log enquiry intent for admin analytics
    logEnquiry({
      name: 'Direct WhatsApp Visitor',
      phone: 'WhatsApp Click',
      carInterest: `${car.brand} ${car.model} ${car.year} (${car.id})`,
      message: `Enquired from vehicle card for ${car.brand} ${car.model}`,
      vehicleId: car.id,
    });
  };

  const primaryImage = car.images && car.images.length > 0 ? car.images[0] : '/src/assets/images/hero_luxury_cars_1792063513133.jpg';

  const isSold = car.availability === 'Sold';
  const isReserved = car.availability === 'Reserved';

  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      
      {/* Vehicle Media Box */}
      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden cursor-pointer" onClick={handleViewDetails}>
        {!imageError ? (
          <img
            src={primaryImage}
            alt={`${car.brand} ${car.model} ${car.year}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-slate-400 p-4 text-center">
            <span className="font-display font-bold text-lg text-white mb-1">{car.brand} {car.model}</span>
            <span className="text-xs text-slate-400">{car.year} · {formatNaira(car.price)}</span>
          </div>
        )}

        {/* Gradient scrim for visual contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Availability Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isSold ? (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-rose-600 text-white rounded shadow-sm">
              Sold
            </span>
          ) : isReserved ? (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 rounded shadow-sm">
              Reserved
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white rounded shadow-sm">
              Available
            </span>
          )}

          {car.featured && !isSold && (
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-amber-400 text-slate-950 rounded shadow-sm">
              Featured
            </span>
          )}
        </div>

        {/* Demo inventory indicator if demo */}
        {car.is_demo && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 text-[10px] font-medium bg-slate-900/80 backdrop-blur-sm text-slate-300 rounded border border-slate-700">
              Demo Listing
            </span>
          </div>
        )}

        {/* Condition & Transmission Overlay bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white drop-shadow">
          <span className="font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
            {car.condition}
          </span>
          <span className="font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
            {car.transmission}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        {/* Brand, Model, Year, Price */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              {car.brand}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Year {car.year}
            </span>
          </div>

          <h3 
            onClick={handleViewDetails}
            className="text-lg font-bold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer line-clamp-1"
          >
            {car.brand} {car.model}
          </h3>

          <div className="mt-2 text-xl font-extrabold text-slate-900 tabular-nums">
            {formatNaira(car.price)}
          </div>

          {/* Quick Specifications (No pill enclosures - clean unboxed layout) */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{car.mileage || 'Low Mileage'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{car.fuel_type}</span>
            </div>
            <div className="flex items-center gap-1.5 col-span-2 truncate text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{car.location}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleViewDetails}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>

          <a
            href={createVehicleWhatsAppLink(car)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppEnquiry}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-slate-950 rounded-lg transition-colors shadow-xs cursor-pointer ${
              isSold
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed pointer-events-none'
                : 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 fill-slate-950" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>

      </div>

    </article>
  );
};
