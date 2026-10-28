import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE_URL = process.env.HERO_BASE_URL || 'http://127.0.0.1:3000';
const CHROME =
  process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9225;
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1120, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 360, height: 800 },
];
const ANCHOR_TARGET_TOP = 96;
const TOLERANCE = 2;

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

const snapshot = `(() => {
  const header = document.querySelector('.site-header');
  const inner = document.querySelector('.header-inner');
  const brand = document.querySelector('.header-brand');
  const actions = document.querySelector('.header-actions');
  const nav = document.querySelector('.main-nav');
  const toggle = document.querySelector('.menu-toggle');
  const active = document.querySelector('.nav-link.is-active');
  const style = getComputedStyle(header);
  const rect = (element) => {
    const box = element.getBoundingClientRect();
    return {
      x: Math.round(box.x * 100) / 100,
      y: Math.round(box.y * 100) / 100,
      right: Math.round(box.right * 100) / 100,
      bottom: Math.round(box.bottom * 100) / 100,
      width: Math.round(box.width * 100) / 100,
      height: Math.round(box.height * 100) / 100,
    };
  };
  return {
    dir: document.documentElement.dir,
    scrollY: Math.round(scrollY * 100) / 100,
    viewportWidth: innerWidth,
    viewportHeight: innerHeight,
    header: rect(header),
    inner: rect(inner),
    brand: rect(brand),
    actions: rect(actions),
    nav: rect(nav),
    position: style.position,
    insetTop: style.top,
    boxShadow: style.boxShadow,
    scrolled: header.classList.contains('is-scrolled'),
    navVisible: getComputedStyle(nav).display !== 'none',
    toggleVisible: getComputedStyle(toggle).display !== 'none',
    toggleExpanded: toggle.getAttribute('aria-expanded'),
    activeHref: active ? active.getAttribute('href') : null,
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
    scrollWidth: document.documentElement.scrollWidth,
  };
})()`;

const menuSnapshot = `(() => {
  const menu = document.querySelector('.mobile-menu');
  if (!menu) return null;
  const rect = (element) => {
    const box = element.getBoundingClientRect();
    return {
      x: Math.round(box.x * 100) / 100,
      y: Math.round(box.y * 100) / 100,
      right: Math.round(box.right * 100) / 100,
      bottom: Math.round(box.bottom * 100) / 100,
      width: Math.round(box.width * 100) / 100,
      height: Math.round(box.height * 100) / 100,
    };
  };
  const header = document.querySelector('.site-header').getBoundingClientRect();
  return {
    headerBottom: Math.round(header.bottom * 100) / 100,
    rect: rect(menu),
    overflowY: getComputedStyle(menu).overflowY,
    links: Array.from(menu.querySelectorAll('a')).map((link) => ({
      href: link.getAttribute('href'),
      ...rect(link),
    })),
  };
})()`;

const anchorSnapshot = `(() => {
  const target = document.getElementById('pricing');
  const header = document.querySelector('.site-header').getBoundingClientRect();
  const active = document.querySelector('.nav-link.is-active');
  return {
    scrollY: Math.round(scrollY * 100) / 100,
    targetTop: Math.round(target.getBoundingClientRect().top * 100) / 100,
    headerTop: Math.round(header.top * 100) / 100,
    activeHref: active ? active.getAttribute('href') : null,
    menuOpen: Boolean(document.querySelector('.mobile-menu')),
    overflow: document.documentElement.scrollWidth > innerWidth + 1,
  };
})()`;

async function waitForReady(send) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const ready = await send('Runtime.evaluate', {
      expression: 'document.readyState',
      returnByValue: true,
    });
    if (ready.result.value === 'complete') return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Page did not finish loading');
}

