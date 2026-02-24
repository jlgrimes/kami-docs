import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const localIndexPath = path.join(root, '../kami/src/index.ts');
const docsRoot = path.join(root, 'content/docs');
const remoteIndexUrl = 'https://raw.githubusercontent.com/jlgrimes/kami/main/src/index.ts';

const docsMeta = {
  Button: {
    usedFor: 'Primary and secondary taps across mobile flows.',
    features: ['44px+ touch targets', 'tap-friendly spacing', 'variant support for primary/secondary/ghost'],
    example: `<Button variant="primary" onClick={saveDraft}>Save draft</Button>`,
  },
  Input: {
    usedFor: 'Collecting text on forms and onboarding screens.',
    features: ['mobile keyboard friendly', 'supports labels + helper/error text', 'works in tight mobile layouts'],
    example: `<Input label="Email" placeholder="you@domain.com" value={email} onChange={setEmail} />`,
  },
  SearchBar: {
    usedFor: 'Top-of-screen search in list and content views.',
    features: ['mobile search UX', 'cancel flow support', 'optimized for thumb typing'],
    example: `<SearchBar value={query} onChange={setQuery} placeholder="Search lessons…" />`,
  },
  Switch: {
    usedFor: 'Boolean settings and quick toggles.',
    features: ['iOS-style visual language', 'clear on/off affordance', 'good for dense mobile settings pages'],
    example: `<Switch checked={notifications} onChange={setNotifications} label="Notifications" />`,
  },
  Select: {
    usedFor: 'Choosing one option from a mobile-friendly picker UI.',
    features: ['works well with touch', 'clear value display', 'usable in forms and settings'],
    example: `<Select value={language} onChange={setLanguage} options={languageOptions} />`,
  },
  BottomSheet: {
    usedFor: 'Contextual actions and content without leaving current screen.',
    features: ['mobile-native interaction pattern', 'focuses user attention', 'great for actions/forms on small screens'],
    example: `<BottomSheet open={open} onClose={() => setOpen(false)} title="Filters">...</BottomSheet>`,
  },
  ActionSheet: {
    usedFor: 'Presenting a short list of actions in a mobile-native way.',
    features: ['destructive action emphasis', 'single-purpose action lists', 'touch-friendly action rows'],
    example: `<ActionSheet open={open} onClose={close} actions={actions} />`,
  },
  Toast: {
    usedFor: 'Lightweight feedback after user actions.',
    features: ['non-blocking UX', 'good for save/sync confirmations', 'works in fast mobile workflows'],
    example: `<Toast kind="success" message="Saved" />`,
  },
  TabBar: {
    usedFor: 'Primary app-level navigation in mobile shells.',
    features: ['thumb-friendly layout', 'clear active state', 'supports persistent navigation'],
    example: `<TabBar tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />`,
  },
  Navbar: {
    usedFor: 'Top navigation with title/back actions on mobile pages.',
    features: ['compact mobile header', 'space for leading actions', 'consistent page chrome'],
    example: `<Navbar title="Profile" onBack={goBack} />`,
  },
};

function toKebabCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/_/g, '-').toLowerCase();
}

function cleanExportName(raw) {
  return raw.split(' as ')[0].trim();
}

function parseComponentNames(indexContent) {
  const names = new Set();
  const exportBlockRegex = /export\s*\{([^}]+)\}\s*from\s*['\"]\.\//g;

  for (const match of indexContent.matchAll(exportBlockRegex)) {
    const chunk = match[1] ?? '';
    for (const raw of chunk.split(',')) {
      const name = cleanExportName(raw);
      if (!name || !/^[A-Z]/.test(name)) continue;
      if (name.endsWith('Props') || name.endsWith('Options')) continue;
      names.add(name);
    }
  }

  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

async function getIndexContent() {
  try {
    return await fs.readFile(localIndexPath, 'utf8');
  } catch {}
  const res = await fetch(remoteIndexUrl);
  if (!res.ok) throw new Error(`Failed to fetch ${remoteIndexUrl}: ${res.status}`);
  return res.text();
}

function componentPage(name) {
  const meta = docsMeta[name] ?? {
    usedFor: `${name} is used to build mobile-first UI flows in Kami.`,
    features: ['mobile-ready styling', 'works with touch-first layouts', 'designed for Capacitor/web apps'],
    example: `<${name} />`,
  };

  return `---
title: ${name}
description: ${name} component from the Kami UI library.
---

import { ComponentPreview } from '@/components/component-preview';

## What this is used for

${meta.usedFor}

## Mobile-focused features

${meta.features.map((f) => `- ${f}`).join('\n')}

## Implementation example

\`\`\`tsx
import { ${name} } from '@kamiui/kami';

${meta.example}
\`\`\`

## Preview

<ComponentPreview name="${name}" />
`;
}

async function main() {
  const indexContent = await getIndexContent();
  const names = parseComponentNames(indexContent);

  const keep = new Set(['index', 'meta']);
  for (const name of names) {
    const slug = toKebabCase(name);
    keep.add(slug);
    await fs.writeFile(path.join(docsRoot, `${slug}.mdx`), componentPage(name), 'utf8');
  }

  const files = await fs.readdir(docsRoot, { withFileTypes: true });
  for (const f of files) {
    if (!f.isFile() || !f.name.endsWith('.mdx')) continue;
    const slug = f.name.replace(/\.mdx$/, '');
    if (!keep.has(slug)) await fs.unlink(path.join(docsRoot, f.name));
  }

  await fs.rm(path.join(docsRoot, 'components'), { recursive: true, force: true });

  await fs.writeFile(
    path.join(docsRoot, 'meta.json'),
    JSON.stringify({ title: 'Kami Docs', pages: ['index', ...names.map(toKebabCase)] }, null, 2) + '\n',
    'utf8',
  );

  console.log(`Generated ${names.length} component pages.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
