# Arabic hero parity report

Branch: `fix/hero-arabic-parity` (based on `AB-239-animation-landing-page`)
Source of truth: English `/en` hero
Status: parity passes at all six required viewports; no overflow, console errors, or failed requests.

## Result

| Viewport | Failing elements before | Failing gaps before | AR scrollWidth before | Failing elements after | Failing gaps after | AR scrollWidth after |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 1920x1080 | 10 | 1 | 1920 | 0 | 0 | 1920 |
| 1440x900 | 10 | 1 | 1456 | 0 | 0 | 1440 |
| 1366x768 | 10 | 1 | 1366 | 0 | 0 | 1366 |
| 1024x768 | 10 | 1 | 1024 | 0 | 0 | 1024 |
| 768x1024 | 14 | 1 | 768 | 0 | 0 | 768 |
| 390x844 | 14 | 1 | 390 | 0 | 0 | 390 |

The only failing gap before the fix was paragraph-to-button (`-29px` at 1920/1440/1366/1024/768 and `-27.13px` at 390), caused by the Arabic paragraph wrapping one line shorter than English.

After the fix every measured row has `xDelta = 0` at the mirrored inline-start edge, `yDelta = 0`, `wDelta = 0` (except intrinsic text width), and `hDelta = 0`. Every gap delta is `0`.

## What was fixed

- Converted hero margins, paddings, offsets, borders, masks, button shine, and responsive rules from physical to logical properties.
- Added direction tokens `--dir-sign` (`1` in LTR, `-1` in RTL) and `--hero-fade-angle` (`90deg` / `270deg`).
- Mirrored the CTA arrow, red splash blob, both sparks, and fries; mirrored the fries float animation and the badge flip reveal.
- Restored the visual rhythm with `margin-block-start` on the CTA, replacing the lost paragraph line.
- Arabic title now uses Cairo 800 with zero letter-spacing; the accent line uses Aref Ruqaa 700 at the same font size, line-height, two-line break, and accent gap as the English Yellowtail line.
- Arabic paragraph reserves the English block height (`3 * 29px` desktop, `3 * 1.75em` up to 767px, `4 * 1.75em` up to 400px), so every following element stays aligned.
- Kept the mockup image unmirrored (no transform on `.hero-visual` or its image); only its fade mask direction changes.
- Improved the fries JPEG rectangle mask in Arabic only; English fries styling is unchanged.
- Replaced the Arabic em dash with the Arabic comma in `lib/i18n/ar.ts` and wrapped punctuation with the following word in `.hero-nowrap`.
- Added `overflow-x: clip` on `html` so no viewport can scroll horizontally.
- Added Aref Ruqaa through built-in `next/font/google`; no dependency was added.

## Verification

Run:

```powershell
npm ci
npm run build
npm run start
npm test
```

`npm test` runs six checks:

1. Hero CSS has no physical direction properties or unmirrored `translateX`.
2. Hero markup has no direction utilities or `as any` casts, and keeps `hero-nowrap`, the single `h1`, the CTA anchor, and the arrow class.
3. EN/AR hero dictionaries have identical keys, English copy is unchanged, Arabic copy uses `،` and no `—`.
4. Live EN/AR HTML keeps `lang`/`dir`, one `h1`, hero landmark order, paragraph copy, CTA text, image alt text, and decorative image semantics.
5. The CDP harness measures all six viewports and asserts zero element/gap failures, zero horizontal overflow, zero console errors, zero failed requests, loaded Cairo/Aref Ruqaa, two-line accent, and equal paragraph block height.
6. Twelve visual baselines exist in `tests/e2e/__baselines__/`.

Additional checks run:

- `npx tsc --noEmit` — pass
- `npm run build` — pass
- `npm test` — 6/6 pass
- `node scripts/hero-parity.mjs after HERO-PARITY-AFTER.md` — pass

Artifacts:

- `HERO-PARITY-BEFORE.md` — baseline
- `HERO-PARITY-AFTER.md` / `.json` — final measurements
- `tests/e2e/hero-parity.spec.ts` — parity suite
- `tests/fixtures/hero-en.json`, `tests/fixtures/hero-ar.json` — copy fixtures
- `tests/e2e/__baselines__/hero-{en,ar}-{viewport}.png` — 12 visual baselines
- `scripts/hero-parity.mjs` — Chrome DevTools Protocol measurement harness

## Tooling deviations

The requested Playwright, Vitest, React Testing Library, and axe tooling is not installed and adding dependencies was not allowed. To avoid new packages:

- Playwright position assertions are replaced by `scripts/hero-parity.mjs`, which drives headless Chrome over the DevTools Protocol. It measures the same six viewports, disables animations, waits for fonts, and anchors relative elements (arrow/swooshes) to their parent button.
- Vitest component assertions are replaced by the live-server SSR checks in `tests/e2e/hero-parity.spec.ts` using the Node built-in test runner.
- axe checks are replaced by targeted semantics assertions (single `h1`, alt text, decorative images, CTA name). They are not a full axe audit.
- Visual baselines are committed PNGs for manual review rather than automated pixel-diff snapshots.

## OWNER DECISIONS

1. **Hero dashboard mockup contains English UI text in the Arabic hero.** The image was not mirrored or edited because mirroring would reverse the dashboard text. A dedicated Arabic-UI mockup asset is needed; CSS cannot translate text baked into the JPEG.
2. **Fries image has a JPEG background rectangle.** The Arabic-only CSS mask reduces it, but the English image was left unchanged per the no-English-change rule. A transparent PNG/WebP cut-out is the durable fix; the image was not edited.
3. **Approve Aref Ruqaa as the Arabic accent font.** It matches the Yellowtail size, line-height, two-line break, and accent gap but is a different typeface.
4. **Approve the Arabic copy punctuation change** from `—` to `،` in the hero paragraph.
5. **Paragraph line count vs reserved height.** Arabic still renders 2 lines on desktop (3 at 390) while English renders 3 (4 at 390). The block reserves the full English height, so all following positions match exactly. Forcing the same visible line count requires narrowing the Arabic paragraph to about 360px on desktop, which would break the mirrored block width. Current choice: keep the mirrored width and reserve height.
6. **Intrinsic text widths differ.** CTA EN `251.56px` vs AR `217.73px` at desktop, and `256.33px` vs `223.53px` at 390. Inline-start edges are mirrored exactly; the button was not artificially widened because that would distort the Arabic label.

## Residual deltas

These are intrinsic text metrics, not layout defects:

- Badge/title/accent/CTA absolute widths differ from English because Arabic glyphs and labels differ. Mirrored inline-start `x` delta is `0`.
- Arrow and top swoosh show an absolute `xDelta` of `33.83px` (desktop) and `32.8px` (390), exactly the CTA width difference. Their anchor-relative delta inside the button is `0`.
- Arabic accent is two lines on every viewport, matching English.
- Arabic paragraph line count differs from English, but measured paragraph block height and gap to the CTA are identical.

## Files changed

```
 app/[locale]/layout.tsx |  10 ++-
 app/[locale]/page.tsx   |   2 +-
 app/globals.css         | 194 +++++++++++++++++++++++++++++++++++-------------
 components/Hero.tsx     |  38 +++++++---
 lib/i18n/ar.ts          |   2 +-
 package.json            |   4 +
```

New files: `scripts/hero-parity.mjs`, `tests/e2e/hero-parity.spec.ts`, `tests/fixtures/*.json`, `tests/e2e/__baselines__/*.png`, `HERO-PARITY-BEFORE.md`, `HERO-PARITY-AFTER.md`, `HERO-PARITY-AFTER.json`.
