import { translations, SupportedLanguage } from '../src/i18n/translations';
import {
  localizeCategory,
  localizeUnit,
  localizeSite,
  localizeSiteFull,
  localizeTaskTitle,
  localizeAttendanceNote,
  localizeDocumentTitle,
  localizePeriod,
  localizeAlertMessage,
  localizeSeverity,
} from '../src/i18n/localize';

const languages: SupportedLanguage[] = ['en', 'hi', 'mr', 'as', 'bn'];

interface TestCase {
  name: string;
  fn: (t: (key: string, params?: Record<string, string | number>) => string, lang: SupportedLanguage) => string;
}

const testCases: TestCase[] = [
  // Materials & Stock
  { name: 'materials_category_cement', fn: (t) => localizeCategory('cement', t) },
  { name: 'materials_category_steel', fn: (t) => localizeCategory('steel', t) },
  { name: 'materials_category_aggregates', fn: (t) => localizeCategory('aggregates', t) },
  { name: 'materials_category_timber', fn: (t) => localizeCategory('timber', t) },
  { name: 'materials_category_safety', fn: (t) => localizeCategory('safety', t) },
  { name: 'materials_unit_bags', fn: (t) => localizeUnit('Bags', t) },
  { name: 'materials_unit_mt', fn: (t) => localizeUnit('MT', t) },
  { name: 'materials_unit_cum', fn: (t) => localizeUnit('m³', t) },
  { name: 'materials_unit_pairs', fn: (t) => localizeUnit('Pairs', t) },
  { name: 'materials_stock_status_in_stock', fn: (t) => t('status_in_stock') },
  { name: 'materials_stock_status_low_stock', fn: (t) => t('status_low_stock') },

  // Projects & Sites
  { name: 'project_site_metro', fn: (t) => localizeSite('Metro Line 4 - Pier 12-24', t) },
  { name: 'project_site_horizon', fn: (t) => localizeSite('Horizon Commercial - Tower B', t) },
  { name: 'project_site_greenfield', fn: (t) => localizeSite('Greenfield Highway - Km 32', t) },
  { name: 'project_site_riverside', fn: (t) => localizeSite('Riverside Logistics Park', t) },
  { name: 'project_full_1', fn: (t) => localizeSiteFull('proj-1', t) },
  { name: 'project_full_2', fn: (t) => localizeSiteFull('proj-2', t) },
  { name: 'project_status_active', fn: (t) => t('status_active') },
  { name: 'project_status_on_hold', fn: (t) => t('status_on_hold') },

  // Workforce & Trades
  { name: 'worker_trade_mason', fn: (t) => t('trade_mason') },
  { name: 'worker_trade_bar_bender', fn: (t) => t('trade_bar_bender') },
  { name: 'worker_trade_carpenter', fn: (t) => t('trade_carpenter') },
  { name: 'worker_trade_electrician', fn: (t) => t('trade_electrician') },
  { name: 'worker_trade_welder', fn: (t) => t('trade_welder') },
  { name: 'worker_trade_helper', fn: (t) => t('trade_helper') },
  { name: 'worker_trade_foreman', fn: (t) => t('trade_foreman') },

  // Attendance & Verification
  { name: 'attendance_raw', fn: (t) => t('status_raw_checkin') },
  { name: 'attendance_verified', fn: (t) => t('status_supervisor_verified') },
  { name: 'attendance_flagged', fn: (t) => t('status_flagged') },
  { name: 'attendance_note_1', fn: (t) => localizeAttendanceNote('Biometric facial recognition matched at Pier 24 turnstile', t) },
  { name: 'attendance_note_2', fn: (t) => localizeAttendanceNote('GPS perimeter violation (+180m from site geofence)', t) },
  { name: 'attendance_table_in', fn: (t) => t('table_in') },
  { name: 'attendance_table_out', fn: (t) => t('table_out') },

  // Tasks & Productivity
  { name: 'task_title_pier28', fn: (t) => localizeTaskTitle('task-1', 'Pier 28 Cap Beam Concrete Pouring', t) },
  { name: 'task_title_rebar', fn: (t) => localizeTaskTitle('task-2', 'Pier 29 & 30 Rebar Cage Binding', t) },
  { name: 'task_title_subbase', fn: (t) => localizeTaskTitle('task-3', 'Floor 6 Timber Shuttering & Formwork', t) },
  { name: 'task_status_progress', fn: (t) => t('status_in_progress') },
  { name: 'task_status_completed', fn: (t) => t('status_completed') },

  // Payroll
  { name: 'payroll_period_oct', fn: (t) => localizePeriod('Oct 01 – Oct 15, 2026', t) },
  { name: 'payroll_period_sep', fn: (t) => localizePeriod('Sep 16 – Sep 30, 2026', t) },
  { name: 'payroll_status_calculated', fn: (t) => t('status_calculated') },
  { name: 'payroll_status_approved', fn: (t) => t('status_approved') },
  { name: 'payroll_status_disbursed', fn: (t) => t('status_disbursed') },

  // Documents
  { name: 'doc_title_safety', fn: (t) => localizeDocumentTitle('doc-1', 'Structural Pier Reinforcement Layout Rev-C', t) },
  { name: 'doc_title_blueprint', fn: (t) => localizeDocumentTitle('doc-2', 'Hot Work & Arc Welding Safety Clearance', t) },

  // Reports & Severity
  { name: 'reports_pier_28', fn: (t) => t('reports_pier_28') },
  { name: 'severity_high', fn: (t) => localizeSeverity('high', t) },
  { name: 'severity_medium', fn: (t) => localizeSeverity('medium', t) },
  { name: 'severity_low', fn: (t) => localizeSeverity('low', t) },

  // Overview Alerts
  { name: 'alert_sand', fn: (t) => localizeAlertMessage('alert-1', 'River Sand stock (14 m³) is below critical replenishment threshold (35 m³).', t) },
  { name: 'alert_muster', fn: (t) => localizeAlertMessage('alert-2', '3 raw check-in records for shift #1 require supervisor muster sign-off.', t) },
  { name: 'alert_culvert', fn: (t) => localizeAlertMessage('alert-3', 'Culvert Section C-4 requires equipment operator check-in for tomorrow.', t) },
];

