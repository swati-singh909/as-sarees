// Where the website reads its data from.
//
// By default the site reads the three tabs of the A.S. Sarees Google Sheet
// (sarees, fabrics, settings) by the sheet's ID. The sheet must be shared as
// "Anyone with the link → Viewer". If a tab is missing or the sheet can't be
// reached, the sample files in /public/data are used instead.
export const SHEET_ID =
  import.meta.env.VITE_SHEET_ID ?? '1kekePlcqmymoZdaXF8ajZm99yNO_Bx5FDVh2VzR_6sE';

function tabUrl(tab) {
  if (!SHEET_ID) return '';
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1&sheet=${encodeURIComponent(tab)}`;
}

export const SOURCES = {
  sarees: {
    url: import.meta.env.VITE_SAREES_CSV_URL || tabUrl('sarees'),
    sample: '/data/sarees.csv',
    required: ['name'],
  },
  fabrics: {
    url: import.meta.env.VITE_FABRICS_CSV_URL || tabUrl('fabrics'),
    sample: '/data/fabrics.csv',
    required: ['name'],
  },
  settings: {
    url: import.meta.env.VITE_SETTINGS_CSV_URL || tabUrl('settings'),
    sample: '/data/settings.csv',
    required: ['key', 'value'],
  },
};

// Used only if the settings tab is missing a value.
export const DEFAULT_SETTINGS = {
  shop_name: 'A.S. Sarees',
  tagline: 'विरासत जो पहनी जाये',
  whatsapp_number: '917985309411',
  phone_number: '+919389990548',
  address: 'N. 12/340-K-S, Shivratanpur, Bazardiha (Shiv Nagar Colony, in front of Dev Apartment), Lakhraon, Varanasi',
  hours: '',
  maps_url: '',
  gstin: '09AWTPP1361N1ZP',
  announcement: 'All kinds of Banarasi sarees & suits · Order on WhatsApp',
  video_call: 'yes',
};
