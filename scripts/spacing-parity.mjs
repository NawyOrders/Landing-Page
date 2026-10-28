import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE_URL = process.env.HERO_BASE_URL || 'http://127.0.0.1:3000';
const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9224;
const TOLERANCE = 0.6;
const VIEWPORTS = [
  { width: 2560, height: 1440 },
  { width: 1920, height: 1080 },
  { width: 1600, height: 900 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 834, height: 1112 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
];

const measureInPage = async () => {
  await document.fonts.ready;
  const style = document.createElement('style');
  style.textContent =
    '*,*::before,*::after{animation:none!important;transition:none!important}.reveal-ready [data-reveal]{opacity:1!important;transform:none!important;filter:none!important}';
  document.head.appendChild(style);
  document.querySelectorAll('[data-reveal]').forEach((element) => {
    element.setAttribute('data-revealed', '');
  });
  document.documentElement.classList.remove('reveal-ready');
  window.scrollTo(0, 0);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const elementPath = (element) => {
    const parts = [];
    let node = element;
    while (node && node.nodeType === Node.ELEMENT_NODE) {
      const parent = node.parentElement;
      const index = parent ? Array.prototype.indexOf.call(parent.children, node) : 0;
      parts.unshift(`${node.tagName.toLowerCase()}:${index}`);
      node = parent;
    }
    return parts.join('>');
  };

  const px = (value) => {
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? Math.round(number * 100) / 100 : value;
  };

  const elements = Array.from(document.querySelectorAll('body, body *')).map((element) => {
    const computed = getComputedStyle(element);
    const specified = element.computedStyleMap();
    const isAuto = (side) => specified.get(`margin-${side}`)?.toString() === 'auto';
    return {
      path: elementPath(element),
      tag: element.tagName.toLowerCase(),
      className: typeof element.className === 'string' ? element.className : '',
      margin: {
        top: px(computed.marginTop),
        right: px(computed.marginRight),
        bottom: px(computed.marginBottom),
        left: px(computed.marginLeft),
      },
      marginAuto: {
        top: isAuto('top'),
        right: isAuto('right'),
        bottom: isAuto('bottom'),
        left: isAuto('left'),
      },
      padding: {
        top: px(computed.paddingTop),
        right: px(computed.paddingRight),
        bottom: px(computed.paddingBottom),
        left: px(computed.paddingLeft),
      },
    };
  });

  return {
    elements,
    metrics: {
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    },
  };
};

function connectCdp(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    ws.addEventListener('open', () => resolve({ ws, send }));
    ws.addEventListener('error', reject);
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      const item = pending.get(message.id);
      if (!item) return;
      pending.delete(message.id);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result);
    });

    function send(method, params = {}) {
      const messageId = ++id;
      return new Promise((resolveSend, rejectSend) => {
        pending.set(messageId, { resolve: resolveSend, reject: rejectSend });
        ws.send(JSON.stringify({ id: messageId, method, params }));
      });
    }
  });
}

async function newPage() {
  const response = await fetch(
    `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent('about:blank')}`,
    { method: 'PUT' }
  );
  return response.json();
}

function near(enValue, arValue) {
  if (typeof enValue === 'number' && typeof arValue === 'number') {
    return Math.abs(enValue - arValue) <= TOLERANCE;
  }
  return enValue === arValue;
}

function compareSides(en, ar, property, side) {
  const mirrored = side === 'left' ? 'right' : side === 'right' ? 'left' : side;
  if (property === 'margin' && en.marginAuto[side] && ar.marginAuto[mirrored]) {
    return null;
  }
  const enValue = en[property][side];
  const arValue = ar[property][mirrored];
  if (near(enValue, arValue)) return null;
  return {
    property,
    enSide: side,
    arSide: mirrored,
    enValue: en.marginAuto[side] && property === 'margin' ? 'auto' : enValue,
    arValue: ar.marginAuto[mirrored] && property === 'margin' ? 'auto' : arValue,
    delta:
      typeof enValue === 'number' && typeof arValue === 'number'
        ? Math.round((arValue - enValue) * 100) / 100
        : null,
  };
}

function compareViewport(enElements, arElements) {
  const enByPath = new Map(enElements.map((element) => [element.path, element]));
  const arByPath = new Map(arElements.map((element) => [element.path, element]));
  const failures = [];
  const structure = [];

  for (const [path, en] of enByPath) {
    const ar = arByPath.get(path);
    if (!ar) {
      structure.push({
        path,
        tag: en.tag,
        className: en.className,
        enValue: 'present',
        arValue: 'missing',
      });
      continue;
    }

    for (const property of ['margin', 'padding']) {
      for (const side of ['top', 'right', 'bottom', 'left']) {
        const failure = compareSides(en, ar, property, side);
        if (failure) {
          failures.push({
            path,
            tag: en.tag,
            className: en.className,
            ...failure,
          });
        }
      }
    }
  }

  for (const [path, ar] of arByPath) {
    if (enByPath.has(path)) continue;
    structure.push({
      path,
      tag: ar.tag,
      className: ar.className,
      enValue: 'missing',
      arValue: 'present',
    });
  }

  return { compared: Math.min(enByPath.size, arByPath.size), failures, structure };
}

