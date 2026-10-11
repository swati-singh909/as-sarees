import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import BottomBar from '../components/BottomBar.jsx';
import Footer from '../components/Footer.jsx';
import Icon from '../components/Icon.jsx';
import SearchBox from '../components/SearchBox.jsx';
import SareeCard, { SareeCardSkeleton } from '../components/SareeCard.jsx';
import { useCatalog } from '../data/CatalogContext.jsx';
import { mapsLink, phoneLink, prettyPhone, whatsappLink, yesSetting } from '../lib/contact.js';
import { goToSection, paths } from '../lib/router.js';

export default function Home({ section }) {
  const { sarees, fabrics, settings, status } = useCatalog();
  const [colour, setColour] = useState('All');
  const loading = status === 'loading';
  const videoCall = yesSetting(settings.video_call);

  // Arriving from another page via a menu link: scroll to that section.
  useEffect(() => {
    if (!section) return;
    const t = setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return () => clearTimeout(t);
  }, [section, loading]);

  const newIn = useMemo(() => {
    const flagged = sarees.filter((s) => s.isNew);
    return (flagged.length ? flagged : sarees).slice(0, 8);
  }, [sarees]);
  const colours = useMemo(
    () => ['All', ...new Set(newIn.map((s) => s.colour).filter(Boolean))].slice(0, 6),
    [newIn],
  );
  const shown = colour === 'All' ? newIn : newIn.filter((s) => s.colour === colour);

  const waHello = whatsappLink(settings.whatsapp_number, `Namaste ${settings.shop_name}, I want to know about your sarees.`);
  const waVideo = whatsappLink(
    settings.whatsapp_number,
    `Namaste ${settings.shop_name}, I would like to see sarees on a video call. When are you free?`,
  );
  const waColour = whatsappLink(
    settings.whatsapp_number,
    `Namaste ${settings.shop_name}, I am looking for a saree in this colour / design: `,
  );

  return (
    <>
      {settings.announcement && <div className="announce">{settings.announcement}</div>}
      <Header />

      <main>
        {/* Hero: tall crop of the banner on phones, the full banner on desktop */}
        <section className="hero">
          <picture>
            <source media="(min-width: 900px)" srcSet="/images/banner-full.webp" />
            <img
              className="hero__img"
              src="/images/banner-portrait.webp"
              alt="A woman in an orange Banarasi silk saree with gold zari, beside the Varanasi ghats"
              fetchpriority="high"
            />
          </picture>
          <span className="hero__badge">Festive collection</span>
          <div className="hero__content">
            {settings.tagline && <span className="hero__tagline">{settings.tagline}</span>}
            <h1 className="hero__title">Banarasi sarees, from the heart of Varanasi</h1>
            <p className="hero__text">Katan, organza, georgette, tissue and more — order in one tap on WhatsApp.</p>
            <div className="hero__ctas">
              <a className="btn btn--gold btn--lg" href={paths.section('fabrics')} onClick={(e) => goToSection(e, 'fabrics')}>
                Shop by fabric
              </a>
              <a className="btn btn--ghost btn--lg" href={videoCall ? waVideo : waHello} target="_blank" rel="noopener">
                <Icon name={videoCall ? 'video' : 'chat'} size={18} />
                {videoCall ? 'Book a video call' : 'WhatsApp'}
              </a>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <div className="trust">
          <div className="container trust__row">
            <span className="trust__item">
              <Icon name="pin" />
              <span>
                <b>Shop in Varanasi</b>
                <small>Shivratanpur, Bazardiha</small>
              </span>
            </span>
            {videoCall && (
              <span className="trust__item">
                <Icon name="video" />
                <span>
                  <b>Live video call</b>
                  <small>See drape, zari &amp; colour</small>
                </span>
              </span>
            )}
            <span className="trust__item">
              <Icon name={settings.gstin ? 'bill' : 'chat'} />
              <span>
                <b>{settings.gstin ? 'GST bill' : 'Order on WhatsApp'}</b>
                <small>{settings.gstin ? 'With every order' : 'Talk to the shop directly'}</small>
              </span>
            </span>
          </div>
        </div>

        <div className="container section section--tight" id="search">
          <SearchBox />
        </div>

        {/* Shop by fabric */}
        <section className="container section" id="fabrics">
          <div className="section__head">
            <div>
              <h2 className="section__title">Shop by fabric</h2>
              <p className="section__sub">कपड़े के हिसाब से साड़ी चुनें</p>
            </div>
            <a className="link" href={paths.fabric('all')}>
              See all
            </a>
          </div>
          <div className="fabric-grid">
            {loading && !fabrics.length
              ? Array.from({ length: 9 }, (_, i) => <span key={i} className="ftile ftile--skeleton shimmer" />)
              : fabrics.map((f) => (
                  <a key={f.id} className="ftile" href={paths.fabric(f.id)}>
                    <span className="ftile__img">
                      {f.image ? <img src={f.image} alt="" loading="lazy" decoding="async" /> : <Icon name="saree" size={34} strokeWidth={1.4} />}
                    </span>
                    <span className="ftile__name">{f.name}</span>
                    {f.hindi && <span className="ftile__hindi">{f.hindi}</span>}
                  </a>
                ))}
          </div>
        </section>

        {/* Festive edit */}
        <section className="container section" id="festive">
          <div className="festive">
            <img
              className="festive__img"
              src="/images/banner-folded.webp"
              alt="Orange and wine Banarasi silk sarees, folded, with brass bowls and jasmine"
              loading="lazy"
              decoding="async"
            />
            <div className="festive__body">
              <span className="eyebrow eyebrow--gold">Wedding &amp; festive edit</span>
              <h2 className="festive__title">Rich zari, deep colours — for the shaadi season</h2>
              <p>Katan and tissue Banarasi in wine, rust and gold. Ask us for bridal and family-function sets.</p>
              <a className="btn btn--gold btn--lg" href={paths.fabric('all')}>
                See the collection
              </a>
            </div>
          </div>
        </section>

        {/* New in the shop */}
        <section className="container section" id="new">
          <div className="section__head">
            <h2 className="section__title">New in the shop</h2>
          </div>
          {colours.length > 2 && (
            <div className="pills" role="group" aria-label="Filter by colour">
              {colours.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`pill ${c === colour ? 'pill--on' : ''}`}
                  aria-pressed={c === colour}
                  onClick={() => setColour(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <div className="saree-grid">
            {loading && !sarees.length
              ? Array.from({ length: 4 }, (_, i) => <SareeCardSkeleton key={i} />)
              : shown.map((s) => <SareeCard key={s.code} saree={s} />)}
          </div>
          {!loading && !sarees.length && (
            <div className="empty">
              <b>New sarees are being added.</b>
              <span>Ask us on WhatsApp for photos of what's in the shop today.</span>
              <a className="btn btn--whatsapp" href={waHello} target="_blank" rel="noopener">
                <Icon name="chat" size={18} /> Ask on WhatsApp
              </a>
            </div>
          )}
          {sarees.length > 0 && (
            <a className="btn btn--outline btn--block section__more" href={paths.fabric('all')}>
              View all sarees
            </a>
          )}
        </section>

        {/* How to order */}
        <section className="container section" id="order">
          <div className="howto">
            <h2 className="section__title">How to order</h2>
            <p className="section__sub">No sign-up, no online payment page — just a chat with the shop.</p>
            <ol className="steps">
              <li>
                <span className="steps__num">1</span>
                <span>
                  <b>Pick a saree</b>
                  Browse by fabric and choose a colour.
                </span>
              </li>
              <li>
                <span className="steps__num">2</span>
                <span>
                  <b>Tap “Order on WhatsApp”</b>
                  Your message is typed for you with the saree code.
                </span>
              </li>
              <li>
                <span className="steps__num">3</span>
                <span>
                  <b>We confirm with you</b>
                  Price, real photos and delivery — on chat.
                </span>
              </li>
            </ol>
          </div>
        </section>

        {/* Video call + colour request */}
        <section className="container section split">
          {videoCall && (
            <div className="darkcard">
              <img className="darkcard__img" src="/images/zari-border.webp" alt="Close-up of a green and gold zari border" loading="lazy" />
              <h2 className="darkcard__title">See sarees live on video call</h2>
              <p>Can’t visit Varanasi? We’ll show you the drape, zari and colour on a WhatsApp video call.</p>
              <a className="btn btn--gold btn--lg" href={waVideo} target="_blank" rel="noopener">
                <Icon name="video" size={18} /> Book a video call
              </a>
            </div>
          )}
          <div className="darkcard darkcard--soft">
            <h2 className="darkcard__title">Looking for a particular colour?</h2>
            <p>Send us a photo or describe it — we’ll check the shop and reply on WhatsApp.</p>
            <a className="btn btn--whatsapp btn--lg" href={waColour} target="_blank" rel="noopener">
              <Icon name="chat" size={18} /> Ask on WhatsApp
            </a>
          </div>
        </section>

        {/* Visit shop */}
        <section className="container section" id="visit">
          <div className="visit">
            <div className="visit__info">
              <h2 className="section__title">Visit our shop</h2>
              <p className="visit__address">
                <b>{settings.shop_name}</b>
                <br />
                {settings.address}
              </p>
              {settings.hours && (
                <p className="visit__hours">
                  <Icon name="clock" size={18} /> {settings.hours}
                </p>
              )}
              <div className="btn-row">
                <a className="btn btn--dark btn--lg" href={mapsLink(settings)} target="_blank" rel="noopener">
                  <Icon name="pin" size={18} /> Get directions
                </a>
                <a className="btn btn--outline btn--lg" href={phoneLink(settings.phone_number)}>
                  <Icon name="phone" size={18} /> Call {prettyPhone(settings.phone_number)}
                </a>
              </div>
            </div>
            <a className="visit__map" href={mapsLink(settings)} target="_blank" rel="noopener" aria-label="Open the shop in Google Maps">
              <img src="/images/zari-border.webp" alt="" loading="lazy" />
              <span className="visit__pin">
                <Icon name="pin" size={18} /> Open in Google Maps
              </span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <BottomBar whatsappHref={waHello} />
    </>
  );
}
