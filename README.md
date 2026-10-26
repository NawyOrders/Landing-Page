# Nawy Order — Landing Page

A responsive, bilingual landing page for Nawy Order, built with **Next.js 14 (App Router), TypeScript, and Tailwind CSS 3**. Supports Arabic (RTL) and English (LTR), with localized content, responsive pricing cards, interactive UI components, and CSS-based animations.

## Tech Stack

- **Framework:** Next.js 14 — App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 3
- **Internationalization:** Arabic and English
- **Fonts:** Cairo and Alexandria
- **Animations:** Custom CSS and lightweight browser APIs
- **Lead Generation:** Google Forms with a QR code
- **Rendering:** Server Components by default, with Client Components for interactive features

## Getting Started

### Prerequisites

- Node.js and npm
- Git

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
npm run build
npm start
```

### QR Code Commands

```bash
npm run qr
npm run qr:verify
```

The first command generates the lead form QR code. The second verifies that the generated code can be decoded successfully.

## Internationalization

The application supports two locales:

- `/ar` — Arabic (default), right-to-left (RTL)
- `/en` — English, left-to-right (LTR)

The root layout is `app/[locale]/layout.tsx`, which sets the appropriate HTML language and text direction.

`middleware.ts` redirects unprefixed routes according to the following priority:

1. The saved `locale` cookie
2. The browser's `Accept-Language` header
3. The configured default locale

API routes and static assets are excluded from locale redirects.

### Translation Structure

All localized content is maintained in `lib/i18n/`.

- `dictionary.ts` defines the shared translation contract.
- `ar.ts` contains Arabic content.
- `en.ts` contains English content and implements the `Dictionary` type.
- `config.ts` defines locale settings, direction, labels, tags, and number formatting.
- `index.ts` registers the available dictionaries.

Components receive translations through a `dict` prop instead of a client-side translation context. The `Pricing` component also receives `locale` for locale-aware number formatting.

When adding a new language, update the locale configuration, create its dictionary, and register it in `lib/i18n/index.ts`.

## Design System

### Typography

- **Cairo:** Global body font, bundled locally in `app/fonts`.
- **Alexandria:** Section headings, loaded through `next/font/google` and self-hosted for production use.

Use the `font-alexandria` utility where appropriate. Global heading styles are defined in `app/globals.css`.

### Heading Styles

Two shared heading classes define the main typography scale:

- `.h-display` — Hero headings
- `.h-section` — Section headings

Explicit font sizes and `leading-[1.35]` are used to preserve comfortable Arabic line spacing. Heading letter spacing is controlled by `--heading-tracking`, set to `0` to avoid disrupting Arabic letter connections.

### Spacing

The preferred spacing scale includes:

- Column gaps: `gap-10`
- Heading-to-description spacing: `mt-4`
- Section heading block spacing: `mt-12`
- Paragraph-to-action spacing: `mt-8`
- Section vertical padding: `py-16 sm:py-24`

Follow these shared values when extending the design.

## Responsive Pricing Section

The pricing section uses a horizontal snap-scrolling layout on smaller screens and a three-column grid on medium screens and above.

- Mobile cards use `w-[85%]` with mandatory horizontal snapping.
- The mobile scroller uses `-mx-5 sm:-mx-8` for edge-to-edge presentation.
- Scrollbars are hidden through the `.no-scrollbar` utility.
- The scroller uses `pt-4` to prevent the featured card's elevated badge from being clipped.
- Keyboard scrolling is supported through `tabIndex={0}` and `role="list"`.
- `dict.pricing.scrollHint` provides the mobile swipe hint.

When adding responsive card styles, reset width, maximum width, and flex shrinking where necessary at the `md` breakpoint.

RTL layouts use logical scrolling and flex directions without requiring separate direction-specific carousel logic.

## Lead Capture
