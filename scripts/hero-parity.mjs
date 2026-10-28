import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE_URL = process.env.HERO_BASE_URL || 'http://127.0.0.1:3000';
const CHROME =
  process.env.CHROME_PATH ||
  'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9223;
const VIEWPORTS = [
  { width: 1920, height: 1080 },
  { width: 1440, height: 900 },
  { width: 1366, height: 768 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];
const ELEMENTS = [
  { key: 'card', selector: '.hero-card', kind: 'shape' },
  { key: 'badge', selector: '.hero-badge', kind: 'text' },
  { key: 'title1', selector: '.hero-title > span:nth-of-type(1)', kind: 'text' },
  { key: 'title2', selector: '.hero-title > span:nth-of-type(2)', kind: 'text' },
  { key: 'accent', selector: '.hero-title em', kind: 'text' },
  { key: 'accentLast', selector: '.hero-title-em', kind: 'text' },
  { key: 'paragraph', selector: '.hero-text', kind: 'text' },
  { key: 'ctaWrap', selector: '.hero-cta-wrap', kind: 'text' },
  { key: 'button', selector: '.hero-cta', kind: 'text' },
  { key: 'arrow', selector: '.hero-cta svg', kind: 'shape', anchor: 'button', side: 'end' },
  { key: 'imagePanel', selector: '.hero-visual', kind: 'shape' },
  { key: 'mockup', selector: '.hero-visual img', kind: 'image' },
  { key: 'fries', selector: '.hero-fries', kind: 'image' },
  { key: 'splash', selector: '.hero-blob', kind: 'shape' },
  { key: 'swooshTop', selector: '.hero-spark--cta', kind: 'image', anchor: 'ctaWrap', side: 'end' },
  { key: 'swooshBottom', selector: '.hero-spark--cta-left', kind: 'image', anchor: 'ctaWrap', side: 'start' },
];
const GAPS = [
  ['badge', 'title1', 'badge to heading'],
  ['title2', 'accent', 'heading to accent'],
  ['accent', 'paragraph', 'accent to paragraph'],
  ['paragraph', 'ctaWrap', 'paragraph to button'],
];

function connectCdp(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let id = 0;
    const pending = new Map();
    const listeners = new Map();
    ws.addEventListener('open', () => resolve({ ws, send, on }));
    ws.addEventListener('error', reject);
    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id) {
        for (const listener of listeners.get(message.method) || []) {
          listener(message.params);
        }
        return;
      }
      const item = pending.get(message.id);
      if (!item) return;
      pending.delete(message.id);
      if (message.error) item.reject(new Error(message.error.message));
      else item.resolve(message.result);
    });

    function on(method, listener) {
      const current = listeners.get(method) || [];
      listeners.set(method, [...current, listener]);
      return () => listeners.set(method, (listeners.get(method) || []).filter((item) => item !== listener));
    }

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

