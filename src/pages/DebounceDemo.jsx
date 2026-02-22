import React, { useState, useEffect, useRef } from 'react'

// Simulated products database
const DB = Array.from({ length: 200 }, (_, i) => ({
  id: i+1,
  name: ['React', 'Node', 'Python', 'Django', 'Vue', 'Angular', 'Svelte', 'TypeScript', 'GraphQL', 'MongoDB'][i%10] + ` ${['Tutorial','Course','Book','Guide','Docs'][i%5]} v${i+1}`,
  category: ['Frontend','Backend','Database','DevOps','AI'][i%5],
}))

export default function DebounceDemo() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [apiCallCount, setApiCallCount] = useState(0)
  const [lastSearch, setLastSearch] = useState('')
  const [mode, setMode] = useState('debounced')
  const [isSearching, setIsSearching] = useState(false)
  const callLog = useRef([])
  const [log, setLog] = useState([])

  // DEBOUNCED search
  useEffect(() => {
    if (mode !== 'debounced') return
    if (!query) { setResults([]); return }

    setIsSearching(true)
    const addEntry = `[${new Date().toLocaleTimeString()}] Typed: "${query}" — waiting 500ms...`
    callLog.current = [...callLog.current.slice(-7), addEntry]
    setLog([...callLog.current])

    const timer = setTimeout(() => {
      const res = DB.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      setResults(res.slice(0, 8))
      setLastSearch(query)
      setApiCallCount(c => c + 1)
      setIsSearching(false)
      const done = `[${new Date().toLocaleTimeString()}] ✅ API called! Found ${res.length} results`
      callLog.current = [...callLog.current.slice(-7), done]
      setLog([...callLog.current])
    }, 500)

    return () => clearTimeout(timer)
  }, [query, mode])

  // NON-DEBOUNCED search
  const handleNonDebounced = (e) => {
    const val = e.target.value
    setQuery(val)
    if (mode !== 'instant') return
    if (!val) { setResults([]); return }
    const res = DB.filter(p => p.name.toLowerCase().includes(val.toLowerCase()))
    setResults(res.slice(0, 8))
    setLastSearch(val)
    setApiCallCount(c => c + 1)
    const entry = `[${new Date().toLocaleTimeString()}] 🔴 API called for: "${val}"`
    callLog.current = [...callLog.current.slice(-7), entry]
    setLog([...callLog.current])
  }

  const reset = () => {
    setQuery('')
    setResults([])
    setApiCallCount(0)
    callLog.current = []
    setLog([])
    setLastSearch('')
  }

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"><span>Debouncing</span> User Input</h2>
        <p className="page-desc">
          Jab user search box mein type karta hai, har keystroke par API call mat karo! Debouncing wait karta hai — jab user ruk jaye tab call karo. Isse API calls 96% tak kam ho jaati hain.
        </p>
      </div>

      <div className="two-col" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-title">Mode Select</div>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <button className="btn" onClick={() => { setMode('debounced'); reset() }}
              style={{ borderColor: mode==='debounced'?'var(--accent)':'var(--border)', color: mode==='debounced'?'var(--accent)':'var(--text-dim)' }}>
              ⚡ Debounced (500ms)
            </button>
            <button className="btn btn-danger" onClick={() => { setMode('instant'); reset() }}
              style={{ borderColor: mode==='instant'?'var(--accent2)':'var(--border)', color: mode==='instant'?'var(--accent2)':'var(--text-dim)' }}>
              🔴 No Debounce
            </button>
          </div>
          <input
            type="search"
            placeholder={`Search... (${mode === 'debounced' ? 'debounced ⚡' : 'instant 🔴'})`}
            value={query}
            onChange={mode === 'instant' ? handleNonDebounced : e => setQuery(e.target.value)}
            style={{ borderColor: mode==='instant'?'var(--accent2)':undefined }}
          />
          {isSearching && <div style={{ fontSize: '0.65rem', color: 'var(--accent)', marginTop: '0.5rem', letterSpacing: '0.1em' }}>Searching<span style={{animation:'blink 0.5s infinite'}}>...</span></div>}
        </div>

        <div className="card">
          <div className="card-title">API Call Counter</div>
          <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem' }}>
            <div className="counter-display" style={{ color: mode==='instant'?'var(--accent2)':'var(--accent)' }}>
              {apiCallCount}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Total API calls made</div>
          </div>
          <div className="metric">
            <span>Mode</span>
            <span className={`tag ${mode==='debounced'?'tag-green':'tag-red'}`}>{mode === 'debounced' ? '⚡ Debounced' : '🔴 Instant'}</span>
          </div>
          <div className="metric">
            <span>Last searched</span>
            <span style={{ color: '#fff', fontSize: '0.75rem' }}>{lastSearch || '—'}</span>
          </div>
          <div className="metric">
            <span>Results found</span>
            <span className="metric-val">{results.length}</span>
          </div>
          <button className="btn btn-danger" onClick={reset} style={{ marginTop: '1rem', width: '100%', fontSize: '0.65rem' }}>Reset Counter</button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-title">Search Results</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.5rem' }}>
            {results.map(r => (
              <div key={r.id} style={{ padding: '0.5rem 0.75rem', background: '#0d0d14', border: '1px solid var(--border)', fontSize: '0.72rem', animation: 'fadeIn 0.2s ease' }}>
                <div style={{ color: '#fff', marginBottom: '0.25rem' }}>{r.name}</div>
                <span className="tag tag-blue" style={{ fontSize: '0.6rem' }}>{r.category}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call log */}
      <div className="card">
        <div className="card-title">API Call Log</div>
        <div style={{ background: '#0d0d14', border: '1px solid var(--border)', padding: '1rem', minHeight: '140px', fontSize: '0.68rem', fontFamily: 'var(--font-mono)' }}>
          {log.length === 0 && <span style={{ color: 'var(--text-dim)' }}>// Type in search box to see the difference...</span>}
          {log.map((entry, i) => (
            <div key={i} style={{ color: entry.includes('✅') ? 'var(--accent)' : entry.includes('🔴') ? 'var(--accent2)' : 'var(--text-dim)', marginBottom: '0.2rem', animation: 'fadeIn 0.2s ease' }}>
              {entry}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Code Reference</div>
        <div className="code-block">{`useEffect(() => {
  if (!query) return

  // Timer set karo — 500ms baad API call
  const timer = setTimeout(() => {
    fetch('/api/search?q=' + query)
      .then(res => res.json())
      .then(data => setResults(data))
  }, 500)

  // Cleanup: agar user aur type kare
  // to purana timer cancel ho jata hai
  return () => clearTimeout(timer)

}, [query])  // query change hone par run karo`}</div>
      </div>
    </div>
  )
}
