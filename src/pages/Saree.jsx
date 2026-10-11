import { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../components/Header.jsx';
import BottomBar from '../components/BottomBar.jsx';
import Footer from '../components/Footer.jsx';
import Icon from '../components/Icon.jsx';
import SareeCard, { PriceTag, SareeImage } from '../components/SareeCard.jsx';
import { useCatalog } from '../data/CatalogContext.jsx';
import { formatPrice, pageUrl, whatsappLink, yesSetting } from '../lib/contact.js';
import { paths } from '../lib/router.js';

function Gallery({ saree }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);
  const count = Math.max(saree.images.length, 1);

  useEffect(() => {
    setIndex(0);
    track.current?.scrollTo({ left: 0 });
  }, [saree.code]);

  const go = (i) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className="gallery">
      <div
        className="gallery__track"
        ref={track}
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / Math.max(e.currentTarget.clientWidth, 1)))}
      >
        {Array.from({ length: count }, (_, i) => (
          <div className="gallery__slide" key={i}>
            <SareeImage saree={saree} index={i} eager={i === 0} />
          </div>
        ))}
      </div>
      {count > 1 && (
        <>
          <span className="gallery__count">
            {index + 1} / {count}
          </span>
          <div className="gallery__thumbs">
            {saree.images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                className={`gallery__thumb ${i === index ? 'gallery__thumb--on' : ''}`}
                aria-label={`Photo ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Saree({ code }) {
  const { sarees, settings, status } = useCatalog();
  const saree = sarees.find((s) => s.code.toLowerCase() === String(code).toLowerCase());
  const [pickedColour, setPickedColour] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setPickedColour('');
    if (saree) document.title = `${saree.name} – ${settings.shop_name}`;
  }, [saree, settings.shop_name]);

  const colour = pickedColour || saree?.colour || '';
  const link = saree ? pageUrl(paths.saree(saree.code)) : '';

  const message = useMemo(() => {
    if (!saree) return '';
    const lines = [`Namaste ${settings.shop_name},`, 'I want to order this saree:', `• ${saree.name}`, `• Code: ${saree.code}`];
    if (colour) lines.push(`• Colour: ${colour}`);
    if (saree.price !== null) lines.push(`• Price on website: ${formatPrice(saree.price)}`);
    lines.push(`Link: ${link}`, 'Please share price, more photos and delivery details.');
    return lines.join('\n');
  }, [saree, colour, link, settings.shop_name]);

  const similar = useMemo(() => {
    if (!saree) return [];
    const same = sarees.filter((s) => s.code !== saree.code && s.fabricId === saree.fabricId);
    const others = sarees.filter((s) => s.code !== saree.code && s.fabricId !== saree.fabricId);
    return [...same, ...others].slice(0, 6);
  }, [sarees, saree]);

  if (!saree) {
    return (
      <>
        <Header title="Saree" backTo={paths.fabric('all')} />
        <main className="container section">
          {status === 'loading' || status === 'refreshing' ? (
            <p className="muted">Loading…</p>
          ) : (
            <div className="empty">
              <b>This saree isn’t on the website right now.</b>
              <span>It may have been sold. Ask us for something similar.</span>
              <a className="btn btn--dark" href={paths.fabric('all')}>
                See all sarees
              </a>
            </div>
          )}
        </main>
      </>
    );
  }

  const waOrder = whatsappLink(settings.whatsapp_number, message);
  const waVideo = whatsappLink(
    settings.whatsapp_number,
    `Namaste ${settings.shop_name}, I would like to see this saree on a video call: ${saree.name} (${saree.code}).\n${link}`,
  );

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: saree.name, text: `${saree.name} – ${settings.shop_name}`, url: link });
        return;
      }
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* cancelled */
    }
  };

  const details = [
    ['Fabric', saree.fabric],
    ['Weave', saree.weave],
    ['Zari', saree.zari],
    ['Length', saree.length],
    ['Blouse', saree.blouse],
    ['Occasion', saree.occasion],
    ['Care', saree.care],
  ].filter(([, v]) => v);

  const colourOptions = saree.colours.length ? saree.colours : [];

  return (
    <>
      <Header title={saree.fabric || 'Saree'} backTo={saree.fabricId ? paths.fabric(saree.fabricId) : paths.fabric('all')} />
      <main className="container saree">
        <div className="saree__media">
          <Gallery saree={saree} />
        </div>

        <div className="saree__body">
          <div className="saree__meta">
            {saree.fabric && <span className="tag">{saree.fabric}</span>}
            <span className="muted">Code: {saree.code}</span>
            <button type="button" className="icon-btn icon-btn--light saree__share" onClick={share} aria-label="Share this saree">
              <Icon name={copied ? 'check' : 'share'} size={20} />
            </button>
          </div>
          <h1 className="saree__name">{saree.name}</h1>
          <PriceTag saree={saree} large />
          {saree.note && <p className="saree__note">{saree.note}</p>}

          {colourOptions.length > 0 && (
            <fieldset className="field">
              <legend>
                Colour: <span className="muted">{colour || 'choose one'}</span>
              </legend>
              <div className="pills">
                {colourOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`pill ${c === colour ? 'pill--on' : ''}`}
                    aria-pressed={c === colour}
                    onClick={() => setPickedColour(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="saree__actions">
            <a className="btn btn--whatsapp btn--xl" href={waOrder} target="_blank" rel="noopener">
              <Icon name="chat" size={22} /> Order on WhatsApp
            </a>
            {yesSetting(settings.video_call) && (
              <a className="btn btn--outline btn--lg" href={waVideo} target="_blank" rel="noopener">
                <Icon name="video" size={20} /> See it on video call
              </a>
            )}
          </div>

          <div className="wa-preview">
            <span className="wa-preview__label">We’ll type this for you:</span>
            <div className="wa-preview__msg">{message}</div>
            <span className="muted small">You can change it in WhatsApp before sending.</span>
          </div>

          {details.length > 0 && (
            <section className="details">
              <h2 className="details__title">Saree details</h2>
              <dl>
                {details.map(([k, v]) => (
                  <div key={k} className="details__row">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <ul className="assure">
            <li>
              <Icon name="pin" size={20} />
              <span>
                <b>Real shop in Varanasi</b> — Shivratanpur, Bazardiha
              </span>
            </li>
            {settings.gstin && (
              <li>
                <Icon name="bill" size={20} />
                <span>
                  <b>GST bill</b> — GSTIN {settings.gstin}
                </span>
              </li>
            )}
            <li>
              <Icon name="chat" size={20} />
              <span>
                <b>Talk to us directly</b> — no middlemen
              </span>
            </li>
          </ul>
        </div>
      </main>

      {similar.length > 0 && (
        <section className="container section">
          <h2 className="section__title">You may also like</h2>
          <div className="saree-grid">
            {similar.map((s) => (
              <SareeCard key={s.code} saree={s} />
            ))}
          </div>
        </section>
      )}

      <Footer />
      <BottomBar whatsappHref={waOrder} whatsappLabel="Order on WhatsApp" price={<PriceTag saree={saree} />} />
    </>
  );
}
