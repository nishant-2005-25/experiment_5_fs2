import React, { useState, useMemo, useCallback, memo } from 'react'

// ─── Without memo ───
function WithoutMemo({ value, onClick }) {
  console.log('⚠️ WithoutMemo rendered!')
  return (
    <div style={{ padding: '0.75rem', background: 'rgba(255,51,102,0.08)', border: '1px solid rgba(255,51,102,0.3)', borderRadius: '2px', fontSize: '0.75rem' }}>
      <div style={{ color: '#ff3366', fontSize: '0.65rem', marginBottom: '0.25rem' }}>WITHOUT React.memo</div>
      Value: <strong style={{ color: '#fff' }}>{value}</strong> — re-renders every time parent updates!
    </div>
  )
}

// ─── With memo ───
const WithMemo = memo(function WithMemo({ value, onClick }) {
  console.log('✅ WithMemo rendered!')
  return (
    <div style={{ padding: '0.75rem', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '2px', fontSize: '0.75rem' }}>
      <div style={{ color: '#00ff88', fontSize: '0.65rem', marginBottom: '0.25rem' }}>WITH React.memo</div>
      Value: <strong style={{ color: '#fff' }}>{value}</strong> — only re-renders when props change!
    </div>
  )
})

export default function MemoDemo() {
  const [count, setCount] = useState(0)
  const [childVal, setChildVal] = useState(42)
  const [renders, setRenders] = useState({ without: 0, with: 0 })
  const [log, setLog] = useState([])

  const addLog = (msg, type) => {
    setLog(prev => [...prev.slice(-6), { msg, type, id: Date.now() }])
  }

  // Stable callback with useCallback
  const stableCallback = useCallback(() => {
    addLog('Child button clicked!', 'info')
  }, [])

  // useMemo for expensive calculation
  const expensiveResult = useMemo(() => {
    let total = 0
    for (let i = 0; i < 1_000_000; i++) total += i
    return total + childVal
  }, [childVal])

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"><span>React.memo</span> + useMemo + useCallback</h2>
        <p className="page-desc">Memoization ka matlab hai — ek kaam baar baar mat karo jab zarurat na ho. React.memo component ko wrap karta hai, useMemo values cache karta hai, useCallback functions ko stable rakhta hai.</p>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Parent State Controls</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn" onClick={() => { setCount(c => c+1); addLog(`Parent re-rendered (count=${count+1})`, 'warn') }}>
              Update Parent State → count: {count}
            </button>
            <button className="btn" onClick={() => { setChildVal(v => v+10); addLog('Child value changed!', 'ok') }}>
              Change Child Value → {childVal}
            </button>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <WithoutMemo value={childVal} onClick={stableCallback} />
            <WithMemo value={childVal} onClick={stableCallback} />
          </div>
        </div>

        <div className="card">
          <div className="card-title">useMemo — Expensive Calculation</div>
          <div className="metric">
            <span>Sum(0..1M) + childVal</span>
            <span className="metric-val">{expensiveResult.toLocaleString()}</span>
          </div>
          <div className="metric">
            <span>Only recalculates when</span>
            <span className="tag tag-green">childVal changes</span>
          </div>
          <div className="metric">
            <span>Parent re-renders skip it</span>
            <span className="tag tag-green">CACHED ✓</span>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <div className="card-title">Console Log</div>
            <div style={{ background: '#0d0d14', border: '1px solid var(--border)', padding: '0.75rem', minHeight: '120px', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
              {log.length === 0 && <span style={{color:'var(--text-dim)'}}>// Click buttons to see logs...</span>}
              {log.map(l => (
                <div key={l.id} style={{ color: l.type === 'warn' ? '#ffaa00' : l.type === 'ok' ? 'var(--accent)' : 'var(--accent3)', animation: 'fadeIn 0.2s ease' }}>
                  {'> '}{l.msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Code Reference</div>
        <div className="code-block">{`// React.memo — shallow comparison se rokta hai re-render
const ExpensiveChild = React.memo(({ value }) => {
  return <div>{value}</div>
})

// useMemo — heavy calculation cache karo
const result = useMemo(() => {
  return items.reduce((sum, i) => sum + i.price, 0)
}, [items])   // sirf 'items' change hone par recalculate

// useCallback — function reference stable rakho
const handleClick = useCallback(() => {
  doSomething()
}, [])  // empty array = kabhi recreate mat karo`}</div>
      </div>
    </div>
  )
}
