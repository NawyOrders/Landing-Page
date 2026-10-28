import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const baseUrl = process.env.HERO_BASE_URL || 'http://127.0.0.1:3000';

type HeroCopy = {
  badge: string;
  title1: string;
  title2: string;
  title3: string;
  title3Em: string;
  text: string;
  cta: string;
  imageAlt: string;
};

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
  right: number;
  fontSize: string;
  fontFamily: string;
  lineHeight: string;
  lines: number;
  text: string;
};

type FontReport = {
  cairo: boolean;
  accentFamily: string;
  arefRuqaa: boolean;
  yellowtail: boolean;
  loaded: string[];
};

type LocaleReport = {
  viewportWidth: number;
  viewportHeight: number;
  scrollWidth: number;
  direction: string;
  fonts: FontReport;
  elements: Record<string, Box>;
  consoleErrors: string[];
  failedRequests: string[];
};

type ViewportReport = {
  viewport: { width: number; height: number };
  en: LocaleReport;
  ar: LocaleReport;
  rows: Array<{ element: string; pass: boolean; xDelta: number; wDelta: number; hDelta: number }>;
  gaps: Array<{ gap: string; pass: boolean; delta: number }>;
};

function readSource(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

function heroCopy(locale: 'en' | 'ar'): HeroCopy {
  return JSON.parse(
    readFileSync(join(root, 'tests', 'fixtures', `hero-${locale}.json`), 'utf8')
  ) as HeroCopy;
}

async function loadHeroDictionary(locale: 'en' | 'ar'): Promise<HeroCopy> {
  const href = new URL(`../../lib/i18n/${locale}.ts`, import.meta.url).href;
  const loaded: unknown = await import(href);
  const dictionary = (loaded as Record<string, unknown>)[locale] as { hero: HeroCopy };
  return dictionary.hero;
}

function heroCssRules(): Array<{ selector: string; body: string }> {
  const css = readSource('app/globals.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: Array<{ selector: string; body: string }> = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css))) {
    rules.push({ selector: match[1].trim(), body: match[2] });
  }
  return rules.filter((rule) => rule.selector.includes('.hero'));
}

function fetchHtml(locale: 'en' | 'ar'): string {
  const result = spawnSync(
    process.execPath,
    [
      '-e',
      `fetch(${JSON.stringify(`${baseUrl}/${locale}`)}).then(async (res) => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        process.stdout.write(await res.text());
      }).catch((error) => { console.error(error.message); process.exit(1); });`,
    ],
    { encoding: 'utf8', timeout: 30000 }
  );
  assert.equal(result.status, 0, `Could not load ${baseUrl}/${locale}. Start the app with "npm run build" then "npm run start".\n${result.stderr}`);
  return result.stdout;
}

function sliceHero(html: string): string {
  const start = html.indexOf('class="hero-card"');
  const end = html.indexOf('class="feature-strip-wrap"');
  assert.ok(start >= 0 && end > start, 'Rendered page is missing the hero card');
  return html.slice(start, end);
}

function textContent(html: string): string {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

const enHero: HeroCopy = heroCopy('en');

test('hero CSS uses logical direction properties and mirrors decorative transforms', () => {
  const violations: string[] = [];
  const physicalPatterns: Array<[RegExp, string]> = [
    [/(?:^|[;\s])(left|right)\s*:/, 'physical offset'],
    [/(?:margin|padding|border|scroll-margin|scroll-padding)-(left|right)\s*:/, 'physical spacing'],
    [/text-align\s*:\s*(left|right)\b/, 'physical text alignment'],
    [/transform-origin\s*:\s*(left|right)\b/, 'physical transform origin'],
    [/border-(?:top|bottom)-(?:left|right)-radius/, 'physical corner radius'],
    [/background-position[^;]*\b(?:left|right)\b/, 'physical background position'],
  ];

  for (const rule of heroCssRules()) {
    for (const [pattern, label] of physicalPatterns) {
      if (pattern.test(rule.body)) {
        violations.push(`${label}: ${rule.selector}`);
      }
    }
    const declarations = rule.body.split(';');
    for (const declaration of declarations) {
      if (declaration.includes('translateX(') && !declaration.includes('var(--dir-sign)')) {
        violations.push(`unmirrored translateX: ${rule.selector}`);
      }
    }
  }

  assert.deepEqual(violations, []);
  const css = readSource('app/globals.css');
  assert.match(css, /:root\s*{[\s\S]*?--dir-sign:\s*1/);
  assert.match(css, /\[dir='rtl'\]\s*{[\s\S]*?--dir-sign:\s*-1/);
  assert.match(css, /\.hero-visual\s*{[\s\S]*?var\(--hero-fade-angle\)/);
  assert.match(css, /\[dir='rtl'\]\s+\.hero-fries\s*{[\s\S]*?scaleX\(-1\)/);
  assert.match(
    css,
    /\[dir='rtl'\]\s+\.reveal-ready\s+\.hero-badge\[data-revealed\]\s*{[\s\S]*?flipHorizontalMirrored/
  );
  for (const rule of heroCssRules().filter((item) => item.selector.includes('.hero-visual'))) {
    assert.doesNotMatch(rule.body, /scaleX|rotateY|matrix\(-1/, `mockup must not mirror: ${rule.selector}`);
  }
});

test('hero component has no physical direction utilities or untyped casts', () => {
  const hero = readSource('components/Hero.tsx');
  assert.doesNotMatch(hero, /\b(?:ml|mr|pl|pr|left|right)-/);
  assert.doesNotMatch(hero, /\bas\s+any\b/);
  assert.match(hero, /\[،,—–\]\\s\*\\S\+/);
  assert.match(hero, /className="hero-nowrap"/);
  assert.match(hero, /<h1 className="hero-title"/);
  assert.match(hero, /href="#features"/);
  assert.match(hero, /<ArrowIcon className="hero-cta-arrow"/);
});

test('English and Arabic hero dictionaries share the same shape', async () => {
  const en = await loadHeroDictionary('en');
  const ar = await loadHeroDictionary('ar');
  assert.deepEqual(Object.keys(en).sort(), Object.keys(ar).sort());
  assert.deepEqual(en, enHero);
  assert.deepEqual(ar, heroCopy('ar'));
  for (const key of Object.keys(heroCopy('ar')) as Array<keyof HeroCopy>) {
    assert.equal(typeof ar[key], 'string');
    assert.ok(ar[key].trim().length > 0, `${key} is empty`);
  }
  assert.match(ar.text, /،/);
  assert.doesNotMatch(ar.text, /—/);
});

test('live hero keeps roles, order, copy and decorative semantics in both languages', () => {
  const enHtml = fetchHtml('en');
  const arHtml = fetchHtml('ar');
  const en = sliceHero(enHtml);
  const ar = sliceHero(arHtml);

  assert.match(enHtml, /<html lang="en" dir="ltr"/);
  assert.match(arHtml, /<html lang="ar" dir="rtl"/);
  assert.equal((enHtml.match(/<h1\b/g) || []).length, 1);
  assert.equal((arHtml.match(/<h1\b/g) || []).length, 1);

  for (const [html, copy, locale] of [
    [en, enHero, 'en'],
    [ar, heroCopy('ar'), 'ar'],
  ] as const) {
    const order = ['hero-badge', 'hero-title', 'hero-text', 'hero-cta', 'hero-visual'].map((name) =>
      html.indexOf(name)
    );
    assert.ok(order.every((index) => index >= 0), `${locale}: hero landmarks are missing`);
    assert.deepEqual([...order].sort((a, b) => a - b), order, `${locale}: hero DOM order changed`);

    const paragraph = /<p class="hero-text"[^>]*>([\s\S]*?)<\/p>/.exec(html);
    assert.ok(paragraph, `${locale}: hero paragraph is missing`);
    assert.equal(textContent(paragraph[1]), copy.text);

    assert.ok(textContent(html).includes(copy.badge));
    assert.ok(textContent(html).includes(`${copy.title3} ${copy.title3Em}`));
    assert.ok(textContent(html).includes(copy.cta));
    assert.ok(html.includes(copy.imageAlt));
    assert.match(html, /class="hero-cta-arrow"/);
    assert.match(html, /class="hero-spark hero-spark--cta"[^>]*alt=""/);
    assert.match(html, /class="hero-fries"[^>]*alt=""/);
  }

  assert.match(ar, /class="hero-nowrap"/);
  assert.doesNotMatch(en, /class="hero-nowrap"/);
  assert.doesNotMatch(ar, /All in One|Explore Nawy Orders/);
});

test('measured hero parity passes at every viewport without overflow or runtime errors', { timeout: 240000 }, () => {
  const reportBase = join(tmpdir(), `hero-parity-test-${process.pid}`);
  const markdownPath = `${reportBase}.md`;
  const jsonPath = `${reportBase}.json`;
  const run = spawnSync(
    process.execPath,
    ['scripts/hero-parity.mjs', 'after', markdownPath],
    {
      cwd: root,
      encoding: 'utf8',
      timeout: 230000,
      env: { ...process.env, HERO_BASE_URL: baseUrl },
    }
  );

  try {
    assert.equal(run.status, 0, `Parity harness failed. Start the app on ${baseUrl} first.\n${run.stderr || run.stdout}`);
    assert.ok(existsSync(jsonPath), 'Parity harness did not write JSON results');
    const report = JSON.parse(readFileSync(jsonPath, 'utf8')) as ViewportReport[];
    assert.equal(report.length, 6);

    for (const viewport of report) {
      const label = `${viewport.viewport.width}x${viewport.viewport.height}`;
      assert.deepEqual(viewport.rows.filter((row) => !row.pass), [], `${label}: element mismatches`);
      assert.deepEqual(viewport.gaps.filter((gap) => !gap.pass), [], `${label}: gap mismatches`);
      assert.ok(viewport.en.scrollWidth <= viewport.viewport.width, `${label}: English overflow`);
      assert.ok(viewport.ar.scrollWidth <= viewport.viewport.width, `${label}: Arabic overflow`);
      assert.deepEqual(viewport.en.consoleErrors, [], `${label}: English console errors`);
      assert.deepEqual(viewport.ar.consoleErrors, [], `${label}: Arabic console errors`);
      assert.deepEqual(viewport.en.failedRequests, [], `${label}: English failed requests`);
      assert.deepEqual(viewport.ar.failedRequests, [], `${label}: Arabic failed requests`);

      assert.equal(viewport.en.fonts.accentFamily.includes('Yellowtail'), true);
      assert.equal(viewport.ar.fonts.cairo, true, `${label}: Cairo did not load`);
      assert.ok(viewport.ar.fonts.loaded.includes('Cairo'), `${label}: Cairo is not active`);
      assert.ok(viewport.ar.fonts.loaded.includes('Aref Ruqaa'), `${label}: Aref Ruqaa is not active`);
      assert.ok(viewport.ar.fonts.accentFamily.includes('Aref Ruqaa'), `${label}: Arabic accent font is not applied`);

      assert.equal(
        viewport.ar.elements.accent.lines,
        viewport.en.elements.accent.lines,
        `${label}: accent line count differs`
      );
      assert.equal(
        viewport.ar.elements.paragraph.height,
        viewport.en.elements.paragraph.height,
        `${label}: paragraph block height differs`
      );
    }
  } finally {
    for (const path of [markdownPath, jsonPath]) {
      if (existsSync(path)) rmSync(path, { force: true });
    }
  }
});

test('visual baselines exist for every viewport in both languages', () => {
  for (const viewport of ['1920x1080', '1440x900', '1366x768', '1024x768', '768x1024', '390x844']) {
    for (const locale of ['en', 'ar']) {
      assert.ok(
        existsSync(join(root, 'tests', 'e2e', '__baselines__', `hero-${locale}-${viewport}.png`)),
        `Missing baseline hero-${locale}-${viewport}.png`
      );
    }
  }
});

