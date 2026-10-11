// WhatsApp click-to-chat: https://wa.me/<digits>?text=<url-encoded message>
export function whatsappLink(number, message) {
  const digits = String(number || '').replace(/\D/g, '');
  const text = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${digits}${text}`;
}

export function phoneLink(number) {
  const cleaned = String(number || '').replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
}

// "+919389990548" → "93899 90548"
export function prettyPhone(number) {
  const digits = String(number || '').replace(/\D/g, '');
  const local = digits.length > 10 ? digits.slice(-10) : digits;
  return local.length === 10 ? `${local.slice(0, 5)} ${local.slice(5)}` : String(number || '');
}

export function mapsLink(settings) {
  if (settings.maps_url) return settings.maps_url;
  const query = `${settings.shop_name}, ${settings.address}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const rupee = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export function formatPrice(value) {
  return value === null || value === undefined ? '' : rupee.format(value);
}

export function yesSetting(value) {
  return ['yes', 'y', 'true', '1', 'on'].includes(String(value || '').trim().toLowerCase());
}

// Full link to a page of this site, for WhatsApp messages.
export function pageUrl(hash) {
  return `${window.location.origin}${window.location.pathname}${hash}`;
}
