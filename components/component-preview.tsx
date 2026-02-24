'use client';

import * as React from 'react';

type KamiModule = Record<string, React.ComponentType<any>>;

const presets: Record<string, Record<string, unknown>> = {
  Button: { children: 'Continue' },
  Input: { label: 'Email', placeholder: 'you@domain.com', value: '', onChange: () => {} },
  SearchBar: { value: '', onChange: () => {}, placeholder: 'Search…' },
  Switch: { checked: true, onChange: () => {}, label: 'Enabled' },
  Select: {
    value: 'ja',
    onChange: () => {},
    options: [
      { value: 'ja', label: 'Japanese' },
      { value: 'en', label: 'English' },
    ],
  },
  Badge: { children: 'Beta' },
  Chip: { label: 'New' },
  Card: { children: 'Card content' },
  Navbar: { title: 'Settings', onBack: () => {} },
  EmptyState: { title: 'No items yet' },
  ProgressBar: { value: 45 },
};

function Fallback({ name }: { name: string }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <strong>{name}</strong>
      <div style={{ opacity: 0.7, marginTop: 6 }}>Preview coming soon</div>
    </div>
  );
}

export function ComponentPreview({ name }: { name: string }) {
  const [mod, setMod] = React.useState<KamiModule | null>(null);

  React.useEffect(() => {
    import('@kamiui/kami')
      .then((m) => setMod(m as unknown as KamiModule))
      .catch(() => setMod(null));
  }, []);

  if (!mod) return <Fallback name={name} />;

  const Component = mod[name];
  if (!Component) return <Fallback name={name} />;

  try {
    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
        <Component {...(presets[name] ?? {})} />
      </div>
    );
  } catch {
    return <Fallback name={name} />;
  }
}
