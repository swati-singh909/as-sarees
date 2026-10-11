import Icon from './Icon.jsx';
import { paths } from '../lib/router.js';
import { formatPrice } from '../lib/contact.js';

export function SareeImage({ saree, index = 0, className = '', eager = false }) {
  const src = saree.images[index];
  return src ? (
    <img
      className={className}
      src={src}
      alt={saree.name}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  ) : (
    <span className={`img-missing ${className}`}>
      <Icon name="saree" size={40} strokeWidth={1.4} />
      <span>Photo coming soon</span>
    </span>
  );
}

export function PriceTag({ saree, large = false }) {
  if (saree.price === null) {
    return <span className={`price price--ask ${large ? 'price--lg' : ''}`}>Price on WhatsApp</span>;
  }
  return (
    <span className={`price ${large ? 'price--lg' : ''}`}>
      {formatPrice(saree.price)}
      {saree.mrp && saree.mrp > saree.price && <s className="price__mrp">{formatPrice(saree.mrp)}</s>}
    </span>
  );
}

// The whole card opens the saree page, where the order message is built.
export default function SareeCard({ saree }) {
  return (
    <a className="scard" href={paths.saree(saree.code)}>
      <span className="scard__img">
        <SareeImage saree={saree} />
        {saree.fabric && <span className="scard__tag">{saree.fabric}</span>}
        {saree.isNew && <span className="scard__new">New</span>}
      </span>
      <span className="scard__info">
        <span className="scard__name">{saree.name}</span>
        <PriceTag saree={saree} />
        <span className="scard__cta">
          <Icon name="chat" size={16} />
          Order on WhatsApp
        </span>
      </span>
    </a>
  );
}

export function SareeCardSkeleton() {
  return (
    <div className="scard scard--skeleton" aria-hidden="true">
      <span className="scard__img shimmer" />
      <span className="scard__info">
        <span className="shimmer line" />
        <span className="shimmer line line--short" />
        <span className="shimmer line line--btn" />
      </span>
    </div>
  );
}
