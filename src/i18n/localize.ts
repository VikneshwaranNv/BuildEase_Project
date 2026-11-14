/**
 * Domain-specific localization helpers for BuildEase
 * Translates categories, units, site names, project titles, notes, and alerts across all 5 languages
 */

export function localizeUnit(unit: string | undefined | null, t: (key: string, params?: Record<string, string | number>) => string): string {
  if (!unit) return '';
  const clean = unit.trim().toLowerCase();
  
  if (clean === 'bags' || clean === 'bag') return t('unit_bags');
  if (clean === 'mt' || clean === 'ton' || clean === 'tons') return t('unit_mt');
  if (clean === 'm³' || clean === 'cu.m' || clean === 'm3' || clean === 'cum') return t('unit_cum');
  if (clean === 'sheets' || clean === 'sheet') return t('unit_sheets');
  if (clean === 'units' || clean === 'unit') return t('unit_units');
  if (clean === 'sq.m' || clean === 'sqm' || clean === 'sq m') return t('unit_sqm');
  if (clean === 'm' || clean === 'meter' || clean === 'meters') return t('unit_m');
  if (clean === 'hrs' || clean === 'hr' || clean === 'hours' || clean === 'hour') return t('unit_hrs');
  if (clean === 'days' || clean === 'day') return t('unit_days');
  if (clean === 'ot') return t('unit_ot');
  if (clean === 'workers' || clean === 'worker') return t('unit_workers');
  
  return unit;
}

export function localizeCategory(category: string | undefined | null, t: (key: string) => string): string {
  if (!category) return '';
  const key = `materials_cat_${category.toLowerCase()}`;
  const translated = t(key);
  return translated !== key ? translated : category;
}

export function localizeSite(siteIdOrName: string | undefined | null, t: (key: string) => string): string {
  if (!siteIdOrName) return '';
  const str = siteIdOrName.toLowerCase();
  
  if (str.includes('metro') || str.includes('pier') || str === 'proj-1' || str === 'proj_1') {
    return t('site_proj_1');
  }
  if (str.includes('horizon') || str.includes('tower') || str === 'proj-2' || str === 'proj_2') {
    return t('site_proj_2');
  }
  if (str.includes('greenfield') || str.includes('bypass') || str === 'proj-3' || str === 'proj_3') {
    return t('site_proj_3');
  }
  if (str.includes('riverside') || str.includes('logistics') || str === 'proj-4' || str === 'proj_4') {
    return t('site_proj_4');
  }
  
  return siteIdOrName;
}

export function localizeSiteFull(siteIdOrName: string | undefined | null, t: (key: string) => string): string {
  if (!siteIdOrName) return '';
  const str = siteIdOrName.toLowerCase();
  
  if (str.includes('metro') || str.includes('pier') || str === 'proj-1' || str === 'proj_1') {
    return t('site_proj_1_full');
  }
  if (str.includes('horizon') || str.includes('tower') || str === 'proj-2' || str === 'proj_2') {
    return t('site_proj_2_full');
  }
  if (str.includes('greenfield') || str.includes('bypass') || str === 'proj-3' || str === 'proj_3') {
    return t('site_proj_3_full');
  }
  if (str.includes('riverside') || str.includes('logistics') || str === 'proj-4' || str === 'proj_4') {
    return t('site_proj_4_full');
  }
  
  return siteIdOrName;
}

export function localizeLocation(siteIdOrLoc: string | undefined | null, defaultLoc: string, t: (key: string) => string): string {
  const str = (siteIdOrLoc || defaultLoc).toLowerCase();
  
  if (str.includes('eastern') || str.includes('sector 7') || str === 'proj-1' || str === 'proj_1') {
    return t('loc_proj_1');
  }
  if (str.includes('midc') || str.includes('pune') || str === 'proj-2' || str === 'proj_2') {
    return t('loc_proj_2');
  }
  if (str.includes('outer ring') || str.includes('nagpur') || str === 'proj-3' || str === 'proj_3') {
    return t('loc_proj_3');
  }
  if (str.includes('nashik') || str === 'proj-4' || str === 'proj_4') {
    return t('loc_proj_4');
  }
  
  return defaultLoc;
}

export function localizeMaterialItem(itemId: string, defaultName: string, t: (key: string) => string): string {
  const normalizedId = itemId.replace('-', '_');
  const key = `mat_item_${normalizedId}`;
  const translated = t(key);
  if (translated !== key) return translated;
  
  const str = defaultName.toLowerCase();
  if (str.includes('cement') || str.includes('opc')) return t('mat_item_mat_1');
  if (str.includes('rebar') || str.includes('fe500d')) return t('mat_item_mat_2');
  if (str.includes('basalt') || str.includes('aggregate')) return t('mat_item_mat_3');
  if (str.includes('sand') || str.includes('river')) return t('mat_item_mat_4');
  if (str.includes('plywood') || str.includes('shuttering')) return t('mat_item_mat_5');
  if (str.includes('helmet') || str.includes('safety')) return t('mat_item_mat_6');
  
  return defaultName;
}

