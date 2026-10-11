import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import BottomBar from '../components/BottomBar.jsx';
import Footer from '../components/Footer.jsx';
import Icon from '../components/Icon.jsx';
import SearchBox from '../components/SearchBox.jsx';
import SareeCard, { SareeCardSkeleton } from '../components/SareeCard.jsx';
import { useCatalog } from '../data/CatalogContext.jsx';
import { whatsappLink } from '../lib/contact.js';
import { paths } from '../lib/router.js';

function matches(saree, words) {
  const text = [saree.name, saree.fabric, saree.colour, saree.code, saree.occasion, saree.weave, saree.zari, saree.note, ...saree.colours]
    .join(' ')
    .toLowerCase();
  return words.every((w) => text.includes(w));
}

const SORTS = {
  new: { label: 'Newest first', fn: () => 0 },
  low: { label: 'Price: low to high', fn: (a, b) => (a.price ?? Infinity) - (b.price ?? Infinity) },
  high: { label: 'Price: high to low', fn: (a, b) => (b.price ?? -1) - (a.price ?? -1) },
};

export default function Fabric({ id, q }) {
  const { sarees, fabrics, settings, status } = useCatalog();
  const fabric = fabrics.find((f) => f.id === id);
  const [query, setQuery] = useState(q);
  const [colour, setColour] = useState('All');
  const [sort, setSort] = useState('new');
  const loading = status === 'loading';

  useEffect(() => setQuery(q), [q]);
  useEffect(() => setColour('All'), [id]);

  // Keep the selected fabric chip visible in the scrolling chip bar.
  useEffect(() => {
    document.querySelector('.fchip--on')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }, [id, fabrics.length]);

  const title = fabric ? `${fabric.name} Sarees` : 'All sarees';
  useEffect(() => {
    document.title = `${title} – ${settings.shop_name}`;
  }, [title, settings.shop_name]);

  const base = useMemo(() => (id === 'all' ? sarees : sarees.filter((s) => s.fabricId === id)), [sarees, id]);
  const colours = useMemo(() => ['All', ...new Set(base.map((s) => s.colour).filter(Boolean))], [base]);
  const list = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return base
      .filter((s) => !words.length || matches(s, words))
      .filter((s) => colour === 'All' || s.colour === colour)
      .slice()
      .sort(SORTS[sort].fn);
  }, [base, query, colour, sort]);

  const askText = fabric
    ? `Namaste ${settings.shop_name}, please share photos of your ${fabric.name} sarees.`
    : `Namaste ${settings.shop_name}, I am looking for: ${query || 'a Banarasi saree'}`;
  const waAsk = whatsappLink(settings.whatsapp_number, askText);

  return (
    <>
      <Header title={title} backTo={paths.home} />
      <main>
        <div className="chipbar">
          <div className="container chipbar__row" role="navigation" aria-label="Fabrics">
            <a className={`fchip ${id === 'all' ? 'fchip--on' : ''}`} href={paths.fabric('all')} aria-current={id === 'all' ? 'page' : undefined}>
              All
            </a>
            {fabrics.map((f) => (
              <a
                key={f.id}
                className={`fchip ${f.id === id ? 'fchip--on' : ''}`}
                href={paths.fabric(f.id)}
                aria-current={f.id === id ? 'page' : undefined}
              >
                {f.image && <img src={f.image} alt="" loading="lazy" />}
                {f.name}
              </a>
            ))}
          </div>
        </div>

        <div className="container section section--tight">
          <div className="list-head">
            <h1 className="section__title">{title}</h1>
            {!loading && (
              <span className="muted">
                {list.length} {list.length === 1 ? 'design' : 'designs'}
              </span>
            )}
          </div>

          {fabric?.about && (
            <div className="about">
              {fabric.image && <img src={fabric.image} alt="" />}
              <span>
                <span className="eyebrow">About this fabric{fabric.hindi ? ` · ${fabric.hindi}` : ''}</span>
                {fabric.about}
              </span>
            </div>
          )}

          <div className="filters">
            <SearchBox id="list-search" value={query} onChange={setQuery} placeholder="Search colour, code…" />
            <label className="sort">
              <span className="visually-hidden">Sort</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {Object.entries(SORTS).map(([key, s]) => (
                  <option key={key} value={key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
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
              ? Array.from({ length: 6 }, (_, i) => <SareeCardSkeleton key={i} />)
              : list.map((s) => <SareeCard key={s.code} saree={s} />)}
          </div>

          {!loading && list.length === 0 && (
            <div className="empty">
              <b>{query ? `Nothing matches “${query}” yet.` : `No ${fabric ? fabric.name : ''} sarees on the website yet.`}</b>
              <span>The shop has many more designs than the website. Ask us and we’ll send photos.</span>
              <a className="btn btn--whatsapp" href={waAsk} target="_blank" rel="noopener">
                <Icon name="chat" size={18} /> Ask on WhatsApp
              </a>
            </div>
          )}

          {list.length > 0 && (
            <div className="darkcard darkcard--soft section__more">
              <h2 className="darkcard__title">Didn’t find your colour?</h2>
              <p>Send us a photo or describe it — we’ll check the shop and reply on WhatsApp.</p>
              <a className="btn btn--whatsapp btn--lg" href={waAsk} target="_blank" rel="noopener">
                <Icon name="chat" size={18} /> Ask on WhatsApp
              </a>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomBar whatsappHref={waAsk} />
    </>
  );
}
