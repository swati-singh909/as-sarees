import Icon from './Icon.jsx';
import Crest from './Crest.jsx';
import { goToSection, paths } from '../lib/router.js';
import { phoneLink, whatsappLink } from '../lib/contact.js';
import { useCatalog } from '../data/CatalogContext.jsx';

const NAV = [
  { id: 'fabrics', label: 'Shop by fabric' },
  { id: 'festive', label: 'Festive edit' },
  { id: 'new', label: 'New in' },
  { id: 'order', label: 'How to order' },
  { id: 'visit', label: 'Visit shop' },
];

// Home shows the logo and menu; inner pages show a back button and a title.
export default function Header({ title, backTo }) {
  const { settings } = useCatalog();
  const waHref = whatsappLink(settings.whatsapp_number, `Namaste ${settings.shop_name}, I want to know about your sarees.`);

  return (
    <header className="topbar">
      <div className="container topbar__row">
        {backTo ? (
          <>
            <a className="icon-btn" href={backTo} aria-label="Go back">
              <Icon name="back" />
            </a>
            <span className="topbar__title">{title}</span>
          </>
        ) : (
          <a className="brand" href={paths.home} aria-label={`${settings.shop_name} home`}>
            <Crest />
            <span className="brand__text">
              <span className="brand__name">{settings.shop_name}</span>
              <span className="brand__place">VARANASI</span>
            </span>
          </a>
        )}

        <nav className="topbar__nav" aria-label="Main">
          {NAV.map((item) => (
            <a key={item.id} href={paths.section(item.id)} onClick={(e) => goToSection(e, item.id)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="topbar__actions">
          {!backTo && (
            <a
              className="icon-btn"
              href={paths.section('search')}
              aria-label="Search sarees"
              onClick={(e) => {
                goToSection(e, 'search');
                document.getElementById('search-input')?.focus({ preventScroll: true });
              }}
            >
              <Icon name="search" />
            </a>
          )}
          <a className="icon-btn" href={phoneLink(settings.phone_number)} aria-label="Call the shop">
            <Icon name="phone" />
          </a>
          <a className="btn btn--whatsapp topbar__wa" href={waHref} target="_blank" rel="noopener">
            <Icon name="chat" size={18} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
