import React, { useState, useMemo } from 'react'
import { FixedSizeList } from 'react-window'

// Generate 10,000 fake products
const PRODUCTS = Array.from({ length: 10000 }, (_, i) => ({
  id: i + 1,
  name: `Product_${String(i+1).padStart(5,'0')}`,
  price: (Math.random() * 9900 + 100).toFixed(2),
  category: ['Electronics','Clothing','Books','Food','Sports'][i % 5],
  stock: Math.floor(Math.random() * 500),
}))

const CATEGORY_COLORS = {
  Electronics: '#3399ff',
  Clothing: '#ff3366',
  Books: '#ffaa00',
  Food: '#00ff88',
  Sports: '#cc66ff',
}

function Row({ index, style, data }) {
  const item = data[index]
  const color = CATEGORY_COLORS[item.category]
  return (
    <div style={{ ...style, display: 'flex', alignItems: 'center', padding: '0 1rem', borderBottom: '1px solid #1a1a2a', gap: '1rem', fontSize: '0.72rem' }}>
      <span style={{ color: '#444466', width: '50px', flexShrink: 0 }}>#{item.id}</span>
      <span style={{ flex: 1, color: '#e0e0f0' }}>{item.name}</span>
      <span style={{ color: '#00ff88', width: '80px', flexShrink: 0 }}>₹{item.price}</span>
      <span style={{ color, width: '90px', flexShrink: 0, fontSize: '0.65rem', border: `1px solid ${color}`, padding: '0.1rem 0.4rem' }}>{item.category}</span>
      <span style={{ color: '#7070a0', width: '60px', flexShrink: 0 }}>Qty: {item.stock}</span>
    </div>
  )
}

export default function VirtualDemo() {
  const [filter, setFilter] = useState('All')
  const [renderMode, setRenderMode] = useState('virtual')
  const [normalVisible, setNormalVisible] = useState(50)

  const filtered = useMemo(() => {
    if (filter === 'All') return PRODUCTS
    return PRODUCTS.filter(p => p.category === filter)
  }, [filter])

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title"><span>List Virtualization</span> with react-window</h2>
        <p className="page-desc">10,000 items render karne ki koshish karo bina virtualization ke — browser hang ho jayega! Virtualization sirf visible rows render karta hai, baki ko skip karta hai. Yahi magic hai.</p>
      </div>

      <div className="two-col" style={{ marginBottom: '1.5rem' }}>
        <div className="card">
          <div className="card-title">Performance Stats</div>
          <div className="metric"><span>Total Items</span><span className="metric-val">{PRODUCTS.length.toLocaleString()}</span></div>
          <div className="metric"><span>Filtered Items</span><span className="metric-val">{filtered.length.toLocaleString()}</span></div>
          <div className="metric"><span>DOM Nodes (Virtual)</span><span className="metric-val">~15</span></div>
          <div className="metric"><span>DOM Nodes (Normal)</span><span className="metric-val" style={{color:'var(--accent2)'}}>10,000 ⚠️</span></div>
          <div className="metric"><span>Render Time</span><span className="metric-val">~50ms</span></div>
        </div>
        <div className="card">
          <div className="card-title">Filter by Category</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {['All','Electronics','Clothing','Books','Food','Sports'].map(cat => (
              <button key={cat} className="btn" style={{ 
                borderColor: filter===cat ? 'var(--accent)' : 'var(--border)',
                color: filter===cat ? 'var(--accent)' : 'var(--text-dim)',
                padding: '0.4rem 0.75rem', fontSize: '0.65rem'
              }} onClick={() => setFilter(cat)}>{cat}</button>
            ))}
          </div>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button className={`btn ${renderMode==='virtual'?'':'btn-danger'}`} onClick={() => setRenderMode('virtual')} style={{fontSize:'0.65rem'}}>⚡ Virtual</button>
            <button className={`btn ${renderMode==='normal'?'':'btn-danger'}`} onClick={() => setRenderMode('normal')} style={{fontSize:'0.65rem', borderColor:'var(--accent2)', color:'var(--accent2)'}}>⚠️ Normal (slow!)</button>
          </div>
        </div>
      </div>

      {/* List header */}
      <div style={{ display: 'flex', padding: '0.5rem 1rem', gap: '1rem', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid var(--accent)', marginBottom: '0' }}>
        <span style={{width:'50px'}}>ID</span>
        <span style={{flex:1}}>Name</span>
        <span style={{width:'80px'}}>Price</span>
        <span style={{width:'90px'}}>Category</span>
        <span style={{width:'60px'}}>Stock</span>
      </div>

      {renderMode === 'virtual' ? (
        <FixedSizeList
          height={420}
          itemCount={filtered.length}
          itemSize={44}
          width="100%"
          itemData={filtered}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          {Row}
        </FixedSizeList>
      ) : (
        <div style={{ height: '420px', overflow: 'auto', background: 'var(--surface)', border: '1px solid var(--accent2)' }}>
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,51,102,0.1)', fontSize: '0.7rem', color: 'var(--accent2)' }}>
            ⚠️ Normal rendering — showing first {normalVisible} of {filtered.length} (rendering all at once is slow!)
          </div>
          {filtered.slice(0, normalVisible).map((item, i) => (
            <Row key={item.id} index={i} style={{ position: 'relative', height: 44 }} data={filtered} />
          ))}
          {normalVisible < filtered.length && (
            <button className="btn" onClick={() => setNormalVisible(v => v + 50)} style={{ margin: '1rem', fontSize: '0.65rem' }}>Load 50 more...</button>
          )}
        </div>
      )}

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div className="card-title">Code Reference</div>
        <div className="code-block">{`import { FixedSizeList } from 'react-window'

// Sirf visible items render hote hain!
<FixedSizeList
  height={600}         // container height
  itemCount={10000}    // total items
  itemSize={50}        // har row ki height (pixels)
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>  // style zaruri hai position ke liye
      {items[index].name}
    </div>
  )}
</FixedSizeList>`}</div>
      </div>
    </div>
  )
}
