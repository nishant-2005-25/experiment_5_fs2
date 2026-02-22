import React, { useState, lazy, Suspense } from 'react'
import './App.css'

const MemoDemo = lazy(() => import('./pages/MemoDemo.jsx'))
const VirtualDemo = lazy(() => import('./pages/VirtualDemo.jsx'))
const LazyDemo = lazy(() => import('./pages/LazyDemo.jsx'))
const DebounceDemo = lazy(() => import('./pages/DebounceDemo.jsx'))
const ProfilerDemo = lazy(() => import('./pages/ProfilerDemo.jsx'))

const TABS = [
  { id: 'memo', label: '01. React.memo', icon: '🧠' },
  { id: 'virtual', label: '02. Virtualization', icon: '📋' },
  { id: 'lazy', label: '03. Lazy Loading', icon: '⚡' },
  { id: 'debounce', label: '04. Debouncing', icon: '🔍' },
  { id: 'profiler', label: '05. Profiler API', icon: '📊' },
]

function LoadingFallback() {
  return (
    <div className="loading-screen">
      <div className="loading-bar">
        <div className="loading-fill" />
      </div>
      <p className="loading-text">LOADING MODULE<span className="blink">_</span></p>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('memo')

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="badge">CU — CHANDIGARH UNIVERSITY</div>
          <div className="badge badge-right">23CSH-382 / SEM-4</div>
        </div>
        <div className="header-main">
          <div className="header-code">EXPERIMENT_05</div>
          <h1 className="header-title">React Performance<br />Optimization</h1>
          <h2 className="header-title">Nishant Verma(23BAI70013)<br /></h2>
          <p className="header-sub">CO2 · BT3 · Mr. Pritam das(E19816)</p>
        </div>
        <div className="header-grid-bg" aria-hidden="true">
          {Array.from({length: 20}).map((_,i)=><div key={i} className="grid-cell"/>)}
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="main-content">
        <Suspense fallback={<LoadingFallback />}>
          {activeTab === 'memo' && <MemoDemo />}
          {activeTab === 'virtual' && <VirtualDemo />}
          {activeTab === 'lazy' && <LazyDemo />}
          {activeTab === 'debounce' && <DebounceDemo />}
          {activeTab === 'profiler' && <ProfilerDemo />}
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>FULL STACK II · 2025–26 EVEN SEMESTER</span>
        <span className="footer-dot">◆</span>
        <span>Optimize Wisely, Ship Quickly</span>
      </footer>
    </div>
  )
}
