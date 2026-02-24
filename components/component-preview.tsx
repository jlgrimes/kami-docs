export function ComponentPreview({ name }: { name: string }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
      <strong>{name}</strong>
      <div style={{ opacity: 0.75, marginTop: 6 }}>
        Live component rendering is disabled in docs-only deploy mode.
      </div>
    </div>
  );
}