export function localizeTaskTitle(taskId: string, defaultTitle: string, t: (key: string) => string): string {
  const normalizedId = taskId.replace('-', '_').replace('tsk_', 'task_');
  const key = `task_title_${normalizedId}`;
  const translated = t(key);
  if (translated !== key) return translated;

  const str = defaultTitle.toLowerCase();
  if (str.includes('pier 28') || str.includes('cap beam')) return t('task_title_task_1');
  if (str.includes('pier 29') || str.includes('rebar cage')) return t('task_title_task_2');
  if (str.includes('floor 6') || str.includes('shuttering')) return t('task_title_task_3');
  if (str.includes('culvert') || str.includes('subgrade')) return t('task_title_task_4');
  if (str.includes('earthing') || str.includes('conduiting')) return t('task_title_task_5');

  return defaultTitle;
}

export function localizeDocumentTitle(docId: string, defaultTitle: string, t: (key: string) => string): string {
  const normalizedId = docId.replace('-', '_');
  const key = `doc_title_${normalizedId}`;
  const translated = t(key);
  if (translated !== key) return translated;

  const str = defaultTitle.toLowerCase();
  if (str.includes('pier reinforcement') || str.includes('structural pier') || str.includes('rev-c')) return t('doc_title_doc_1');
  if (str.includes('hot work') || str.includes('arc welding') || str.includes('rebar reinforcement')) return t('doc_title_doc_2');
  if (str.includes('cube test') || str.includes('batch mix')) return t('doc_title_doc_3');
  if (str.includes('substation') || str.includes('power')) return t('doc_title_doc_4');
  if (str.includes('excavation') || str.includes('shoring')) return t('doc_title_doc_5');

  return defaultTitle;
}

export function localizeAttendanceNote(note: string | undefined | null, t: (key: string) => string): string {
  if (!note) return '';
  const str = note.toLowerCase();
  
  if (str.includes('awaiting shift') || str.includes('muster check')) {
    return t('note_awaiting_shift');
  }
  if (str.includes('self-kiosk')) {
    return t('note_kiosk_scan');
  }
  if (str.includes('late arrival') || str.includes('transit delay')) {
    return t('note_late_arrival');
  }
  if (str.includes('supervisor verification pending')) {
    return t('note_kiosk_pending');
  }
  
  return note;
}

export function localizeAlertMessage(
  alertIdOrMsg: string,
  defaultMsgOrT: string | ((key: string) => string),
  maybeT?: (key: string) => string
): string {
  let t: (key: string) => string;
  let defaultMsg = alertIdOrMsg;
  let id = alertIdOrMsg;

  if (typeof defaultMsgOrT === 'function') {
    t = defaultMsgOrT;
    defaultMsg = alertIdOrMsg;
  } else {
    defaultMsg = defaultMsgOrT;
    t = maybeT || ((k: string) => k);
  }

  // Check by ID first
  if (id === 'alert-1' || id === 'al-1') {
    return t('alert_msg_al_1');
  }
  if (id === 'alert-2') {
    return t('alert_msg_alert_2');
  }
  if (id === 'alert-3') {
    return t('alert_msg_alert_3');
  }
  if (id === 'al-2') {
    return t('alert_msg_al_2');
  }
  if (id === 'al-3') {
    return t('alert_msg_al_3');
  }

  const normalizedId = id.replace('-', '_');
  const key = `alert_msg_${normalizedId}`;
  const translated = t(key);
  if (translated !== key) {
    return translated;
  }

  // Check by message pattern
  const msgLower = defaultMsg.toLowerCase();
  if (msgLower.includes('river sand') || msgLower.includes('14 m³')) {
    return t('alert_msg_al_1');
  }
  if (msgLower.includes('raw check-in') || msgLower.includes('muster sign-off')) {
    return t('alert_msg_alert_2');
  }
  if (msgLower.includes('culvert section') || msgLower.includes('equipment operator')) {
    return t('alert_msg_alert_3');
  }
  if (msgLower.includes('pier 28') && msgLower.includes('beam')) {
    return t('alert_msg_al_2');
  }
  if (msgLower.includes('heavy rain') || msgLower.includes('pune midc')) {
    return t('alert_msg_al_3');
  }
  if (msgLower.includes('pier 24') && (msgLower.includes('geofence') || msgLower.includes('attendance'))) {
    return t('alert_msg_alt_1');
  }
  if (msgLower.includes('opc 53') || msgLower.includes('reorder threshold')) {
    return t('alert_msg_alt_2');
  }

  return defaultMsg;
}

export function localizePeriod(period: string, t: (key: string) => string): string {
  if (period.includes('Oct 01') && period.includes('Oct 15')) {
    return t('period_oct_1_15_2026');
  }
  if (period.includes('Sep 16') && period.includes('Sep 30')) {
    return t('period_sep_16_30_2026');
  }
  return period;
}

export function localizeSeverity(severity: string | undefined | null, t: (key: string) => string): string {
  if (!severity) return '';
  const clean = severity.toLowerCase();
  if (clean === 'high') return t('severity_high');
  if (clean === 'medium') return t('severity_medium');
  if (clean === 'low') return t('severity_low');
  return severity.toUpperCase();
}

