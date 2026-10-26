import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const source = readFileSync(join(root, 'app', 'icon.svg'));
const outDir = join(root, 'public', 'icons');
const background = '#e43820';

async function renderIcon(size, filename, padding = 0) {
  const inner = Math.round(size * (1 - padding * 2));
  const mark = await sharp(source).resize(inner, inner).png().toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .flatten({ background })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(join(outDir, filename));
}

await renderIcon(192, 'icon-192.png');
await renderIcon(512, 'icon-512.png');
await renderIcon(512, 'icon-maskable-512.png', 0.12);
await renderIcon(180, 'apple-touch-icon.png', 0.06);

console.log('Generated PWA icons in public/icons');
