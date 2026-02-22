import React, { useState, Profiler, useCallback, memo } from 'react'

const COMPONENTS = ['Navigation', 'ProductList', 'UserProfile', 'Dashboard', 'SearchBar']

// Simulated components
const SlowComponent = memo(function SlowComponent({ name, delay }) {
  const start = Date.now()
  while (Date.now() - start < delay) {} // Simulate slow render
  return (
    <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(255,170,0,0.07)', border: '1px solid rgba(255,170,0,0.2)', fontSize: '0.72rem', marginBottom: '0.25rem' }}>
      <span style={{ color: '#ffaa00' }}>{name}</span>
      <span style={{ color: 'var(--text-dim)', marginLeft: '0.75rem', fontSize: '0.65rem' }}>~{delay}ms simulated</span>
    </div>
  )
})

export default function ProfilerDemo() {
  const [renderLog, setRenderLog] = useState([])
  const [isRecording, setIsRecording] = useState(false)
  const [trigger, setTrigger] = useState(0)
  const [selectedComp, setSelectedComp] = useState('Navigation')

  const onRenderCallback = useCallback((id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    if (!isRecording) return
    setRenderLog(prev => [...prev.slice(-9), {
      id, phase, actual: actualDuration.toFixed(2), base: baseDuration.toFixed(2),
      commit: commitTime.toFixed(0), time: new Date().toLocaleTimeString()
    }])
  }, [isRecording])

  const COMPONENT_DELAYS = { Navigation: 5, ProductList: 30, UserProfile: 15, Dashboard: 50, SearchBar: 8 }

  const coreWebVitals = [
    { label: 'LCP — Largest Contentful Paint', good: '< 2.5s', unit: 'Loading', color: '#00ff88' },
    { label: 'FID — First Input Delay', good: '< 100ms', unit: 'Interactivity', color: '#3399ff' },
    { label: 'CLS — Cumulative Layout Shift', good: '< 0.1', unit: 'Visual Stability', color: '#cc66ff' },
    { label: 'FCP — First Contentful Paint', good: '< 1.8s', unit: 'Initial Render', color: '#ffaa00' },
    { label: 'TBT — Total Blocking Time', good: '< 200ms', unit: 'Thread Block', color: '#ff3366' },
  ]

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"><span>React Profiler API</span> & Core Web Vitals</h2>
        <p className="page-desc">
          React Profiler API se pata chalta hai ki kaunsa component kitna time le raha hai render hone mein. Lighthouse se Core Web Vitals measure karte hain — yeh SEO aur UX dono ke liye important hain.
        </p>
      </div>

      <div className="two-col" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-title">Profiler Controls</div>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button className="btn" onClick={() => setIsRecording(r => !r)}
              style={{ borderColor: isRecording ? 'var(--accent2)' : 'var(--accent)', color: isRecording ? 'var(--accent2)' : 'var(--accent)' }}>
              {isRecording ? '⏹ Stop Recording' : '⏺ Start Recording'}
            </button>
            <button className="btn" onClick={() => setRenderLog([])} style={{ fontSize: '0.65rem' }}>
              Clear Log
            </button>
          </div>

          <div style={{ marginBottom: '0.75rem', fontSize: '0.7rem', color: 'var(--text-dim)' }}>Select component to render:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {COMPONENTS.map(c => (
              <button key={c} className="btn" onClick={() => setSelectedComp(c)}
                style={{ fontSize: '0.62rem', padding: '0.3rem 0.6rem', borderColor: selectedComp===c?'var(--accent)':'var(--border)', color: selectedComp===c?'var(--accent)':'var(--text-dim)' }}>
                {c}
              </button>
            ))}
          </div>

          <Profiler id={selectedComp} onRender={onRenderCallback}>
            <div>
              <button className="btn" style={{ width: '100%', marginBottom: '0.75rem' }}
                onClick={() => setTrigger(t => t+1)}>
                Force Render → {selectedComp}
              </button>
              <SlowComponent key={trigger} name={selectedComp} delay={COMPONENT_DELAYS[selectedComp] || 10} />
            </div>
          </Profiler>

          {!isRecording && (
            <div style={{ fontSize: '0.65rem', color: 'var(--accent2)', marginTop: '0.5rem' }}>
              ⚠️ Recording band hai — pehle Start karo
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title">Profiler Render Log</div>
          <div style={{ background: '#0d0d14', border: '1px solid var(--border)', minHeight: '200px', padding: '0.75rem', fontSize: '0.68rem' }}>
            {renderLog.length === 0 && (
              <span style={{ color: 'var(--text-dim)' }}>// Start recording & force renders to see data...</span>
            )}
            {renderLog.map((r, i) => (
              <div key={i} style={{ marginBottom: '0.4rem', paddingBottom: '0.4rem', borderBottom: '1px solid #1a1a2a', animation: 'fadeIn 0.2s ease' }}>
                <span style={{ color: 'var(--accent)' }}>{r.id}</span>
                <span style={{ color: '#7070a0', margin: '0 0.4rem' }}>({r.phase})</span>
                <span style={{ color: '#fff' }}>actual: <strong>{r.actual}ms</strong></span>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.6rem', marginLeft: '0.5rem' }}>base: {r.base}ms</span>
                <div style={{ color: '#444466', fontSize: '0.6rem' }}>{r.time} · commit@{r.commit}ms</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="card">
        <div className="card-title">Core Web Vitals — Lighthouse Metrics</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {coreWebVitals.map(v => (
            <div key={v.label} style={{ padding: '1rem', background: '#0d0d14', border: `1px solid ${v.color}22`, borderLeft: `3px solid ${v.color}` }}>
              <div style={{ fontSize: '0.65rem', color: v.color, marginBottom: '0.25rem', letterSpacing: '0.05em' }}>{v.unit}</div>
              <div style={{ fontSize: '0.75rem', color: '#fff', marginBottom: '0.5rem', lineHeight: 1.4 }}>{v.label}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: v.color }}>{v.good}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Good threshold</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Code Reference — Profiler API</div>
        <div className="code-block">{`import { Profiler } from 'react'

function onRenderCallback(
  id,             // Component name
  phase,          // "mount" ya "update"
  actualDuration, // Actual render time (ms)
  baseDuration,   // Bina memo ke render time
  startTime,
  commitTime
) {
  console.log(id + ' took ' + actualDuration + 'ms')
  // Yahan metrics ko server par bhej sakte ho!
}

// Wrap component ko Profiler se
<Profiler id="Navigation" onRender={onRenderCallback}>
  <Navigation />
</Profiler>`}</div>
      </div>
    </div>
  )
}
