import * as React from 'react';

export function ComponentPreview({ name }: { name: string }) {
  const lower = name.toLowerCase();

  if (lower.includes('button')) return <button style={btn}>Button</button>;
  if (lower.includes('input') || lower.includes('search')) return <input style={input} placeholder={name} />;
  if (lower.includes('switch')) return <div style={pill}><div style={dot} /></div>;
  if (lower.includes('badge') || lower.includes('chip')) return <span style={badge}>{name}</span>;
  if (lower.includes('progress')) return <div style={bar}><div style={{ ...fill, width: '45%' }} /></div>;

  return (
    <div style={card}>
      <strong>{name}</strong>
      <div style={{ opacity: 0.7, marginTop: 6 }}>Preview scaffold (docs mode)</div>
    </div>
  );
}

const card: React.CSSProperties = { border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 };
const btn: React.CSSProperties = { border: 'none', borderRadius: 10, padding: '10px 14px', background: '#111827', color: 'white' };
const input: React.CSSProperties = { border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 12px', width: '100%' };
const badge: React.CSSProperties = { background: '#eef2ff', color: '#3730a3', borderRadius: 9999, padding: '4px 10px', fontSize: 12 };
const bar: React.CSSProperties = { background: '#e5e7eb', borderRadius: 9999, height: 10, overflow: 'hidden' };
const fill: React.CSSProperties = { background: '#111827', height: '100%' };
const pill: React.CSSProperties = { width: 44, height: 24, borderRadius: 9999, background: '#22c55e', position: 'relative' };
const dot: React.CSSProperties = { width: 20, height: 20, borderRadius: '50%', background: 'white', position: 'absolute', right: 2, top: 2 };
