import React, { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import { VehicleCard } from '../components/VehicleCard';
import { POPULAR_BRANDS } from '../data/initialVehicles';
import { createGeneralWhatsAppLink, WHATSAPP_DISPLAY_NUMBER, WHATSAPP_LOCAL_NUMBER } from '../utils/whatsapp';
import {
  MessageSquare,
  ArrowRight,
  Shield,
  Search,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  FileCheck,
  Eye,
  BadgeCheck,
  Car,
  Compass,
  PhoneCall,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { vehicles, setCurrentPage, setActiveBrandFilter, setActiveCategoryFilter } = useVehicles();

  // Quick hero search state
  const [quickBrand, setQuickBrand] = useState('');
  const [quickCondition, setQuickCondition] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickBrand) setActiveBrandFilter(quickBrand);
    setCurrentPage('cars');
  };

  const handleBrandSelect = (brandName: string) => {
    setActiveBrandFilter(brandName);
    setCurrentPage('cars');
  };

  const handleCategorySelect = (categoryName: string) => {
    setActiveCategoryFilter(categoryName);
    setCurrentPage('cars');
  };

  // Curated collections
  const featuredCars = vehicles.filter((v) => v.featured);
  const latestArrivals = [...vehicles].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 4);
  const affordableCars = vehicles.filter((v) => v.price <= 20000000).slice(0, 4);
  const suvCars = vehicles.filter((v) => v.category.includes('SUVs') || v.category.includes('Family Cars')).slice(0, 4);
  const luxuryCars = vehicles.filter((v) => v.category.includes('Luxury Cars') || v.price >= 45000000).slice(0, 4);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I arrange a physical inspection for a car?',
      a: 'Simply click the "Enquire on WhatsApp" button on any vehicle card or details page. Your message will automatically include the car model, listed price, and reference ID. Our sales team will confirm physical availability and schedule an inspection with you at our verified location in Lagos or Abuja.',
    },
    {
      q: 'Can I bring my personal mechanic or diagnostic scanner?',
      a: 'Yes, absolutely. We encourage and support comprehensive pre-purchase inspections. You or your certified technician can scan the OBD-II port, examine engine parameters, and verify the physical condition before any transaction agreement is reached.',
    },
    {
      q: 'Are customs duty papers and vehicle documentation verified?',
      a: 'Yes. For all foreign-used (Tokunbo) vehicles, original single-goods customs clearance declaration papers, bill of lading, and port clearance documents are readily available for physical verification during inspection.',
    },
    {
      q: 'Do you accept online checkout or card payments on this website?',
      a: 'No. AHAVA AUTOS is an automotive advertising and direct sales showroom. We do not use online checkout or web payment processors. All purchase discussions, vehicle inspections, and agreed transaction steps occur directly between buyer and seller.',
    },
    {
      q: 'Can AHAVA AUTOS help me source a specific car not currently in the showroom?',
      a: 'Yes! If you are seeking a specific year, trim level, or colour (e.g. Lexus GX 460, Toyota Prado, Mercedes-Benz GLE, or Honda Civic), contact us on WhatsApp with your exact requirements and budget, and we will update you on matching available inventory.',
    },
  ];

  return (
    <div className="bg-slate-50">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B192C] text-white overflow-hidden">
        {/* Background Image with Dark Blue / Vignette Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_luxury_cars_1792063513133.jpg"
            alt="AHAVA AUTOS Luxury Car Showroom"
            className="w-full h-full object-cover opacity-35 object-center scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B192C] via-[#0B192C]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-28 lg:pb-36">
          <div className="max-w-2xl">
            
            {/* Tagline kicker */}
            <div className="inline-flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-amber-400 uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Direct Automobile Showroom · Nigeria</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-white leading-tight balance">
              Find Your Next Car with <span className="text-amber-400">AHAVA AUTOS</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              Explore quality vehicles, compare your options, and contact us directly on WhatsApp to make your next car purchase easier.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={() => setCurrentPage('cars')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-lg shadow-md transition-all cursor-pointer"
              >
                <span>Explore Available Cars</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={createGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-slate-800/80 hover:bg-slate-700/90 active:bg-slate-800 rounded-lg border border-slate-700 backdrop-blur-sm transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                <span>Chat With Us on WhatsApp</span>
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-10 pt-8 border-t border-slate-700/60 grid grid-cols-3 gap-4 text-xs text-slate-300">
              <div>
                <div className="font-extrabold text-white text-base sm:text-lg tabular-nums">100%</div>
                <div className="text-slate-400">Physical Inspection</div>
              </div>
              <div>
                <div className="font-extrabold text-white text-base sm:text-lg tabular-nums">₦0</div>
                <div className="text-slate-400">Hidden Online Fees</div>
              </div>
              <div>
                <div className="font-extrabold text-white text-base sm:text-lg tabular-nums">Direct</div>
                <div className="text-slate-400">WhatsApp Response</div>
              </div>
            </div>

          </div>
        </div>

        {/* Floating Quick Search Filter Strip */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-4">
          <form
            onSubmit={handleQuickSearch}
            className="bg-white rounded-xl shadow-xl p-4 sm:p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-end"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Make / Brand</label>
              <select
                value={quickBrand}
                onChange={(e) => setQuickBrand(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-amber-500"
              >
                <option value="">All Car Brands</option>
                {POPULAR_BRANDS.map((b) => (
                  <option key={b.name} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Condition</label>
              <select
                value={quickCondition}
                onChange={(e) => setQuickCondition(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-amber-500"
              >
                <option value="">Any Condition</option>
                <option value="Foreign Used">Foreign Used (Tokunbo)</option>
                <option value="Brand New">Brand New</option>
                <option value="Nigerian Used">Nigerian Used</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Market</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                Lagos, Abuja & Across Nigeria
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#0B192C] hover:bg-[#152D4A] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4 text-amber-400" />
              <span>Search Showroom</span>
            </button>
          </form>
        </div>
      </section>

      {/* 2. FEATURED VEHICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Top Picks
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Featured Vehicles
            </h2>
          </div>

          <button
            onClick={() => setCurrentPage('cars')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors cursor-pointer group"
          >
            <span>View All Inventory</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredCars.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* 3. BROWSE CARS BY BRAND */}
      <section className="bg-white border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Manufacturers
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Browse Cars by Brand
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore available stock from the world’s leading automobile manufacturers in Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {POPULAR_BRANDS.map((brand) => (
              <button
                key={brand.name}
                type="button"
                onClick={() => handleBrandSelect(brand.name)}
                className="group p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-400 rounded-xl transition-all duration-200 text-center flex flex-col items-center justify-center hover:shadow-sm cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-slate-200/80 group-hover:bg-amber-100 text-slate-700 group-hover:text-amber-700 flex items-center justify-center mb-2 transition-colors">
                  <Car className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {brand.name}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">
                  Explore Stock
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setCurrentPage('brands')}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-800 hover:text-amber-600 cursor-pointer"
            >
              <span>Explore full brand directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. LATEST ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Fresh Showroom Stock
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Latest Arrivals
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('cars')}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-amber-600 cursor-pointer"
          >
            <span>View All Stock ({vehicles.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestArrivals.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* 5. AFFORDABLE CARS SPOTLIGHT */}
      <section className="bg-slate-100/70 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
                Value & Economy
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
                Affordable Cars
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Quality vehicles with dependable reliability and low maintenance costs under ₦20,000,000.
              </p>
            </div>
            <button
              onClick={() => handleCategorySelect('Affordable Cars')}
              className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-amber-600 cursor-pointer"
            >
              <span>Explore Budget Deals</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {affordableCars.map((car) => (
              <VehicleCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. SUVS & FAMILY CARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Nigerian Road Ready
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              SUVs & Family Cars
            </h2>
          </div>
          <button
            onClick={() => handleCategorySelect('SUVs')}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-amber-600 cursor-pointer"
          >
            <span>See All SUVs</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suvCars.map((car) => (
            <VehicleCard key={car.id} car={car} />
          ))}
        </div>
      </section>

      {/* 7. WHY CHOOSE AHAVA AUTOS */}
      <section className="bg-[#0B192C] text-white py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Transparent Experience
            </div>
            <h2 className="text-3xl font-display font-extrabold text-white">
              Why Choose AHAVA AUTOS?
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              We streamline car shopping in Nigeria with clear details, zero gimmicks, and direct WhatsApp communication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-[#0F223A] rounded-xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Convenient Online Car Browsing
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Review available vehicles, compare specifications, examine interior and exterior photographs, and evaluate transparent Naira prices from your phone or laptop.
              </p>
            </div>

            <div className="p-6 bg-[#0F223A] rounded-xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Detailed Vehicle Listings
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every vehicle includes its actual condition (Foreign Used, Brand New, Nigerian Used), transmission, fuel type, engine specs, mileage, and verified location.
              </p>
            </div>

            <div className="p-6 bg-[#0F223A] rounded-xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Direct WhatsApp Enquiries
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Skip complicated forms and delayed emails. Instantly connect with the seller on WhatsApp with the specific vehicle details prefilled in your message.
              </p>
            </div>

            <div className="p-6 bg-[#0F223A] rounded-xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Multiple Vehicle Brands
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                From dependable Toyota and Honda models to executive Mercedes-Benz, Lexus, Land Rover, and Hyundai vehicles, browse across premier manufacturers.
              </p>
            </div>

            <div className="p-6 bg-[#0F223A] rounded-xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Easy Vehicle Comparison
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Filter by price range, manufacturing year, fuel type, transmission, and location to find exactly what fits your budget and lifestyle.
              </p>
            </div>

            <div className="p-6 bg-[#0F223A] rounded-xl border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                Personalised Customer Assistance
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Speak directly with automotive specialists who understand Nigerian market conditions, road realities, and document verification standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW TO GET YOUR NEXT CAR (5 CLEAR STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            Simple & Transparent
          </div>
          <h2 className="text-3xl font-display font-extrabold text-slate-900">
            How to Get Your Next Car
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Follow our five-step path to finding, inspecting, and securing your vehicle with AHAVA AUTOS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center mx-auto mb-3">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Browse Inventory</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Explore our catalog of available vehicles with clear photographs and specifications.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center mx-auto mb-3">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Compare Details</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review mileage, condition (Foreign or Nigerian Used), price in Naira, and vehicle location.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Click WhatsApp</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click "Enquire on WhatsApp" to open a chat with the exact car information prefilled.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 font-bold text-sm flex items-center justify-center mx-auto mb-3">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Arrange Inspection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discuss vehicle availability and schedule an in-person physical inspection and OBD scanner check.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center mx-auto mb-3">
                5
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">Complete Purchase</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Confirm vehicle details and complete the purchase through an agreed, secure transaction process.
              </p>
            </div>
          </div>

        </div>

        {/* Clear Nigerian Buying Advice Banner */}
        <div className="mt-12 bg-amber-50 border border-amber-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-7 h-7 text-amber-600 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Buyer Peace of Mind Protocol
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Always inspect the vehicle physically and verify customs documents before making any financial commitment.
              </p>
            </div>
          </div>

          <a
            href={createGeneralWhatsAppLink('Hello AHAVA AUTOS, I would like to enquire about vehicle inspection procedures.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap"
          >
            Ask About Inspection
          </a>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Common Enquiries
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Straightforward answers about our vehicle listings, inspections, and direct WhatsApp sales process.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 bg-slate-50 hover:bg-slate-100/80 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-slate-900 text-sm">
                      {faq.q}
                    </span>
                    <span className="text-slate-400 font-bold text-lg leading-none">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 10. QUICK CONTACT CONVERSION SECTION */}
      <section className="bg-[#0B192C] text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white mb-3">
            Ready to find your car or schedule an inspection?
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-8">
            Contact AHAVA AUTOS right now on WhatsApp. Send us your preferred model, budget, or target year, and our team will assist you immediately.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-extrabold text-sm rounded-lg shadow-lg transition-colors"
            >
              <MessageSquare className="w-5 h-5 fill-slate-950" />
              <span>Chat on WhatsApp ({WHATSAPP_DISPLAY_NUMBER})</span>
            </a>

            <button
              onClick={() => setCurrentPage('contact')}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-lg border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Send Online Enquiry</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