const measureInPage = async (definitions) => {
  await document.fonts.ready;
  const style = document.createElement('style');
  style.textContent =
    '*,*::before,*::after{animation:none!important;transition:none!important}.reveal-ready [data-reveal]{opacity:1!important;transform:none!important;filter:none!important}';
  document.head.appendChild(style);
  document.querySelectorAll('[data-reveal]').forEach((el) => el.setAttribute('data-revealed', ''));
  document.documentElement.classList.remove('reveal-ready');
  window.scrollTo(0, 0);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  const lineCount = (element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const tops = [];
    let node;
    while ((node = walker.nextNode())) {
      if (!node.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const rect of range.getClientRects()) {
        if (rect.width < 0.5 || rect.height < 0.5) continue;
        const top = Math.round(rect.top * 2) / 2;
        if (!tops.some((value) => Math.abs(value - top) <= 2)) tops.push(top);
      }
    }
    return tops.length;
  };

  const elements = {};
  for (const { key, selector } of definitions) {
    const element = document.querySelector(selector);
    if (!element) {
      elements[key] = null;
      continue;
    }
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    elements[key] = {
      x: Math.round(rect.x * 100) / 100,
      y: Math.round(rect.y * 100) / 100,
      width: Math.round(rect.width * 100) / 100,
      height: Math.round(rect.height * 100) / 100,
      right: Math.round(rect.right * 100) / 100,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily,
      lineHeight: style.lineHeight,
      letterSpacing: style.letterSpacing,
      display: style.display,
      lines: lineCount(element),
      text: (element.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80),
    };
  }

  const accentFamily = getComputedStyle(document.querySelector('.hero-title em')).fontFamily;
  const accentPrimary = accentFamily.split(',')[0].trim();

  return {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    direction: getComputedStyle(document.documentElement).direction,
    offenders: Array.from(document.querySelectorAll('body *'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === 'string' ? element.className : '',
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter(
        (item) =>
          item.width > 0 &&
          (item.left < -1 || item.right > window.innerWidth + 1)
      )
      .slice(0, 30),
    fonts: {
      cairo: document.fonts.check('800 16px Cairo'),
      accentFamily,
      arefRuqaa: document.fonts.check(`700 16px ${accentPrimary}`),
      yellowtail: document.fonts.check('400 16px "Yellowtail"'),
      loaded: Array.from(document.fonts)
        .filter((face) => face.status === 'loaded')
        .map((face) => face.family)
        .filter((family, index, all) => all.indexOf(family) === index),
    },
    elements,
  };
};

function mirrorDeltas(en, ar) {
  const rows = [];
  for (const { key, kind } of ELEMENTS) {
    const e = en.elements[key];
    const a = ar.elements[key];
    if (!e || !a) {
      rows.push({ element: key, expected: 'present', actual: 'missing' });
      continue;
    }
    if (e.display === 'none' && a.display === 'none') {
      rows.push({
        element: key,
        kind,
        expectedX: 0,
        actualX: 0,
        xDelta: 0,
        yDelta: 0,
        wDelta: 0,
        hDelta: 0,
        anchorDelta: null,
        enFont: e.fontSize,
        arFont: a.fontSize,
        enLineHeight: e.lineHeight,
        arLineHeight: a.lineHeight,
        fontMismatch: false,
        lines: `${e.lines}/${a.lines}`,
        pass: true,
        hidden: true,
      });
      continue;
    }
    const expectedX = Math.round((en.viewportWidth - (e.x + (kind === 'text' ? a.width : e.width))) * 100) / 100;
    const xDelta = Math.round((a.x - expectedX) * 100) / 100;
    const yDelta = Math.round((a.y - e.y) * 100) / 100;
    const wDelta = Math.round((a.width - e.width) * 100) / 100;
    const hDelta = Math.round((a.height - e.height) * 100) / 100;
    const fontMismatch =
      kind === 'text' ? a.fontSize !== e.fontSize || a.lineHeight !== e.lineHeight : false;
    const definition = ELEMENTS.find((item) => item.key === key);
    let anchorDelta = null;
    if (definition?.anchor) {
      const enAnchor = en.elements[definition.anchor];
      const arAnchor = ar.elements[definition.anchor];
      if (enAnchor && arAnchor) {
        const enOffset =
          definition.side === 'start'
            ? e.x - enAnchor.x
            : enAnchor.x + enAnchor.width - (e.x + e.width);
        const arOffset =
          definition.side === 'start'
            ? arAnchor.x + arAnchor.width - (a.x + a.width)
            : a.x - arAnchor.x;
        anchorDelta = Math.round((arOffset - enOffset) * 100) / 100;
      }
    }
    rows.push({
      element: key,
      kind,
      expectedX,
      actualX: a.x,
      xDelta,
      yDelta,
      wDelta,
      hDelta,
      anchorDelta,
      enFont: e.fontSize,
      arFont: a.fontSize,
      enLineHeight: e.lineHeight,
      arLineHeight: a.lineHeight,
      fontMismatch,
      lines: `${e.lines}/${a.lines}`,
      pass:
        (anchorDelta === null ? Math.abs(xDelta) <= 2 : Math.abs(anchorDelta) <= 2) &&
        Math.abs(yDelta) <= 2 &&
        (kind !== 'shape' && kind !== 'image'
          ? true
          : Math.abs(wDelta) <= 2 && Math.abs(hDelta) <= 2) &&
        !fontMismatch,
    });
  }
  return rows;
}

function gapDeltas(en, ar) {
  const rows = [];
  for (const [from, to, label] of GAPS) {
    const e1 = en.elements[from];
    const e2 = en.elements[to];
    const a1 = ar.elements[from];
    const a2 = ar.elements[to];
    if (!e1 || !e2 || !a1 || !a2) continue;
    const expected = Math.round((e2.y - (e1.y + e1.height)) * 100) / 100;
    const actual = Math.round((a2.y - (a1.y + a1.height)) * 100) / 100;
    rows.push({
      gap: label,
      expected,
      actual,
      delta: Math.round((actual - expected) * 100) / 100,
      pass: Math.abs(actual - expected) <= 2,
    });
  }
  return rows;
}

function markdownReport(results, mode) {
  const lines = [
    `# Hero parity ${mode}`,
    '',
    'Generated by `scripts/hero-parity.mjs` against the production build.',
    'Mirror expectation for x: `viewportWidth - (English x + English width)`.',
    '',
  ];
  for (const result of results) {
    const { viewport, en, ar, rows, gaps } = result;
    lines.push(`## ${viewport.width}x${viewport.height}`, '');
    lines.push(`- English scrollWidth: ${en.scrollWidth}; Arabic scrollWidth: ${ar.scrollWidth}`);
    lines.push(`- Direction: ${en.direction}/${ar.direction}`);
    if (en.scrollWidth > viewport.width || ar.scrollWidth > viewport.width) {
      lines.push(
        `- Overflow offenders EN: ${JSON.stringify(en.offenders)}; AR: ${JSON.stringify(ar.offenders)}`
      );
    }
    lines.push(
      `- Fonts loaded (Cairo/accent/Yellowtail): ${ar.fonts.cairo}/${ar.fonts.arefRuqaa}/${ar.fonts.yellowtail}`
    );
    lines.push(`- Accent family: ${ar.fonts.accentFamily}`);
    lines.push(`- Loaded font families: ${ar.fonts.loaded.join(', ')}`);
    lines.push(
      `- Console errors EN/AR: ${en.consoleErrors.length}/${ar.consoleErrors.length}; failed requests EN/AR: ${en.failedRequests.length}/${ar.failedRequests.length}`
    );
    lines.push('');
    lines.push('| Element | x delta | anchor delta | y delta | w delta | h delta | Font EN/AR | Line-height EN/AR | Lines EN/AR | Pass |');
    lines.push('| --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |');
    for (const row of rows) {
      lines.push(
        `| ${row.element} | ${row.xDelta} | ${row.anchorDelta ?? '-'} | ${row.yDelta} | ${row.wDelta} | ${row.hDelta} | ${row.enFont}/${row.arFont} | ${row.enLineHeight}/${row.arLineHeight} | ${row.lines} | ${row.pass ? 'yes' : 'NO'} |`
      );
    }
    lines.push('');
    lines.push('| Gap | Expected | Actual | Delta | Pass |');
    lines.push('| --- | ---: | ---: | ---: | --- |');
    for (const gap of gaps) {
      lines.push(
        `| ${gap.gap} | ${gap.expected} | ${gap.actual} | ${gap.delta} | ${gap.pass ? 'yes' : 'NO'} |`
      );
    }
    lines.push('');
  }
  return lines.join('\n');
}

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'hero-parity-'));
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
        version = await fetch(`http://127.0.0.1:${PORT}/json/version`).then((res) => res.json());
        break;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    if (!version) throw new Error('Chrome DevTools endpoint did not start');

    const page = await newPage();
    const { ws, send, on } = await connectCdp(page.webSocketDebuggerUrl);
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Log.enable');
    await send('Network.enable');
    await send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });

    let consoleErrors = [];
    let failedRequests = [];
    on('Runtime.exceptionThrown', (event) => {
      consoleErrors.push(event.exceptionDetails?.exception?.description || 'Runtime exception');
    });
    on('Log.entryAdded', (event) => {
      if (event.entry.level === 'error') consoleErrors.push(event.entry.text);
    });
    on('Network.loadingFailed', (event) => {
      if (!event.canceled) failedRequests.push(`${event.type}: ${event.errorText}`);
    });

    const results = [];
    for (const viewport of VIEWPORTS) {
      const perLocale = {};
      for (const locale of ['en', 'ar']) {
        consoleErrors = [];
        failedRequests = [];
        await send('Emulation.setDeviceMetricsOverride', {
          width: viewport.width,
          height: viewport.height,
          deviceScaleFactor: 1,
          mobile: false,
        });
        await send('Page.navigate', { url: `${BASE_URL}/${locale}` });
        for (let attempt = 0; attempt < 60; attempt += 1) {
          const ready = await send('Runtime.evaluate', {
            expression: 'document.readyState',
            returnByValue: true,
          });
          if (ready.result.value === 'complete') break;
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        const evaluated = await send('Runtime.evaluate', {
          expression: `(${measureInPage.toString()})(${JSON.stringify(ELEMENTS)})`,
          awaitPromise: true,
          returnByValue: true,
        });
        if (evaluated.exceptionDetails) {
          throw new Error(evaluated.exceptionDetails.text);
        }
        await new Promise((resolve) => setTimeout(resolve, 250));
        perLocale[locale] = {
          ...evaluated.result.value,
          consoleErrors: [...consoleErrors],
          failedRequests: [...failedRequests],
        };

        if (process.env.HERO_BASELINES === '1') {
          const card = evaluated.result.value.elements.card;
          const shot = await send('Page.captureScreenshot', {
            format: 'png',
            captureBeyondViewport: true,
            fromSurface: true,
            clip: {
              x: Math.max(0, card.x),
              y: Math.max(0, card.y),
              width: card.width,
              height: card.height,
              scale: 1,
            },
          });
          const dir = join('tests', 'e2e', '__baselines__');
          mkdirSync(dir, { recursive: true });
          writeFileSync(
            join(dir, `hero-${locale}-${viewport.width}x${viewport.height}.png`),
            Buffer.from(shot.data, 'base64')
          );
        }
      }
      results.push({
        viewport,
        en: perLocale.en,
        ar: perLocale.ar,
        rows: mirrorDeltas(perLocale.en, perLocale.ar),
        gaps: gapDeltas(perLocale.en, perLocale.ar),
      });
    }

    ws.close();
    const mode = process.argv[2] === 'after' ? 'after' : 'before';
    const output = process.argv[3] || `HERO-PARITY-${mode.toUpperCase()}.md`;
    writeFileSync(output, markdownReport(results, mode.toUpperCase()));
    writeFileSync(output.replace(/\.md$/, '.json'), JSON.stringify(results, null, 2));
    const summary = results.map(({ viewport, en, ar, rows, gaps }) => ({
      viewport: `${viewport.width}x${viewport.height}`,
      failedElements: rows.filter((row) => !row.pass).map((row) => row.element),
      failedGaps: gaps.filter((gap) => !gap.pass).map((gap) => gap.gap),
      overflow: {
        en: en.scrollWidth > viewport.width,
        ar: ar.scrollWidth > viewport.width,
      },
      consoleErrors: { en: en.consoleErrors, ar: ar.consoleErrors },
      failedRequests: { en: en.failedRequests, ar: ar.failedRequests },
    }));
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
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
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});
