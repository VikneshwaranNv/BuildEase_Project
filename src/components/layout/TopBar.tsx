import React, { useState, useRef, useEffect } from 'react';
import { Menu, Globe, ChevronDown, Check, UserCheck, ShieldCheck, Radio, LogOut, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LANGUAGES } from '../../i18n/translations';
import { LanguageCode, UserRole } from '../../types';

interface TopBarProps {
  onOpenMobileNav: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileNav }) => {
  const { role, setRole, language, setLanguage, activeNav, t, currentUser, logout } = useApp();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ROLES_LIST: { id: UserRole; titleKey: string; hintKey: string }[] = [
    { id: 'contractor', titleKey: 'role_contractor', hintKey: 'role_hint_contractor' },
    { id: 'project_manager', titleKey: 'role_project_manager', hintKey: 'role_hint_pm' },
    { id: 'site_supervisor', titleKey: 'role_site_supervisor', hintKey: 'role_hint_supervisor' },
    { id: 'worker', titleKey: 'role_worker', hintKey: 'role_hint_worker' },
  ];

  const currentLangObj = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <header className="h-18 bg-[#252521] border-b border-[#51483D]/40 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-[0_4px_20px_rgba(37,37,33,0.2)]">
      {/* Zone 1: Context & Mobile Menu */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 text-[#96938B] hover:text-[#F4F0E8] hover:bg-[#51483D]/50 rounded-xl transition-colors cursor-pointer"
          aria-label={t('operations_menu')}
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2.5 text-xs">
          <span className="font-semibold text-[#96938B] hidden sm:inline">{t('brand_name')}</span>
          <span className="text-[#51483D] hidden sm:inline" aria-hidden="true">
            /
          </span>
          <span className="text-[#F4F0E8] font-extrabold tracking-tight text-sm">
            {t(`nav_${activeNav}`)}
          </span>
        </nav>
      </div>

      {/* Zone 2: Site Status Beacon + Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Real-time site telemetry indicator */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#51483D]/40 border border-[#51483D]/70 text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A77B50] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A77B50]"></span>
          </span>
          <span className="font-bold text-[#F4F0E8]">3D Field Telemetry: Active</span>
        </div>

        {/* Language Selector */}
        <div className="relative" ref={langRef}>
          <button
            type="button"
            onClick={() => {
              setLangMenuOpen(!langMenuOpen);
              setRoleMenuOpen(false);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[38px] text-xs font-bold text-[#F4F0E8] bg-[#51483D]/50 hover:bg-[#51483D] border border-[#51483D]/80 rounded-2xl transition-all cursor-pointer shadow-sm active:scale-95"
            aria-expanded={langMenuOpen}
            aria-label={t('select_language_title')}
          >
            <Globe className="w-3.5 h-3.5 text-[#A77B50]" />
            <span className="hidden xs:inline">{currentLangObj.nativeName}</span>
            <span className="xs:hidden">{currentLangObj.code.toUpperCase()}</span>
            <ChevronDown className="w-3 h-3 text-[#96938B]" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#252521] border border-[#51483D] rounded-2xl shadow-popover py-1.5 z-50 overflow-hidden">
              <div className="px-3.5 py-2 text-[10px] font-black text-[#96938B] uppercase tracking-wider border-b border-[#51483D]/50">
                {t('select_language_title')}
              </div>
              <div className="max-h-64 overflow-y-auto py-1">
                {LANGUAGES.map((lang) => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.code as LanguageCode);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#A77B50] text-[#F4F0E8] font-bold'
                          : 'text-[#F4F0E8] hover:bg-[#51483D]/60'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-bold">{lang.nativeName}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-[#F4F0E8]/80' : 'text-[#96938B]'}`}>
                          {lang.label}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#F4F0E8]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => {
              setRoleMenuOpen(!roleMenuOpen);
              setLangMenuOpen(false);
            }}
            className="inline-flex items-center gap-2.5 px-3.5 py-2 min-h-[38px] text-xs font-bold text-[#F4F0E8] bg-gradient-to-r from-[#A77B50] to-[#8E653C] hover:opacity-95 rounded-2xl transition-all cursor-pointer shadow-[0_4px_16px_rgba(167,123,80,0.35)] active:scale-95"
            aria-expanded={roleMenuOpen}
            aria-label={t('select_role_title')}
          >
            <div className="w-5 h-5 rounded-full bg-[#252521]/40 text-[#F4F0E8] flex items-center justify-center font-black text-[10px]">
              {role.charAt(0).toUpperCase()}
            </div>
            <span className="font-extrabold hidden sm:inline">{t(`role_${role}`)}</span>
            <ChevronDown className="w-3 h-3 text-[#F4F0E8]/80" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#252521] border border-[#51483D] rounded-2xl shadow-popover py-1.5 z-50 overflow-hidden">
              {/* Authenticated User Profile Summary */}
              {currentUser && (
                <div className="px-4 py-3 bg-[#1c1b18] border-b border-[#51483D]/60 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#A77B50] text-[#252521] font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                    {currentUser.avatar || currentUser.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-[#F4F0E8] truncate leading-tight">
                      {currentUser.fullName}
                    </p>
                    <p className="text-[10px] text-[#A77B50] font-bold uppercase tracking-wider truncate">
                      {currentUser.role.replace('_', ' ')}
                    </p>
                    <p className="text-[10px] text-[#96938B] truncate">
                      {currentUser.email || currentUser.phone}
                    </p>
                  </div>
                </div>
              )}

              <div className="px-4 py-2 text-[10px] font-black text-[#96938B] uppercase tracking-wider border-b border-[#51483D]/40">
                Switch Operational Role
              </div>
              <div className="py-1">
                {ROLES_LIST.map((r) => {
                  const isSelected = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setRole(r.id);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 px-4 py-2.5 text-left cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#51483D] text-[#F4F0E8]'
                          : 'text-[#F4F0E8] hover:bg-[#51483D]/50'
                      }`}
                    >
                      <UserCheck
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isSelected ? 'text-[#A77B50]' : 'text-[#96938B]'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-extrabold flex items-center justify-between">
                          <span className={isSelected ? 'text-[#A77B50]' : 'text-[#F4F0E8]'}>
                            {t(r.titleKey)}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#A77B50]" />}
                        </div>
                        <p className="text-[11px] text-[#96938B] mt-0.5 line-clamp-1">{t(r.hintKey)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Sign Out Action */}
              <div className="p-2 border-t border-[#51483D]/60 bg-[#1c1b18]/60">
                <button
                  type="button"
                  onClick={() => {
                    setRoleMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#B91C1C]/15 hover:bg-[#B91C1C]/25 text-[#fca5a5] border border-[#B91C1C]/30 text-xs font-bold transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Jobsite</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
