import { createContext, useContext, useEffect, useState } from 'react';
import { loadCatalog, loadSample, readCache } from './catalog.js';
import { DEFAULT_SETTINGS } from '../config.js';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
  // Show the last saved sarees instantly, then refresh from the sheet.
  const [state, setState] = useState(() => {
    const cached = readCache();
    return cached
      ? { ...cached, status: 'refreshing' }
      : { sarees: [], fabrics: [], settings: DEFAULT_SETTINGS, loadedAt: null, status: 'loading' };
  });

  useEffect(() => {
    let cancelled = false;
    loadCatalog()
      .then((data) => {
        if (!cancelled) setState({ ...data, status: 'ready' });
      })
      .catch(async () => {
        if (cancelled) return;
        // Sheet unreachable: keep the saved copy, or fall back to the sample files.
        if (readCache()) {
          setState((prev) => ({ ...prev, status: 'offline' }));
          return;
        }
        try {
          const sample = await loadSample();
          if (!cancelled) setState({ ...sample, status: 'offline' });
        } catch {
          if (!cancelled) setState((prev) => ({ ...prev, status: 'error' }));
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <CatalogContext.Provider value={state}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
