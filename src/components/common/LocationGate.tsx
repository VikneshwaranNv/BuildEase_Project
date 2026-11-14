import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Compass,
  Navigation,
  RefreshCw,
  Lock,
  Globe,
  Radio,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import { LANGUAGES } from '../../i18n/translations';
import { LanguageCode } from '../../types';
import { motion } from 'motion/react';

interface LocationGateProps {
  children: React.ReactNode;
}

export const LocationGate: React.FC<LocationGateProps> = ({ children }) => {
  const {
    locationPermissionStatus,
    deviceLocation,
    locationError,
    requestLocationAccess,
    overrideLocationWithDemoSite,
    language,
    setLanguage,
    t,
    projects,
  } = useApp();

  const [hasPromptedOnce, setHasPromptedOnce] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    if (!hasPromptedOnce && locationPermissionStatus !== 'granted') {
      setHasPromptedOnce(true);
      requestLocationAccess();
    }
  }, [hasPromptedOnce, locationPermissionStatus, requestLocationAccess]);

  if (locationPermissionStatus === 'granted') {
    return <>{children}</>;
  }

  const primarySite = projects[0] || {
    name: 'Metro Elevated Corridor - Pier 24–40',
    location: 'Eastern Expressway, Sector 7',
    geoCoordinates: { latitude: 19.076, longitude: 72.8777, radiusMeters: 250 },
  };

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="min-h-screen bg-[#D8CCB9] flex flex-col items-center justify-between p-4 sm:p-6 lg:p-8 text-[#252521] selection:bg-[#A77B50]/30 selection:text-[#252521] relative overflow-hidden bg-blueprint-grid">
      {/* Background Decorative 3D Radar Wave Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#A77B50]/40 animate-ping duration-[4000ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#51483D]/30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#A77B50]/40" />
      </div>

      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 py-2">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#252521] flex items-center justify-center text-[#A77B50] shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-lg tracking-tight text-[#252521]">
              {t('brand_name')}
            </div>
            <div className="text-[11px] font-bold text-[#51483D]">
              {t('brand_operations')}
            </div>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F4F0E8] border border-[#51483D]/30 hover:border-[#A77B50] text-xs font-bold text-[#252521] transition-all cursor-pointer shadow-sm active:scale-95"
            aria-label={t('select_language_title')}
          >
            <Globe className="w-4 h-4 text-[#A77B50]" />
            <span>{currentLangObj.nativeName}</span>
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#252521] border border-[#51483D] shadow-popover z-50 py-1.5 overflow-hidden text-[#F4F0E8]">
              <div className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-[#96938B] border-b border-[#51483D]/50">
                {t('select_language_title')}
              </div>
              {LANGUAGES.map((langItem) => (
                <button
                  key={langItem.code}
                  type="button"
                  onClick={() => {
                    setLanguage(langItem.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-[#51483D]/60 transition-colors cursor-pointer ${
                    language === langItem.code ? 'text-[#A77B50] font-black bg-[#51483D]' : 'text-[#F4F0E8]'
                  }`}
                >
                  <span>{langItem.nativeName}</span>
                  <span className="text-[10px] text-[#96938B]">{langItem.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Security Enforcement Card in Soft Ivory */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-[#F4F0E8] border border-[#51483D]/30 rounded-3xl p-6 sm:p-9 shadow-ivory-elevated relative z-10 my-auto"
      >
        {/* Security Badge Pill */}
        <div className="flex items-center justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#51483D] text-[#F4F0E8] text-xs font-black tracking-wide border border-[#A77B50]/40 shadow-sm">
            <Radio className="w-3.5 h-3.5 text-[#A77B50] animate-pulse" />
            {t('location_gate_badge')}
          </div>
        </div>

        {/* Central Visual Icon */}
        <div className="relative mx-auto w-20 h-20 mb-6 flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-[#ECE5DA] border border-[#51483D]/30 flex items-center justify-center relative shadow-inner">
            {locationPermissionStatus === 'denied' ? (
              <ShieldAlert className="w-10 h-10 text-[#B91C1C]" />
            ) : locationPermissionStatus === 'checking' ? (
              <RefreshCw className="w-10 h-10 text-[#A77B50] animate-spin" />
            ) : (
              <MapPin className="w-10 h-10 text-[#A77B50]" />
            )}
          </div>
        </div>

        {/* Headings */}
        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#252521] mb-2">
            {locationPermissionStatus === 'denied'
              ? t('location_gate_denied_title')
              : t('location_gate_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#A77B50] font-bold mb-3">
            {t('location_gate_subtitle')}
          </p>
          <p className="text-xs font-semibold text-[#51483D] leading-relaxed max-w-md mx-auto">
            {locationPermissionStatus === 'denied'
              ? t('location_gate_denied_desc')
              : t('location_gate_desc')}
          </p>
        </div>

        {/* Target Site Geofence Context Pill */}
        <div className="mb-6 p-4 rounded-2xl bg-[#ECE5DA] border border-[#51483D]/25 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#252521] text-[#A77B50] shrink-0">
            <Navigation className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-black text-[#252521] truncate">
              {primarySite.name}
            </div>
            <div className="text-[11px] font-semibold text-[#51483D] truncate">
              {primarySite.location} · {primarySite.geoCoordinates?.radiusMeters || 250}m Perimeter
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#51483D] text-[#F4F0E8]">
            Gate 1
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => requestLocationAccess()}
            disabled={locationPermissionStatus === 'checking'}
            className="w-full min-h-[46px] py-3 px-5 rounded-2xl font-black text-xs sm:text-sm bg-gradient-to-r from-[#A77B50] to-[#8E653C] text-[#F4F0E8] shadow-[0_6px_20px_-2px_rgba(167,123,80,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {locationPermissionStatus === 'checking' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t('location_gate_checking')}</span>
              </>
            ) : locationPermissionStatus === 'denied' ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>{t('location_gate_btn_retry')}</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                <span>{t('location_gate_btn_grant')}</span>
              </>
            )}
          </motion.button>

          {/* Supervisor / Demo Fallback Override */}
          <div className="pt-2 border-t border-[#51483D]/20">
            <button
              type="button"
              onClick={() => overrideLocationWithDemoSite('proj-1')}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-2xl text-xs font-black text-[#252521] hover:text-[#A77B50] bg-[#ECE5DA] hover:bg-[#D8CCB9] border border-[#51483D]/30 transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
            >
              <ShieldCheck className="w-4 h-4 text-[#15803D]" />
              <span>{t('location_gate_demo_override_btn')}</span>
              <ChevronRight className="w-4 h-4 text-[#A77B50] group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[10px] text-center font-semibold text-[#96938B] mt-2">
              {t('location_gate_demo_override_desc')}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer Info */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between text-[11px] font-semibold text-[#51483D] pt-4 z-10 gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#A77B50]" />
          <span>BuildEase Construction Management Platform · v2.4 Enterprise</span>
        </div>
        <div>
          <span>ISO 27001 & Biometric Muster Data Protection</span>
        </div>
      </div>
    </div>
  );
};
