import React, { useState } from 'react';
import { useVehicles } from '../context/VehicleContext';
import {
  createContactFormWhatsAppLink,
  createGeneralWhatsAppLink,
  WHATSAPP_DISPLAY_NUMBER,
  WHATSAPP_LOCAL_NUMBER,
} from '../utils/whatsapp';
import { MessageSquare, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { logEnquiry } = useVehicles();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    carInterest: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.carInterest.trim()) newErrors.carInterest = 'Please mention the car model of interest';
    if (!formData.message.trim()) newErrors.message = 'Please provide details or questions regarding the car';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Log enquiry to backend API
    logEnquiry({
      name: formData.name,
      phone: formData.phone,
      carInterest: formData.carInterest,
      message: formData.message,
    });

    // Generate prefilled WhatsApp URL and open in new tab
    const whatsappUrl = createContactFormWhatsAppLink(formData);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            Get In Touch
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900">
            Contact AHAVA AUTOS
          </h1>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            Have questions about a listed vehicle or want to arrange a physical inspection in Nigeria? Contact us directly on WhatsApp or fill out the enquiry form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#0B192C] text-white rounded-2xl p-6 sm:p-8 shadow-md">
              <h3 className="text-xl font-bold font-display text-white mb-6">
                Direct Contact Channels
              </h3>

              <div className="space-y-6 text-sm">
                
                {/* WhatsApp */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Official WhatsApp</span>
                    <a
                      href={createGeneralWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      {WHATSAPP_DISPLAY_NUMBER}
                    </a>
                    <span className="text-[11px] text-emerald-400 block mt-0.5">
                      Recommended for fast replies & inspections
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Direct Telephone</span>
                    <a
                      href={`tel:${WHATSAPP_LOCAL_NUMBER}`}
                      className="text-base font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      {WHATSAPP_LOCAL_NUMBER}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Nigerian voice calls
                    </span>
                  </div>
                </div>

                {/* Location / Market */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Showroom Locations</span>
                    <span className="text-sm font-semibold text-white block">
                      Lagos & Abuja, Nigeria
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Physical inspection addresses shared upon booking
                    </span>
                  </div>
                </div>

              </div>

              {/* Instant WhatsApp Button */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <a
                  href={createGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-slate-950" />
                  <span>Start WhatsApp Conversation</span>
                </a>
              </div>

            </div>

            {/* Inspection guidance card */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 text-xs text-slate-600 shadow-xs">
              <h4 className="font-bold text-slate-900 mb-2">Inspection Scheduling Notice</h4>
              <p className="leading-relaxed">
                Inspections are arranged Monday to Saturday. When requesting an inspection, please specify whether you will be coming to our Lekki, Victoria Island, or Abuja location.
              </p>
            </div>

          </div>

          {/* Right Column: Contact Enquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              
              <div className="mb-6">
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Send Vehicle Enquiry
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your details below. Clicking "Submit Enquiry" will validate your request and seamlessly launch WhatsApp with your message pre-written.
                </p>
              </div>

              {/* Crucial Instruction Notice */}
              <div className="mb-6 p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Important:</strong> You must click <em>"Send"</em> inside the WhatsApp app after it opens to deliver your enquiry to our sales line.
                </p>
              </div>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-bold">WhatsApp Window Opened!</strong>
                    <span>Your enquiry was prepared and your WhatsApp chat was launched. Please tap the send button in WhatsApp to submit.</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Babatunde Adeleke"
                    className={`w-full p-3 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 text-slate-800 ${
                      errors.name ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-amber-500'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Phone / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 08012345678 or +234..."
                    className={`w-full p-3 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 text-slate-800 ${
                      errors.phone ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-amber-500'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                </div>

                {/* Car Brand or Model */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Car Brand or Model of Interest <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.carInterest}
                    onChange={(e) => setFormData({ ...formData, carInterest: e.target.value })}
                    placeholder="e.g. 2021 Lexus RX 350 or Toyota Camry"
                    className={`w-full p-3 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 text-slate-800 ${
                      errors.carInterest ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-amber-500'
                    }`}
                  />
                  {errors.carInterest && <p className="text-[11px] text-rose-600 mt-1">{errors.carInterest}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Your Message / Enquiries <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your inspection availability, target budget, or any specific questions about customs documents..."
                    className={`w-full p-3 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-1 text-slate-800 ${
                      errors.message ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:ring-amber-500'
                    }`}
                  />
                  {errors.message && <p className="text-[11px] text-rose-600 mt-1">{errors.message}</p>}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Submit Enquiry & Continue to WhatsApp</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center pt-2">
                  We respect your privacy. We never share customer phone numbers with third parties.
                </p>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
