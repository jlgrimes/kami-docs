import * as React from 'react';

export function ComponentPreview({ name }: { name: string }) {
  switch (name) {
    case 'Button':
      return <button style={btn}>Continue</button>;
    case 'Input':
      return <input style={input} placeholder="Email address" />;
    case 'SearchBar':
      return <input style={input} placeholder="Search lessons…" />;
    case 'Switch':
      return <div style={pill}><div style={dot} /></div>;
    case 'Select':
      return <div style={select}>Japanese ▾</div>;
    case 'BottomSheet':
      return <div style={sheet}>Bottom sheet content</div>;
    case 'ActionSheet':
      return <div style={sheet}><div style={action}>Share</div><div style={action}>Delete</div></div>;
    case 'Toast':
    case 'ToastProvider':
      return <div style={toast}>Saved successfully</div>;
    case 'TabBar':
      return <div style={tabbar}><span>Home</span><span style={{opacity:.6}}>Search</span><span style={{opacity:.6}}>Profile</span></div>;
    case 'Navbar':
      return <div style={nav}>◀ Back<span style={{marginLeft:8,fontWeight:600}}>Settings</span></div>;
    default:
      return (
        <div style={card}>
          <strong>{name}</strong>
          <div style={{ opacity: 0.7, marginTop: 6 }}>Preview coming soon</div>
        </div>
      );
  }
}

const card: React.CSSProperties = { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 };
const btn: React.CSSProperties = { border: 'none', borderRadius: 10, padding: '10px 14px', background: '#111827', color: 'white' };
const input: React.CSSProperties = { border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 12px', width: '100%' };
const select: React.CSSProperties = { border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 12px', width: '100%', background: 'white' };
const sheet: React.CSSProperties = { border: '1px solid #e5e7eb', borderRadius: 16, padding: 14, background: '#fff' };
const action: React.CSSProperties = { padding: '10px 0', borderBottom: '1px solid #f1f5f9' };
const toast: React.CSSProperties = { background: '#111827', color: 'white', borderRadius: 10, padding: '10px 12px', display: 'inline-block' };
const tabbar: React.CSSProperties = { display: 'flex', gap: 14, border: '1px solid #e5e7eb', borderRadius: 9999, padding: '8px 12px', width: 'fit-content' };
const nav: React.CSSProperties = { display: 'flex', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: 8 };
const pill: React.CSSProperties = { width: 44, height: 24, borderRadius: 9999, background: '#22c55e', position: 'relative' };
const dot: React.CSSProperties = { width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', right: 2, top: 2 };
