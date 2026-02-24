import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const localIndexPath = path.join(root, '../kami/src/index.ts');
const docsRoot = path.join(root, 'content/docs');
const remoteIndexUrl = 'https://raw.githubusercontent.com/jlgrimes/kami/main/src/index.ts';

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
  return `---
title: ${name}
description: ${name} component from the Kami UI library.
---

import { ComponentPreview } from '@/components/component-preview';

## Usage

\`\`\`tsx
import { ${name} } from '@jlgrimes/kami';
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
