import React, { useState, useEffect } from 'react'

const ROUTES = [
  { path: '/', name: 'Home', size: '12 KB', time: '0ms', desc: 'Always loaded — initial bundle mein hota hai' },
  { path: '/dashboard', name: 'Dashboard', size: '85 KB', time: '~200ms', desc: 'Lazy loaded — sirf tab jab user navigate kare' },
  { path: '/profile', name: 'Profile', size: '34 KB', time: '~100ms', desc: 'Lazy loaded — demand par load hota hai' },
  { path: '/settings', name: 'Settings', size: '28 KB', time: '~80ms', desc: 'Lazy loaded — pehle load nahi hota' },
  { path: '/reports', name: 'Reports', size: '120 KB', time: '~350ms', desc: 'Lazy loaded — charts/graphs heavy hain' },
]

function SimulatedRoute({ route }) {
  const [loading, setLoading] = useState(true)
  const [loadTime, setLoadTime] = useState(null)

  useEffect(() => {
    setLoading(true)
    const start = Date.now()
    const ms = parseInt(route.time) || 100
    const timer = setTimeout(() => {
      setLoading(false)
      setLoadTime(Date.now() - start)
    }, ms)
    return () => clearTimeout(timer)
  }, [route])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
        <div style={{ width: '100%', height: '2px', background: 'var(--border)', overflow: 'hidden', marginBottom: '1rem' }}>
          <div style={{ height: '100%', background: 'var(--accent)', animation: 'slideIn 0.8s ease infinite' }} />
        </div>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', color: 'var(--accent)' }}>
          LOADING {route.name.toUpperCase()}<span style={{ animation: 'blink 0.5s step-end infinite' }}>...</span>
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>
          Fetching {route.size} chunk...
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem', background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.2)' }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
        ✅ {route.name.toUpperCase()} — LOADED in {loadTime}ms
      </div>
      <div style={{ fontSize: '0.8rem', color: '#fff', marginBottom: '0.5rem' }}>
        📄 {route.name} Page Content
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
        {route.desc}
      </div>
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <span className="tag tag-green">Chunk Size: {route.size}</span>
        <span className="tag tag-blue">Load Time: {loadTime}ms</span>
      </div>
    </div>
  )
}

export default function LazyDemo() {
  const [activeRoute, setActiveRoute] = useState(null)
  const [loadedRoutes, setLoadedRoutes] = useState(new Set(['/']))

  const navigate = (route) => {
    setActiveRoute(route)
    setLoadedRoutes(prev => new Set([...prev, route.path]))
  }

  const initialBundle = 12  // KB
  const totalLoaded = ROUTES.filter(r => loadedRoutes.has(r.path)).reduce((sum, r) => sum + parseInt(r.size), 0)

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"><span>Lazy Loading</span> & Code Splitting</h2>
        <p className="page-desc">
          Pura code ek saath load mat karo! React.lazy() + Suspense se sirf woh code load hota hai jo user actually use karta hai. Initial bundle chota → page fast load hoti hai.
        </p>
      </div>

      <div className="two-col" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-title">Bundle Loading Status</div>
          <div className="metric">
            <span>Initial Bundle (always)</span>
            <span className="metric-val">{initialBundle} KB</span>
          </div>
          <div className="metric">
            <span>Total Downloaded</span>
            <span className="metric-val">{totalLoaded} KB</span>
          </div>
          <div className="metric">
            <span>Saved on Initial Load</span>
            <span className="metric-val" style={{color: 'var(--accent3)'}}>
              {ROUTES.reduce((s,r)=>s+parseInt(r.size),0) - initialBundle} KB
            </span>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', gap: '2px', height: '8px', marginBottom: '0.5rem' }}>
              {ROUTES.map(r => (
                <div key={r.path} style={{
                  flex: parseInt(r.size),
                  background: loadedRoutes.has(r.path) ? 'var(--accent)' : 'var(--border)',
                  transition: 'background 0.3s'
                }} title={r.name} />
              ))}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
              {loadedRoutes.size}/{ROUTES.length} routes loaded
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Route Navigation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {ROUTES.map(route => (
              <button key={route.path} className="btn" onClick={() => navigate(route)}
                style={{
                  justifyContent: 'space-between', display: 'flex', alignItems: 'center',
                  borderColor: activeRoute?.path === route.path ? 'var(--accent)' : loadedRoutes.has(route.path) ? 'rgba(0,255,136,0.4)' : 'var(--border)',
                  color: activeRoute?.path === route.path ? 'var(--accent)' : loadedRoutes.has(route.path) ? 'rgba(0,255,136,0.7)' : 'var(--text-dim)',
                  padding: '0.5rem 0.75rem', fontSize: '0.68rem', textAlign: 'left'
                }}>
                <span>{route.path === '/' ? '🏠' : '📄'} {route.name}</span>
                <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>
                  {loadedRoutes.has(route.path) ? '✓ cached' : route.size}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeRoute && (
        <div className="card">
          <div className="card-title">Suspense Boundary — Loading {activeRoute.name}</div>
          <SimulatedRoute route={activeRoute} key={activeRoute.path + Date.now()} />
        </div>
      )}

      {!activeRoute && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👆</div>
          <div style={{ fontSize: '0.8rem' }}>Upar se koi route select karo demo dekhne ke liye</div>
        </div>
      )}

      <div className="card">
        <div className="card-title">Code Reference</div>
        <div className="code-block">{`import { lazy, Suspense } from 'react'

// Lazy load pages — sirf jab navigate karen tab load hoga
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings  = lazy(() => import('./pages/Settings'))

function App() {
  return (
    // Suspense fallback = loading ke time kya dikhao
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings"  element={<Settings />} />
      </Routes>
    </Suspense>
  )
}`}</div>
      </div>
    </div>
  )
}
