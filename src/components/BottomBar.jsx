import Icon from './Icon.jsx';
import { phoneLink } from '../lib/contact.js';
import { useCatalog } from '../data/CatalogContext.jsx';

// Fixed bar at the bottom of phone screens, within thumb reach.
// On a saree page it shows the price and "Order on WhatsApp" instead of Call.
export default function BottomBar({ whatsappHref, whatsappLabel = 'Chat on WhatsApp', price }) {
  const { settings } = useCatalog();
  return (
    <div className="bottombar">
      <div className="bottombar__row">
        {price !== undefined ? (
          <div className="bottombar__price">{price}</div>
        ) : (
          <a className="btn btn--outline btn--lg bottombar__call" href={phoneLink(settings.phone_number)}>
            <Icon name="phone" size={20} />
            Call
          </a>
        )}
        <a className="btn btn--whatsapp btn--lg bottombar__wa" href={whatsappHref} target="_blank" rel="noopener">
          <Icon name="chat" size={20} />
          {whatsappLabel}
        </a>
      </div>
    </div>
  );
}
