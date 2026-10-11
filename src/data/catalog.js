import Papa from 'papaparse';
import { SOURCES, DEFAULT_SETTINGS } from '../config.js';

const CACHE_KEY = 'as_catalog_v1';

export function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function clean(value) {
  return String(value ?? '').trim();
}

function toNumber(value) {
  const cleaned = String(value ?? '').replace(/[^0-9.]/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function yes(value) {
  return ['yes', 'y', 'true', '1'].includes(clean(value).toLowerCase());
}

// Hidden when the cell says no/false/0; shown when empty.
function shown(value) {
  const v = clean(value).toLowerCase();
  return !v || !['no', 'n', 'false', '0', 'hide'].includes(v);
}

function imageUrl(name) {
  const value = clean(name);
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `/images/${value.replace(/^\/+/, '')}`;
}

function list(value) {
  return clean(value)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

async function fetchRows(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Could not load ${url} (${response.status})`);
  const text = await response.text();
  const parsed = Papa.parse(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
  });
  return { rows: parsed.data, fields: parsed.meta.fields || [] };
}

// Reads one tab of the sheet. A tab that is missing (or has the wrong
// headers) falls back to the sample file, so the site never shows empty.
// A network failure is thrown, so the last saved copy can be kept.
async function loadTab(source) {
  if (source.url) {
    const { rows, fields } = await fetchRows(source.url);
    if (source.required.every((f) => fields.includes(f))) return rows;
  }
  const { rows } = await fetchRows(source.sample);
  return rows;
}

// One sheet row = one saree.
export function buildSarees(rows) {
  const seen = new Set();
  return rows
    .map((row, index) => {
      const name = clean(row.name);
      if (!name || !shown(row.show)) return null;
      let code = clean(row.code) || slugify(name);
      if (seen.has(code.toLowerCase())) code = `${code}-${index + 1}`;
      seen.add(code.toLowerCase());
      const fabric = clean(row.fabric);
      return {
        code,
        name,
        fabric,
        fabricId: slugify(fabric),
        colour: clean(row.colour || row.color),
        colours: list(row.colours || row.colors),
        price: toNumber(row.price),
        mrp: toNumber(row.mrp),
        images: [row.image, row.image2, row.image3, row.image4].map(imageUrl).filter(Boolean),
        occasion: clean(row.occasion),
        weave: clean(row.weave),
        zari: clean(row.zari),
        length: clean(row.length),
        blouse: clean(row.blouse),
        care: clean(row.care),
        note: clean(row.note),
        isNew: yes(row.new),
        sort: toNumber(row.sort) ?? 1000 + index,
        order: index,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.sort - b.sort || a.order - b.order);
}

// One row per fabric tile. Fabrics used by sarees but missing from the tab
// are added automatically (without a picture).
export function buildFabrics(rows, sarees) {
  const fabrics = rows
    .map((row, index) => {
      const name = clean(row.name);
      if (!name || !shown(row.show)) return null;
      return {
        id: slugify(row.id || name),
        name,
        hindi: clean(row.hindi),
        image: imageUrl(row.image),
        about: clean(row.about),
        sort: toNumber(row.sort) ?? 1000 + index,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.sort - b.sort);

  const known = new Set(fabrics.map((f) => f.id));
  sarees.forEach((s) => {
    if (s.fabricId && !known.has(s.fabricId)) {
      known.add(s.fabricId);
      fabrics.push({ id: s.fabricId, name: s.fabric, hindi: '', image: '', about: '', sort: 9999 });
    }
  });

  // Saree count per fabric, so tiles can show it.
  return fabrics.map((f) => ({ ...f, count: sarees.filter((s) => s.fabricId === f.id).length }));
}

export function buildSettings(rows) {
  const settings = { ...DEFAULT_SETTINGS };
  rows.forEach((row) => {
    const key = clean(row.key).toLowerCase();
    const value = clean(row.value);
    if (key && value) settings[key] = value;
  });
  return settings;
}

export function readCache() {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked: the site still works without the cache */
  }
}

function assemble(sareeRows, fabricRows, settingRows) {
  const sarees = buildSarees(sareeRows);
  return {
    sarees,
    fabrics: buildFabrics(fabricRows, sarees),
    settings: buildSettings(settingRows),
    loadedAt: new Date().toISOString(),
  };
}

export async function loadCatalog() {
  const [sareeRows, fabricRows, settingRows] = await Promise.all([
    loadTab(SOURCES.sarees),
    loadTab(SOURCES.fabrics),
    loadTab(SOURCES.settings).catch(() => []),
  ]);
  const data = assemble(sareeRows, fabricRows, settingRows);
  writeCache(data);
  return data;
}

// Used when the sheet can't be reached and nothing is saved on the phone yet.
export async function loadSample() {
  const [s, f, t] = await Promise.all([
    fetchRows(SOURCES.sarees.sample),
    fetchRows(SOURCES.fabrics.sample),
    fetchRows(SOURCES.settings.sample).catch(() => ({ rows: [] })),
  ]);
  return assemble(s.rows, f.rows, t.rows);
}