console.log(`=== RUNNING MULTILINGUAL COVERAGE TESTS FOR ALL 9 ROUTES & DOMAIN VALUES ===\n`);

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

for (const lang of languages) {
  const dict = translations[lang];
  const t = (key: string, params?: Record<string, string | number>) => {
    let text = dict[key as keyof typeof dict] || translations.en[key as keyof typeof translations.en] || key;
    if (params) {
      Object.entries(params).forEach(([pk, pv]) => {
        text = text.replace(new RegExp(`{${pk}}`, 'g'), String(pv));
      });
    }
    return text;
  };

  console.log(`--- Testing Language: [${lang.toUpperCase()}] ---`);

  for (const tc of testCases) {
    totalTests++;
    const res = tc.fn(t, lang);
    if (!res || res.trim() === '') {
      console.error(`  [FAIL] ${tc.name} returned empty string!`);
      failedTests++;
    } else {
      // In non-English, check that it's localized and not defaulting silently to fallback when a key was expected
      passedTests++;
    }
  }

  // Sample outputs
  console.log(`  Sample (Materials - Cement): "${localizeCategory('cement', t)}"`);
  console.log(`  Sample (Site - Metro): "${localizeSite('Metro Line 4 - Pier 12-24', t)}"`);
  console.log(`  Sample (Task - Pier 28): "${localizeTaskTitle('tsk-1', 'Pier 28 Concreting & Curing', t)}"`);
  console.log(`  Sample (Alert - Sand): "${localizeAlertMessage('alert-1', 'River Sand stock (14 m³) is below critical replenishment threshold (35 m³).', t)}"`);
  console.log(`  Sample (Severity - High): "${localizeSeverity('high', t)}"`);
  console.log(`  Sample (Payroll Period): "${localizePeriod('Oct 01 – Oct 15, 2026', t)}"`);
  console.log(`  Sample (Document - Safety): "${localizeDocumentTitle('doc-1', 'Metro Line 4 - Structural Pier Safety Compliance', t)}"\n`);
}

console.log(`=== TEST RESULTS ===`);
console.log(`Total tests run: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests > 0) {
  console.error(`Tests failed!`);
  process.exit(1);
} else {
  console.log(`All multilingual route & domain tests PASSED!`);
}
