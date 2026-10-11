import Crest from './Crest.jsx';
import { paths } from '../lib/router.js';
import { phoneLink, prettyPhone, whatsappLink } from '../lib/contact.js';
import { useCatalog } from '../data/CatalogContext.jsx';

export default function Footer() {
  const { settings, fabrics } = useCatalog();
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="footer__logo">
            <Crest size={34} />
            <span className="footer__name">{settings.shop_name}</span>
          </span>
          {settings.tagline && <span className="footer__tagline">{settings.tagline}</span>}
          <span>Deals in all kinds of Banarasi sarees &amp; suits.</span>
        </div>

        {fabrics.length > 0 && (
          <div className="footer__col">
            <span className="footer__head">Fabrics</span>
            {fabrics.slice(0, 6).map((f) => (
              <a key={f.id} href={paths.fabric(f.id)}>
                {f.name}
              </a>
            ))}
          </div>
        )}

        <div className="footer__col">
          <span className="footer__head">Contact</span>
          <a href={phoneLink(settings.phone_number)}>Call: {prettyPhone(settings.phone_number)}</a>
          <a href={whatsappLink(settings.whatsapp_number)} target="_blank" rel="noopener">
            WhatsApp: {prettyPhone(settings.whatsapp_number)}
          </a>
          {settings.gstin && <span>GSTIN: {settings.gstin}</span>}
        </div>
      </div>
      <div className="container footer__legal">
        © {new Date().getFullYear()} {settings.shop_name}, Varanasi
      </div>
    </footer>
  );
}
