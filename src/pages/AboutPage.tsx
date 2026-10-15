import React from 'react';
import { useVehicles } from '../context/VehicleContext';
import { createGeneralWhatsAppLink, WHATSAPP_DISPLAY_NUMBER } from '../utils/whatsapp';
import {
  ShieldCheck,
  Search,
  MessageSquare,
  Eye,
  CheckCircle2,
  FileCheck2,
  HelpCircle,
  Phone,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setCurrentPage } = useVehicles();

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
            About AHAVA AUTOS
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 leading-tight">
            Your Trusted Destination for Quality Cars
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            AHAVA AUTOS is an online automotive showroom and vehicle advertising platform in Nigeria, dedicated to helping car buyers explore verified vehicles and connect directly with the seller via WhatsApp.
          </p>
        </div>

        {/* Section 1: Who We Are */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs mb-8">
          <h2 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Who We Are</span>
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            AHAVA AUTOS operates as an automobile advertising and car sales dealership platform based in Nigeria. We bridge the gap between automobile seekers and quality vehicles by providing detailed vehicle listings with comprehensive photographs, honest specifications, transparent pricing in Nigerian Naira, and direct seller communication.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed mt-3">
            Instead of navigating complex e-commerce checkouts or unverified online boards, our platform enables potential buyers to evaluate vehicles online and directly initiate conversations on WhatsApp for physical inspections and condition verifications.
          </p>
        </div>

        {/* Section 2: What We Offer */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs mb-8">
          <h2 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>What We Offer</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
              <Eye className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 mb-1">Visual Vehicle Showroom</strong>
                <span>High-resolution photographs showcasing exterior angles, interior cockpit, upholstery, and key vehicle details.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
              <FileCheck2 className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 mb-1">Accurate Specifications</strong>
                <span>Exact manufacturing year, transmission type, fuel system, engine specifications, mileage notes, and vehicle condition.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
              <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 mb-1">Direct WhatsApp Access</strong>
                <span>Instant connection with the seller containing the vehicle’s specific price, location, and reference number pre-filled.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 mb-1">Pre-Purchase Inspections</strong>
                <span>Physical verification arrangement and welcome policy for mechanical diagnostics before any transaction takes place.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Our Commitment to Customers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs mb-8">
          <h2 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Our Commitment to Customers</span>
          </h2>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span><strong>Transparent Pricing:</strong> Displayed prices in Nigerian Naira without hidden online processing fees or mandatory website surcharges.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span><strong>Accurate Representation:</strong> Demonstration listings are clearly marked as samples, while confirmed inventory reflects actual cars available for inspection.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
              <span><strong>Inspection Integrity:</strong> We encourage all buyers to conduct in-person physical inspections and independent mechanical checks before finalizing payment agreements.</span>
            </li>
          </ul>
        </div>

        {/* Section 4: Our Approach to Customer Service */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs mb-8">
          <h2 className="text-xl font-bold font-display text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Our Approach to Customer Service</span>
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            We understand that purchasing an automobile is a substantial financial decision. Our approach is founded on open communication, prompt WhatsApp responsiveness, and respectful consultation. We answer questions regarding vehicle history, customs clearance documents, and mechanical condition with honesty, ensuring you have the clarity needed to make a sound decision.
          </p>
        </div>

        {/* Section 5: Why Browse AHAVA AUTOS? */}
        <div className="bg-[#0B192C] text-white rounded-2xl p-8 shadow-md">
          <h2 className="text-xl font-bold font-display text-white mb-4">
            Why Browse AHAVA AUTOS?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            We provide an uncluttered, high-speed digital catalog designed specifically for Nigerian mobile networks and desktop users alike. No unnecessary popups, no distracting advertisements, and no fictitious claims. Just quality vehicles, realistic prices, and direct access to the seller on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setCurrentPage('cars')}
              className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Browse Vehicle Inventory
            </button>
            <a
              href={createGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Chat on WhatsApp ({WHATSAPP_DISPLAY_NUMBER})</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
