import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import QRCode from 'qrcode';

const root = process.cwd();
const links = readFileSync(join(root, 'components', 'links.ts'), 'utf8');
const match = links.match(/REGISTER_URL\s*=\s*'([^']+)'/);

if (!match) {
  throw new Error('REGISTER_URL was not found in components/links.ts');
}

const svg = await QRCode.toString(match[1], {
  type: 'svg',
  errorCorrectionLevel: 'H',
  margin: 3,
  color: {
    dark: '#000000',
    light: '#feead5',
  },
});

writeFileSync(join(root, 'public', 'images', 'register-qr.svg'), `${svg}\n`, 'utf8');
console.log(`Generated QR code for ${match[1]}`);
