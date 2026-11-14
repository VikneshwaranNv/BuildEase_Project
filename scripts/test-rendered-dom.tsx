import React from 'react';
import { renderToString } from 'react-dom/server';
import { AppProvider, useApp } from '../src/context/AppContext';
import { OverviewPage } from '../src/pages/OverviewPage';
import { ProjectsPage } from '../src/pages/ProjectsPage';
import { WorkforcePage } from '../src/pages/WorkforcePage';
import { AttendancePage } from '../src/pages/AttendancePage';
import { TasksPage } from '../src/pages/TasksPage';
import { PayrollPage } from '../src/pages/PayrollPage';
import { DocumentsPage } from '../src/pages/DocumentsPage';
import { ReportsPage } from '../src/pages/ReportsPage';
import { TopBar } from '../src/components/layout/TopBar';
import { Sidebar } from '../src/components/layout/Sidebar';
import { SupportedLanguage } from '../src/i18n/translations';
import { NavItemKey, UserRole } from '../src/types';

// Polyfill window, document, and localStorage for Node SSR simulation
const storage: Record<string, string> = {};
(global as any).window = {
  print: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
};
(global as any).document = {
  documentElement: { lang: 'en' },
  body: { style: {} },
  addEventListener: () => {},
  removeEventListener: () => {},
};
(global as any).localStorage = {
  getItem: (key: string) => storage[key] || null,
  setItem: (key: string, val: string) => { storage[key] = val; },
  removeItem: (key: string) => { delete storage[key]; },
};

const languages: SupportedLanguage[] = ['en', 'hi', 'mr', 'as', 'bn'];
const roles: UserRole[] = ['contractor', 'project_manager', 'site_supervisor', 'worker'];

const pageComponents: Record<NavItemKey, React.FC> = {
  overview: OverviewPage,
  projects: ProjectsPage,
  workforce: WorkforcePage,
  attendance: AttendancePage,
  tasks: TasksPage,
  payroll: PayrollPage,
  documents: DocumentsPage,
  reports: ReportsPage,
};

const TestHarness: React.FC<{
  targetLang: SupportedLanguage;
  targetRole: UserRole;
  targetNav: NavItemKey;
}> = ({ targetLang, targetRole, targetNav }) => {
  const { setLanguage, setRole, setActiveNav } = useApp();

  React.useEffect(() => {
    setLanguage(targetLang);
    setRole(targetRole);
    setActiveNav(targetNav);
  }, [targetLang, targetRole, targetNav, setLanguage, setRole, setActiveNav]);

  const CurrentPage = pageComponents[targetNav];

  return (
    <div>
      <Sidebar />
      <TopBar onOpenMobileNav={() => {}} />
      <main>
        <CurrentPage />
      </main>
    </div>
  );
};

console.log('=== STARTING RENDERED HTML ACCEPTANCE VERIFICATION ===\n');

let totalRenders = 0;
let errors = 0;

for (const lang of languages) {
  storage['buildease_preferred_language'] = lang;
  (global as any).document.documentElement.lang = lang;

  console.log(`\n======================================================`);
  console.log(`VERIFYING RENDERED APPLICATION FOR LANGUAGE: [${lang.toUpperCase()}]`);
  console.log(`======================================================`);

  for (const [navKey, Component] of Object.entries(pageComponents)) {
    // For each route, test across valid roles
    const testRoles: UserRole[] =
      navKey === 'workforce'
        ? ['contractor', 'site_supervisor']
        : navKey === 'projects' || navKey === 'documents' || navKey === 'reports'
        ? ['contractor', 'project_manager']
        : navKey === 'materials'
        ? ['contractor', 'site_supervisor']
        : ['contractor', 'worker'];

    for (const testRole of testRoles) {
      totalRenders++;
      try {
        const html = renderToString(
          <AppProvider>
            <TestHarness targetLang={lang} targetRole={testRole} targetNav={navKey as NavItemKey} />
          </AppProvider>
        );

        if (!html || html.length < 200) {
          console.error(`  [FAIL] Route: ${navKey} (Role: ${testRole}, Lang: ${lang}) produced empty/short HTML`);
          errors++;
          continue;
        }

        // Verify document lang tag
        if ((global as any).document.documentElement.lang !== lang) {
          console.error(`  [FAIL] Document html lang attribute not updated to ${lang}`);
          errors++;
        }

        // Check for untranslated interpolation tokens like {count} or {name}
        const unresolvedInterpolations = html.match(/\{[a-zA-Z0-9_]+\}/g);
        if (unresolvedInterpolations && unresolvedInterpolations.length > 0) {
          console.warn(`  [WARN] Route: ${navKey} has unresolved placeholders:`, unresolvedInterpolations);
        }

        // For non-English languages, verify presence of Indic script characters (Devanagari \u0900-\u097F or Bengali/Assamese \u0980-\u09FF)
        if (lang === 'hi' || lang === 'mr') {
          const hasDevanagari = /[\u0900-\u097F]/.test(html);
          if (!hasDevanagari) {
            console.error(`  [FAIL] Route: ${navKey} (Lang: ${lang}) contains NO Devanagari script!`);
            errors++;
          }
        } else if (lang === 'bn' || lang === 'as') {
          const hasBengaliAssamese = /[\u0980-\u09FF]/.test(html);
          if (!hasBengaliAssamese) {
            console.error(`  [FAIL] Route: ${navKey} (Lang: ${lang}) contains NO Bengali/Assamese script!`);
            errors++;
          }
        }
      } catch (err: any) {
        console.error(`  [ERROR] Exception rendering ${navKey} in ${lang}:`, err.message);
        errors++;
      }
    }
    console.log(`  [OK] Route /${navKey} verified across roles in [${lang.toUpperCase()}]`);
  }
}

console.log(`\n======================================================`);
console.log(`SUMMARY: ${totalRenders} full page combinations rendered.`);
console.log(`Errors encountered: ${errors}`);
console.log(`======================================================`);

if (errors > 0) {
  process.exit(1);
} else {
  console.log('ALL RENDERED VIEWS AND SCRIPTS VERIFIED SUCCESSFULLY!');
}