async function createEvaluator(send) {
  return async (expression) => {
    const result = await send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
}

async function measureLocale(send, evaluate, viewport, locale) {
  await send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.navigate', { url: `${BASE_URL}/${locale}` });
  await waitForReady(send);
  await evaluate('document.fonts.ready');
  await evaluate("document.documentElement.style.scrollBehavior = 'auto'");
  await new Promise((resolve) => setTimeout(resolve, 300));

  const top = await evaluate(snapshot);
  await evaluate('window.scrollTo(0, 700)');
  await new Promise((resolve) => setTimeout(resolve, 150));
  const scrolled = await evaluate(snapshot);

  await evaluate('window.scrollTo(0, 0)');
  await new Promise((resolve) => setTimeout(resolve, 150));

  let menuOpened = null;
  let menuClosed = true;
  if (top.toggleVisible) {
    await evaluate("document.querySelector('.menu-toggle').click()");
    await new Promise((resolve) => setTimeout(resolve, 300));
    menuOpened = await evaluate(menuSnapshot);
    await evaluate(
      "window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))"
    );
    await new Promise((resolve) => setTimeout(resolve, 250));
    menuClosed = await evaluate("!document.querySelector('.mobile-menu')");
    await evaluate("document.querySelector('.menu-toggle').click()");
    await new Promise((resolve) => setTimeout(resolve, 300));
    await evaluate(
      "document.querySelector('.mobile-menu a[href=\"#pricing\"]').click()"
    );
  } else {
    await evaluate("document.querySelector('.main-nav a[href=\"#pricing\"]').click()");
  }
  await new Promise((resolve) => setTimeout(resolve, 250));
  const anchor = await evaluate(anchorSnapshot);

  return { top, scrolled, menuOpened, menuClosed, anchor };
}

function close(a, b) {
  return Math.abs(a - b) <= TOLERANCE;
}

function same(a, b) {
  return a === b;
}

function compareViewport(viewport, en, ar) {
  const failures = [];
  const add = (message) => failures.push(message);

  for (const [locale, report] of [
    ['en', en],
    ['ar', ar],
  ]) {
    if (report.top.position !== 'sticky') add(`${locale}: header is not sticky`);
    if (report.top.insetTop !== '0px') add(`${locale}: header top is not 0px`);
    if (report.top.scrolled) add(`${locale}: header is scrolled at the top`);
    if (report.top.boxShadow !== 'none') add(`${locale}: header has a shadow at the top`);
    if (report.top.overflow) add(`${locale}: horizontal overflow at the top`);
    if (!close(report.scrolled.header.y, 0)) {
      add(`${locale}: header does not stay at the top while scrolling (${report.scrolled.header.y})`);
    }
    if (!report.scrolled.scrolled) add(`${locale}: scrolled state was not applied`);
    if (report.scrolled.boxShadow === 'none') {
      add(`${locale}: header has no shadow after scrolling`);
    }
    if (report.scrolled.overflow) add(`${locale}: horizontal overflow after scrolling`);
    if (!close(report.anchor.targetTop, ANCHOR_TARGET_TOP)) {
      add(
        `${locale}: anchor offset is ${report.anchor.targetTop}, expected ${ANCHOR_TARGET_TOP}`
      );
    }
    if (!close(report.anchor.headerTop, 0)) {
      add(`${locale}: header moved after anchor navigation (${report.anchor.headerTop})`);
    }
    if (report.anchor.activeHref !== '#pricing') {
      add(`${locale}: active nav link after pricing anchor is ${report.anchor.activeHref}`);
    }
    if (report.anchor.menuOpen) add(`${locale}: mobile menu stayed open after navigation`);
    if (report.anchor.overflow) add(`${locale}: horizontal overflow after anchor navigation`);
    if (report.top.toggleVisible && report.top.toggleExpanded !== 'false') {
      add(`${locale}: menu toggle starts expanded`);
    }
    if (report.top.toggleVisible) {
      if (!report.menuClosed) add(`${locale}: Escape did not close the menu`);
      if (!report.menuOpened) {
        add(`${locale}: mobile menu did not open`);
      } else {
        if (!close(report.menuOpened.rect.y, report.menuOpened.headerBottom)) {
          add(`${locale}: mobile menu is not attached below the header`);
        }
        if (!close(report.menuOpened.rect.width, viewport.width)) {
          add(`${locale}: mobile menu does not span the viewport`);
        }
        if (report.menuOpened.links.length !== 6) {
          add(`${locale}: mobile menu has ${report.menuOpened.links.length} links`);
        }
      }
    }
  }

  if (en.top.position !== ar.top.position) add('header position differs by locale');
  if (!close(en.top.header.height, ar.top.header.height)) {
    add('header height differs by locale');
  }
  if (!close(en.top.brand.x, viewport.width - ar.top.brand.right)) {
    add('brand is not mirrored by locale');
  }
  if (!close(en.top.actions.right, viewport.width - ar.top.actions.x)) {
    add('header actions are not mirrored by locale');
  }
  if (en.top.navVisible !== ar.top.navVisible) add('desktop nav visibility differs by locale');
  if (en.top.toggleVisible !== ar.top.toggleVisible) {
    add('menu toggle visibility differs by locale');
  }
  if (!same(en.top.activeHref, ar.top.activeHref)) add('initial active link differs by locale');
  if (!same(en.scrolled.activeHref, ar.scrolled.activeHref)) {
    add('active link after scrolling differs by locale');
  }
  if (en.scrolled.scrolled !== ar.scrolled.scrolled) {
    add('scrolled state differs by locale');
  }
  if (en.scrolled.boxShadow !== ar.scrolled.boxShadow) {
    add('scrolled header shadow differs by locale');
  }
  if (!same(en.anchor.activeHref, ar.anchor.activeHref)) {
    add('active link after anchor navigation differs by locale');
  }
  if (!close(en.anchor.targetTop, ar.anchor.targetTop)) {
    add('anchor offset differs by locale');
  }
  if (Boolean(en.menuOpened) !== Boolean(ar.menuOpened)) {
    add('mobile menu availability differs by locale');
  } else if (en.menuOpened && ar.menuOpened) {
    if (!close(en.menuOpened.rect.y, ar.menuOpened.rect.y)) {
      add('mobile menu top differs by locale');
    }
    if (!close(en.menuOpened.rect.width, ar.menuOpened.rect.width)) {
      add('mobile menu width differs by locale');
    }
    if (en.menuOpened.links.length !== ar.menuOpened.links.length) {
      add('mobile menu link count differs by locale');
    }
    if (en.menuClosed !== ar.menuClosed) add('mobile menu Escape behavior differs by locale');
  }

  return failures;
}

function markdownReport(results) {
  const lines = [
    '# Navbar scroll parity',
    '',
    'Generated by `scripts/navbar-parity.mjs` against the production build.',
    'Checks sticky positioning, scrolled state, anchor offsets, active links and mobile menu behavior in EN and AR.',
    '',
    '| Viewport | Sticky | Scroll shadow | Anchor top EN/AR | Active link EN/AR | Mobile menu | Pass |',
    '| --- | --- | --- | ---: | --- | --- | --- |',
  ];

  for (const result of results) {
    const menu =
      result.en.menuOpened && result.ar.menuOpened
        ? `${result.en.menuOpened.links.length}/${result.ar.menuOpened.links.length} links`
        : 'n/a';
    const shadow =
      result.en.scrolled.boxShadow !== 'none' && result.ar.scrolled.boxShadow !== 'none'
        ? 'yes'
        : 'NO';
    lines.push(
      `| ${result.viewport.width}x${result.viewport.height} | ${result.en.scrolled.header.y === 0 && result.ar.scrolled.header.y === 0 ? 'yes' : 'NO'} | ${shadow} | ${result.en.anchor.targetTop}/${result.ar.anchor.targetTop} | ${result.en.anchor.activeHref}/${result.ar.anchor.activeHref} | ${menu} | ${result.failures.length ? 'NO' : 'yes'} |`
    );
  }

  const failures = results.flatMap((result) =>
    result.failures.map((failure) => ({ viewport: result.viewport, failure }))
  );
  if (failures.length) {
    lines.push('', '## Failures', '');
    for (const { viewport, failure } of failures) {
      lines.push(`- ${viewport.width}x${viewport.height}: ${failure}`);
    }
  }

  return `${lines.join('\n')}\n`;
}

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'navbar-parity-'));
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
    const evaluate = await createEvaluator(send);

    const results = [];
    for (const viewport of VIEWPORTS) {
      const en = await measureLocale(send, evaluate, viewport, 'en');
      const ar = await measureLocale(send, evaluate, viewport, 'ar');
      results.push({
        viewport,
        en,
        ar,
        failures: compareViewport(viewport, en, ar),
      });
    }

    ws.close();
    const output = process.argv[2] || 'NAVBAR-PARITY-AFTER.md';
    writeFileSync(output, markdownReport(results));
    writeFileSync(output.replace(/\.md$/, '.json'), JSON.stringify(results, null, 2));
    const summary = results.map((result) => ({
      viewport: `${result.viewport.width}x${result.viewport.height}`,
      sticky: result.en.scrolled.header.y === 0 && result.ar.scrolled.header.y === 0,
      shadow:
        result.en.scrolled.boxShadow !== 'none' && result.ar.scrolled.boxShadow !== 'none',
      anchorTop: `${result.en.anchor.targetTop}/${result.ar.anchor.targetTop}`,
      active: `${result.en.anchor.activeHref}/${result.ar.anchor.activeHref}`,
      failures: result.failures.length,
    }));
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
    if (results.some((result) => result.failures.length)) process.exitCode = 1;
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
