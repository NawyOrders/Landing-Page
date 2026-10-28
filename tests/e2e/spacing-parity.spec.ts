import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const baseUrl = process.env.HERO_BASE_URL || 'http://127.0.0.1:3000';

type CssRule = { selector: string; body: string };
type SpacingFailure = {
  path: string;
  tag: string;
  className: string;
  property: string;
  enSide: string;
  arSide: string;
  enValue: number | string;
  arValue: number | string;
  delta: number | null;
};
type StructureDifference = {
  path: string;
  tag: string;
  className: string;
  enValue: string;
  arValue: string;
};
type PageMetrics = {
  innerWidth: number;
  scrollWidth: number;
  overflow: boolean;
};
type ViewportSpacingReport = {
  viewport: { width: number; height: number };
  compared: number;
  failures: SpacingFailure[];
  structure: StructureDifference[];
  metrics: { en: PageMetrics; ar: PageMetrics };
};

const requiredViewports = [
  '2560x1440',
  '1920x1080',
  '1600x900',
  '1440x900',
  '1366x768',
  '1280x800',
  '1024x768',
  '834x1112',
  '768x1024',
  '430x932',
  '390x844',
  '360x800',
];

function cssRules(): CssRule[] {
  const css = readFileSync(join(root, 'app', 'globals.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    ''
  );
  const rules: CssRule[] = [];
  const pattern = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(css))) {
    rules.push({ selector: match[1].trim(), body: match[2] });
  }
  return rules;
}

function declarations(body: string): Array<{ property: string; value: string }> {
  return body
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const separator = declaration.indexOf(':');
      return {
        property: declaration.slice(0, separator).trim().toLowerCase(),
        value: declaration.slice(separator + 1).trim(),
      };
    });
}

test('every margin and padding declaration uses logical properties', () => {
  const violations: string[] = [];
  const physicalSpacing = /^(?:margin|padding)(?:-(?:top|right|bottom|left))?$/;
  for (const rule of cssRules()) {
    for (const declaration of declarations(rule.body)) {
      if (physicalSpacing.test(declaration.property)) {
        violations.push(`${declaration.property}: ${rule.selector}`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test('RTL overrides do not reset or reverse spacing', () => {
  const violations: string[] = [];
  for (const rule of cssRules()) {
    if (!rule.selector.includes("[dir='rtl']")) continue;
    for (const declaration of declarations(rule.body)) {
      if (/^(?:margin|padding)(?:-|$)/.test(declaration.property)) {
        violations.push(`${declaration.property}: ${rule.selector}`);
      }
    }
  }
  assert.deepEqual(violations, []);
});

test(
  'measured whole-site margin and padding parity passes at every viewport',
  { timeout: 300000 },
  () => {
    const reportBase = join(tmpdir(), `spacing-parity-test-${process.pid}`);
    const markdownPath = `${reportBase}.md`;
    const jsonPath = `${reportBase}.json`;
    const run = spawnSync(process.execPath, ['scripts/spacing-parity.mjs', markdownPath], {
      cwd: root,
      encoding: 'utf8',
      timeout: 290000,
      env: { ...process.env, HERO_BASE_URL: baseUrl },
    });

    try {
      assert.equal(
        run.status,
        0,
        `Spacing harness failed. Start the app on ${baseUrl} first.\n${run.stderr || run.stdout}`
      );
      assert.ok(existsSync(jsonPath), 'Spacing harness did not write JSON results');
      const report = JSON.parse(readFileSync(jsonPath, 'utf8')) as ViewportSpacingReport[];
      const seen = report.map((result) => `${result.viewport.width}x${result.viewport.height}`);
      assert.deepEqual(seen, requiredViewports);

      for (const result of report) {
        assert.ok(
          result.compared >= 500,
          `${result.viewport.width}x${result.viewport.height}: too few elements compared`
        );
        assert.deepEqual(
          result.failures,
          [],
          `${result.viewport.width}x${result.viewport.height}: RTL margin/padding mismatch`
        );
        assert.equal(
          result.metrics.en.overflow || result.metrics.ar.overflow,
          false,
          `${result.viewport.width}x${result.viewport.height}: horizontal overflow`
        );
      }
    } finally {
      rmSync(markdownPath, { force: true });
      rmSync(jsonPath, { force: true });
    }
  }
);
