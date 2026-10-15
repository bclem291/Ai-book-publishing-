import React, { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import { VehicleCard } from '../components/VehicleCard';
import { formatNaira } from '../utils/currency';
import {
  createVehicleWhatsAppLink,
  shareVehicle,
  downloadCarImage,
  WHATSAPP_DISPLAY_NUMBER,
} from '../utils/whatsapp';
import {
  MessageSquare,
  Share2,
  Download,
  Check,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  ShieldCheck,
  FileText,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';

export const CarDetailsPage: React.FC = () => {
  const { selectedVehicle, vehicles, setCurrentPage, logEnquiry } = useVehicles();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fallback if no selected vehicle in state
  const car = selectedVehicle || vehicles[0];

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Vehicle Not Found</h2>
        <button
          onClick={() => setCurrentPage('cars')}
          className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
        >
          Back to All Cars
        </button>
      </div>
    );
  }

  const images = car.images && car.images.length > 0 ? car.images : ['/src/assets/images/hero_luxury_cars_1792063513133.jpg'];
  const activeImage = images[selectedImageIndex] || images[0];

  // Similar vehicles: same category or brand, excluding current
  const similarCars = vehicles
    .filter(
      (v) =>
        v.id !== car.id &&
        (v.brand === car.brand || v.category?.some((c) => car.category?.includes(c)))
    )
    .slice(0, 3);

  const handleShare = async () => {
    const result = await shareVehicle(car);
    if (result.fallbackCopied) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    await downloadCarImage(
      activeImage,
      `${car.brand}_${car.model}_${car.year}_${car.id}`.replace(/\s+/g, '_')
    );
    setTimeout(() => setDownloading(false), 800);
  };

  const handleWhatsAppClick = () => {
    logEnquiry({
      name: 'Vehicle Details Page Visitor',
      phone: 'WhatsApp Click',
      carInterest: `${car.brand} ${car.model} ${car.year} (${car.id})`,
      message: `Enquired from vehicle details page for ${car.brand} ${car.model}`,
      vehicleId: car.id,
    });
  };

  const isSold = car.availability === 'Sold';
  const isReserved = car.availability === 'Reserved';

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <button
            onClick={() => setCurrentPage('home')}
            className="hover:text-slate-900 cursor-pointer"
          >
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => setCurrentPage('cars')}
            className="hover:text-slate-900 cursor-pointer"
          >
            Inventory
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900 truncate max-w-xs">
            {car.brand} {car.model} ({car.year})
          </span>
        </nav>

        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => setCurrentPage('cars')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Vehicles</span>
          </button>
        </div>

        {/* Main Grid: Gallery Left (60%), Details Right (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary Large Vehicle Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-sm group">
              <img
                src={activeImage}
                alt={`${car.brand} ${car.model} ${car.year}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                referrerPolicy="no-referrer"
              />

              {/* Status and Demo tag */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isSold ? (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-rose-600 text-white rounded shadow">
                    Sold
                  </span>
                ) : isReserved ? (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 rounded shadow">
                    Reserved
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white rounded shadow">
                    Available for Inspection
                  </span>
                )}

                {car.is_demo && (
                  <span className="px-2.5 py-1 text-[11px] font-medium bg-slate-900/85 backdrop-blur-md text-amber-300 rounded border border-slate-700">
                    Demonstration Listing
                  </span>
                )}
              </div>

              {/* Action tools overlay (Share / Download) */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share vehicle"
                  className="p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-lg transition-colors cursor-pointer"
                  title="Share Listing"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  aria-label="Download photo"
                  className="p-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white rounded-lg transition-colors cursor-pointer"
                  title="Download Photo"
                >
                  {downloading ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4" />}
                </button>
              </div>

              <div className="absolute bottom-4 left-4 text-xs text-white/90 bg-black/50 backdrop-blur-md px-3 py-1 rounded">
                Photo {selectedImageIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-24 h-18 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImageIndex === idx ? 'border-amber-500 shadow-md ring-1 ring-amber-400' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Share link feedback toast */}
            {copiedLink && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Listing details and link copied to clipboard!</span>
              </div>
            )}

            {/* Detailed Description Box */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs mt-6">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Vehicle Overview & Highlights</span>
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {car.description}
              </p>

              {/* Demonstration Disclaimer Note */}
              {car.is_demo && (
                <div className="mt-5 p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Note:</strong> This listing is presented as a demonstration sample of available models in Nigeria. Exact vehicle specifications, customs duty papers, and pricing are confirmed directly with AHAVA AUTOS prior to physical inspection.
                  </p>
                </div>
              )}
            </div>

            {/* Inspection & Buying Guidelines Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Inspection & Purchase Verification</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span><strong>Physical Verification:</strong> Inspect the vehicle in person at our verified Lagos or Abuja location.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span><strong>Diagnostic Scanner Welcome:</strong> Plug in your OBD-II scanner and bring your trusted technician.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span><strong>Customs Duty Verification:</strong> Original single-goods customs declaration documents available on site.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                  <span><strong>No Advance Online Payment:</strong> No card or web checkouts required. You only pay after satisfied inspection.</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Details & Purchase Module Column (Sticky right) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              
              {/* Header: Brand, Model, Year */}
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                <span>{car.brand}</span>
                <span className="text-slate-400 font-mono text-[11px]">REF: {car.id}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 leading-tight">
                {car.brand} {car.model}
              </h1>

              {/* Price Banner */}
              <div className="mt-4 p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Listed Showroom Price
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">
                    {formatNaira(car.price)}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 bg-white/10 rounded font-medium text-slate-200">
                    {car.condition}
                  </span>
                </div>
              </div>

              {/* PRIMARY WHATSAPP ENQUIRY BUTTON */}
              <div className="mt-6 space-y-3">
                <a
                  href={createVehicleWhatsAppLink(car)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsAppClick}
                  className={`w-full py-4 px-6 text-sm sm:text-base font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer ${
                    isSold
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed pointer-events-none'
                      : 'bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 hover:shadow-lg'
                  }`}
                >
                  <MessageSquare className="w-5 h-5 fill-slate-950" />
                  <span>Enquire on WhatsApp</span>
                </a>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Photo</span>
                  </button>
                </div>

                <p className="text-[11px] text-center text-slate-500 pt-1">
                  Clicking will open WhatsApp with this car&apos;s exact details prefilled. Send message to start conversation.
                </p>
              </div>

              {/* Technical Specifications Grid */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
                  Vehicle Specifications
                </h3>

                <dl className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Condition</dt>
                    <dd className="font-semibold text-slate-900">{car.condition}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Manufacturing Year</dt>
                    <dd className="font-semibold text-slate-900">{car.year}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Mileage</dt>
                    <dd className="font-semibold text-slate-900">{car.mileage || 'Not Specified'}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Transmission</dt>
                    <dd className="font-semibold text-slate-900">{car.transmission}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Fuel Type</dt>
                    <dd className="font-semibold text-slate-900">{car.fuel_type}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Engine Specs</dt>
                    <dd className="font-semibold text-slate-900 text-right truncate max-w-[200px]" title={car.engine}>
                      {car.engine || 'Standard'}
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Exterior Colour</dt>
                    <dd className="font-semibold text-slate-900">{car.exterior_colour}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Interior Colour</dt>
                    <dd className="font-semibold text-slate-900">{car.interior_colour || 'Premium'}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Vehicle Location</dt>
                    <dd className="font-semibold text-slate-900 flex items-center gap-1 text-right">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{car.location}</span>
                    </dd>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <dt className="text-slate-500">Availability</dt>
                    <dd className="font-bold text-slate-900">
                      {isSold ? (
                        <span className="text-rose-600">Sold</span>
                      ) : isReserved ? (
                        <span className="text-amber-600">Reserved</span>
                      ) : (
                        <span className="text-emerald-600">Available</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Direct Seller Contact Card */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 mb-1">Have questions or want video tour?</div>
                <p className="text-slate-600 mb-2">
                  We can send short walk-around videos of engine running, interior cabin, and underside directly to your WhatsApp.
                </p>
                <div className="font-bold text-slate-900">
                  Call or WhatsApp: <span className="text-amber-600">{WHATSAPP_DISPLAY_NUMBER}</span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Similar Vehicles: "You May Also Like" */}
        {similarCars.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                  Alternative Options
                </div>
                <h3 className="text-2xl font-display font-extrabold text-slate-900">
                  You May Also Like
                </h3>
              </div>

              <button
                onClick={() => setCurrentPage('cars')}
                className="text-xs font-bold text-slate-900 hover:text-amber-600 cursor-pointer"
              >
                View all inventory →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCars.map((simCar) => (
                <VehicleCard key={simCar.id} car={simCar} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
