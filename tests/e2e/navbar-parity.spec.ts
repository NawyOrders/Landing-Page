import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const baseUrl = process.env.HERO_BASE_URL || 'http://127.0.0.1:3000';
const requiredViewports = [
  '1440x900',
  '1280x800',
  '1120x800',
  '1024x768',
  '768x1024',
  '390x844',
  '360x800',
];

type Box = { x: number; y: number; right: number; bottom: number; width: number; height: number };
type Snapshot = {
  position: string;
  insetTop: string;
  boxShadow: string;
  scrolled: boolean;
  header: Box;
  toggleVisible: boolean;
  activeHref: string | null;
  overflow: boolean;
};
type Menu = {
  headerBottom: number;
  rect: Box;
  links: Array<{ href: string }>;
};
type LocaleReport = {
  top: Snapshot;
  scrolled: Snapshot;
  menuOpened: Menu | null;
  menuClosed: boolean;
  anchor: {
    scrollY: number;
    targetTop: number;
    headerTop: number;
    activeHref: string | null;
    menuOpen: boolean;
    overflow: boolean;
  };
};
type ViewportReport = {
  viewport: { width: number; height: number };
  en: LocaleReport;
  ar: LocaleReport;
  failures: string[];
};

function cssRules(): Array<{ selector: string; body: string }> {
  const css = readFileSync(join(root, 'app', 'globals.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    ''
  );
  const rules: Array<{ selector: string; body: string }> = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css))) {
    rules.push({ selector: match[1].trim(), body: match[2] });
  }
  return rules;
}

test('sticky header uses a scroll-safe root and one anchor offset', () => {
  const rules = cssRules();
  const header = rules.find((rule) => rule.selector === '.site-header');
  const scrolledHeader = rules.find((rule) => rule.selector === '.site-header.is-scrolled');
  const body = rules.find((rule) => rule.selector === 'body');
  assert.ok(header, 'Missing .site-header rule');
  assert.match(header.body, /position\s*:\s*sticky/);
  assert.match(header.body, /top\s*:\s*0(?:px)?\s*;/);
  assert.ok(scrolledHeader, 'Missing .site-header.is-scrolled rule');
  assert.match(scrolledHeader.body, /box-shadow\s*:/);
  assert.ok(body, 'Missing body rule');
  assert.match(body.body, /overflow-x\s*:\s*clip/);
  assert.doesNotMatch(body.body, /overflow-x\s*:\s*(?:hidden|auto|scroll)/);

  const css = readFileSync(join(root, 'app', 'globals.css'), 'utf8');
  assert.match(css, /scroll-padding-top\s*:\s*96px/);
  assert.doesNotMatch(css, /section\[id\]\s*{[^}]*scroll-margin-top/);
});

test(
  'navbar scroll behavior is identical in English and Arabic at every breakpoint',
  { timeout: 300000 },
  () => {
    const reportBase = join(tmpdir(), `navbar-parity-test-${process.pid}`);
    const markdownPath = `${reportBase}.md`;
    const jsonPath = `${reportBase}.json`;
    const run = spawnSync(process.execPath, ['scripts/navbar-parity.mjs', markdownPath], {
      cwd: root,
      encoding: 'utf8',
      timeout: 290000,
      env: { ...process.env, HERO_BASE_URL: baseUrl },
    });

    try {
      assert.equal(
        run.status,
        0,
        `Navbar harness failed. Start the app on ${baseUrl} first.\n${run.stderr || run.stdout}`
      );
      assert.ok(existsSync(jsonPath), 'Navbar harness did not write JSON results');
      const report = JSON.parse(readFileSync(jsonPath, 'utf8')) as ViewportReport[];
      assert.deepEqual(
        report.map((result) => `${result.viewport.width}x${result.viewport.height}`),
        requiredViewports
      );

      for (const result of report) {
        const name = `${result.viewport.width}x${result.viewport.height}`;
        assert.deepEqual(result.failures, [], `${name}: navbar scroll parity mismatch`);
        assert.equal(result.en.top.position, 'sticky', `${name}: EN header is not sticky`);
        assert.equal(result.ar.top.position, 'sticky', `${name}: AR header is not sticky`);
        assert.equal(result.en.top.boxShadow, 'none', `${name}: EN header has a top shadow`);
        assert.equal(result.ar.top.boxShadow, 'none', `${name}: AR header has a top shadow`);
        assert.notEqual(
          result.en.scrolled.boxShadow,
          'none',
          `${name}: EN header has no scroll shadow`
        );
        assert.notEqual(
          result.ar.scrolled.boxShadow,
          'none',
          `${name}: AR header has no scroll shadow`
        );
        assert.equal(
          result.en.scrolled.boxShadow,
          result.ar.scrolled.boxShadow,
          `${name}: scroll shadow differs by locale`
        );
        assert.ok(
          Math.abs(result.en.scrolled.header.y) <= 2,
          `${name}: EN header scrolled away`
        );
        assert.ok(
          Math.abs(result.ar.scrolled.header.y) <= 2,
          `${name}: AR header scrolled away`
        );
        assert.equal(result.en.anchor.activeHref, '#pricing', `${name}: EN active link`);
        assert.equal(result.ar.anchor.activeHref, '#pricing', `${name}: AR active link`);
        assert.ok(
          Math.abs(result.en.anchor.targetTop - 96) <= 2,
          `${name}: EN anchor offset`
        );
        assert.ok(
          Math.abs(result.ar.anchor.targetTop - 96) <= 2,
          `${name}: AR anchor offset`
        );
        assert.equal(
          Boolean(result.en.menuOpened),
          Boolean(result.ar.menuOpened),
          `${name}: mobile menu availability`
        );
      }
    } finally {
      rmSync(markdownPath, { force: true });
      rmSync(jsonPath, { force: true });
    }
  }
);