function markdownReport(results) {
  const lines = [
    '# Whole-site spacing parity',
    '',
    'Generated by `scripts/spacing-parity.mjs` against the production build.',
    'Values are computed CSS pixels. EN left is compared with AR right and EN right with AR left; top/bottom stay top/bottom. Matching logical `auto` margins are not treated as spacing mismatches.',
    '',
    '| Viewport | Elements compared | Margin/padding mismatches | Structure-only differences | EN scrollWidth | AR scrollWidth | Overflow | Worst delta | Pass |',
    '| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |',
  ];
  for (const result of results) {
    const worst = result.failures.reduce(
      (max, failure) => Math.max(max, Math.abs(failure.delta || 0)),
      0
    );
    const overflow = result.metrics.en.overflow || result.metrics.ar.overflow;
    lines.push(
      `| ${result.viewport.width}x${result.viewport.height} | ${result.compared} | ${result.failures.length} | ${result.structure.length} | ${result.metrics.en.scrollWidth} | ${result.metrics.ar.scrollWidth} | ${overflow ? 'YES' : 'no'} | ${worst} | ${result.failures.length || overflow ? 'NO' : 'yes'} |`
    );
  }

  const allFailures = results.flatMap((result) =>
    result.failures.map((failure) => ({ ...failure, viewport: result.viewport }))
  );
  if (allFailures.length) {
    lines.push('', '## Mismatches', '');
    lines.push('| Viewport | Element | Margin/Padding | EN side | AR side | EN | AR | Delta |');
    lines.push('| --- | --- | --- | --- | --- | ---: | ---: | ---: |');
    for (const failure of allFailures.slice(0, 400)) {
      const name = `.${String(failure.className || '').split(/\s+/).filter(Boolean).join('.') || failure.tag}`;
      lines.push(
        `| ${failure.viewport.width}x${failure.viewport.height} | \`${name}\` | ${failure.property || 'structure'} | ${failure.enSide || '-'} | ${failure.arSide || '-'} | ${failure.enValue} | ${failure.arValue} | ${failure.delta ?? '-'} |`
      );
    }
    if (allFailures.length > 400) {
      lines.push('', `_Showing first 400 of ${allFailures.length} mismatches._`);
    }
  }

  const allStructure = results.flatMap((result) =>
    result.structure.map((difference) => ({ ...difference, viewport: result.viewport }))
  );
  if (allStructure.length) {
    lines.push('', '## Structure-only differences', '');
    lines.push('| Viewport | Element | EN | AR |');
    lines.push('| --- | --- | --- | --- |');
    for (const difference of allStructure.slice(0, 100)) {
      const name = `.${String(difference.className || '').split(/\s+/).filter(Boolean).join('.') || difference.tag}`;
      lines.push(
        `| ${difference.viewport.width}x${difference.viewport.height} | \`${name}\` | ${difference.enValue} | ${difference.arValue} |`
      );
    }
    if (allStructure.length > 100) {
      lines.push('', `_Showing first 100 of ${allStructure.length} structure-only differences._`);
    }
  }

  return `${lines.join('\n')}\n`;
}

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'spacing-parity-'));
  const chrome = spawn(
    CHROME,
    [
      '--headless=new',
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${profile}`,
      '--disable-gpu',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  try {
    let version;
    for (let attempt = 0; attempt < 50; attempt += 1) {
      try {
        version = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((response) =>
          response.json()
        );
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    if (!version) throw new Error('Chrome DevTools endpoint did not start');

    const page = await newPage();
    const { ws, send } = await connectCdp(page.webSocketDebuggerUrl);
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });

    const results = [];
    for (const viewport of VIEWPORTS) {
      const perLocale = {};
      for (const locale of ['en', 'ar']) {
        await send('Emulation.setDeviceMetricsOverride', {
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: 1,
          mobile: false,
        });
        await send('Page.navigate', { url: `${BASE_URL}/${locale}` });
        for (let attempt = 0; attempt < 80; attempt += 1) {
          const ready = await send('Runtime.evaluate', {
            expression: 'document.readyState',
            returnByValue: true,
          });
          if (ready.result.value === 'complete') break;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
        const evaluated = await send('Runtime.evaluate', {
          expression: `(${measureInPage.toString()})()`,
          awaitPromise: true,
          returnByValue: true,
        });
        if (evaluated.exceptionDetails) {
          throw new Error(evaluated.exceptionDetails.text);
        }
        perLocale[locale] = evaluated.result.value;
      }

      const comparison = compareViewport(perLocale.en.elements, perLocale.ar.elements);
      results.push({
        viewport,
        compared: comparison.compared,
        failures: comparison.failures,
        structure: comparison.structure,
        metrics: {
          en: perLocale.en.metrics,
          ar: perLocale.ar.metrics,
        },
      });
    }

    ws.close();
    const output = process.argv[2] || 'SPACING-PARITY-AFTER.md';
    writeFileSync(output, markdownReport(results));
    writeFileSync(output.replace(/\.md$/, '.json'), JSON.stringify(results, null, 2));
    const summary = results.map((result) => ({
      viewport: `${result.viewport.width}x${result.viewport.height}`,
      compared: result.compared,
      failures: result.failures.length,
      structure: result.structure.length,
      overflow: result.metrics.en.overflow || result.metrics.ar.overflow,
      worst: result.failures.reduce(
        (max, failure) => Math.max(max, Math.abs(failure.delta || 0)),
        0
      ),
    }));
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    if (
      results.some(
        (result) => result.failures.length || result.metrics.en.overflow || result.metrics.ar.overflow
      )
    ) {
      process.exitCode = 1;
    }
  } finally {
    chrome.kill();
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {
      // Chrome can keep the profile locked briefly on Windows; the temp dir is disposable.
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
