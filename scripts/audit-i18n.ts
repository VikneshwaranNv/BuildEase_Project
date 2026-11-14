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
const enKeys = Object.keys(translations.en);

console.log(`=== I18N AUDIT START ===`);
console.log(`Total keys in English (en): ${enKeys.length}`);

const keyCounts: Record<SupportedLanguage, number> = {
  en: enKeys.length,
  hi: 0,
  mr: 0,
  as: 0,
  bn: 0,
};

let hasErrors = false;

for (const lang of languages) {
  const dict = translations[lang];
  const keys = Object.keys(dict);
  keyCounts[lang] = keys.length;

  console.log(`\nChecking language: ${lang} (total keys: ${keys.length})`);

  // Check missing keys
  const missingKeys = enKeys.filter((k) => !(k in dict));
  if (missingKeys.length > 0) {
    console.error(`  [ERROR] Missing keys in ${lang} (${missingKeys.length}):`, missingKeys);
    hasErrors = true;
  } else {
    console.log(`  [OK] No missing keys in ${lang}`);
  }

  // Check empty values
  const emptyKeys = keys.filter((k) => !dict[k as keyof typeof dict] || dict[k as keyof typeof dict].trim() === '');
  if (emptyKeys.length > 0) {
    console.error(`  [ERROR] Empty keys in ${lang}:`, emptyKeys);
    hasErrors = true;
  } else {
    console.log(`  [OK] No empty values in ${lang}`);
  }

  // Test localize helpers
  const t = (key: string, params?: Record<string, string | number>) => {
    let text = dict[key as keyof typeof dict] || translations.en[key as keyof typeof translations.en] || key;
    if (params) {
      Object.entries(params).forEach(([pk, pv]) => {
        text = text.replace(new RegExp(`{${pk}}`, 'g'), String(pv));
      });
    }
    return text;
  };

  const testCategory = localizeCategory('cement', t);
  const testUnit = localizeUnit('m³', t);
  const testSite = localizeSite('Metro Line 4 - Pier 12-24', t);
  const testSeverity = localizeSeverity('high', t);
  const testPeriod = localizePeriod('Oct 01 – Oct 15, 2026', t);

  if (!testCategory || !testUnit || !testSite || !testSeverity || !testPeriod) {
    console.error(`  [ERROR] Localize helper returned empty for ${lang}`);
    hasErrors = true;
  } else {
    console.log(`  [OK] Helper sanity check passed for ${lang}:`);
    console.log(`       category(cement): "${testCategory}"`);
    console.log(`       unit(m³): "${testUnit}"`);
    console.log(`       severity(high): "${testSeverity}"`);
    console.log(`       period: "${testPeriod}"`);
  }
}

console.log(`\n=== SUMMARY OF KEY COUNTS ===`);
console.table(keyCounts);

if (hasErrors) {
  console.error(`\nFAILED: Translation audit found issues.`);
  process.exit(1);
} else {
  console.log(`\nPASSED: All 5 translation dictionaries are 100% complete and synchronized!`);
}
