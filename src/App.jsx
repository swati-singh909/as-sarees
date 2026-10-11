import { lazy, Suspense } from 'react';
import { useRoute } from './lib/router.js';
import Home from './pages/Home.jsx';

// Home loads first; other pages are fetched only when opened.
const Fabric = lazy(() => import('./pages/Fabric.jsx'));
const Saree = lazy(() => import('./pages/Saree.jsx'));

export default function App() {
  const route = useRoute();
  return (
    <Suspense fallback={<div className="page-loading" />}>
      {route.page === 'fabric' && <Fabric id={route.id} q={route.q} />}
      {route.page === 'saree' && <Saree code={route.code} />}
      {route.page === 'home' && <Home section={route.section} />}
    </Suspense>
  );
}
