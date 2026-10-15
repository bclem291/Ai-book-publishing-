import React, { useState } from 'react';
import { createGeneralWhatsAppLink, WHATSAPP_DISPLAY_NUMBER } from '../utils/whatsapp';
import { MessageSquare, X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {/* Tooltip / Quick preview card */}
      {showTooltip && (
        <div className="mb-3 p-4 bg-[#0B192C] text-white rounded-xl shadow-xl border border-slate-700 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                AHAVA AUTOS Direct
              </span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-white p-0.5"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            Looking for a specific car or want to book an inspection in Nigeria? We reply fast on WhatsApp!
          </p>
          <a
            href={createGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Start Chat ({WHATSAPP_DISPLAY_NUMBER})
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-[#0B192C] text-xs font-semibold text-slate-200 rounded-full border border-slate-700 shadow-md hover:text-white cursor-pointer"
        >
          <span>Need help finding a car?</span>
        </button>

        <a
          href={createGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp with AHAVA AUTOS"
          className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105"
        >
          <MessageSquare className="w-7 h-7 fill-white" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-600 border-2 border-white"></span>
          </span>
        </a>
      </div>
    </div>
  );
};
