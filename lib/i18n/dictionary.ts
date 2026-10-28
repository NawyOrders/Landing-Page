export type Dictionary = {
  brandName: string;
  header: {
    nav: {
      home: string;
      features: string;
      howToJoin: string;
      pricing: string;
      faq: string;
    };
    getStarted: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    title3: string;
    title3Em: string;
    text: string;
    cta: string;
  };
  featureStrip: {
    items: Array<{ title: string; sub: string }>;
  };
  features: {
    title1: string;
    title2: string;
    subtitle1: string;
    subtitle2: string;
    items: Array<{ title: string; text: string }>;
  };
  steps: {
    chip: string;
    title1: string;
    title2: string;
    intro: string;
    items: Array<{ title: string; text: string }>;
  };
  brand: {
    title1: string;
    title2: string;
    title3: string;
    title4: string;
    subtitle: string;
    items: Array<{ title: string; sub: string }>;
  };
  darkCta: {
    title: string;
    subtitle: string;
    cta: string;
  };
  pricing: {
    title1: string;
    title2: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    billingNoteMonthly: string;
    billingNoteYearly: string;
    plans: Array<{
      key: string;
      name: string;
      desc: string;
      prices: {
        yearly: Array<{ amount: string; term: string }>;
        monthly: Array<{ amount: string; term: string }>;
      };
      features: Array<{ text: string; disabled?: boolean }>;
      cta: string;
    }>;
  };
  testimonials: {
    title1: string;
    title2: string;
    subtitle: string;
    items: Array<{ name: string; place: string; quote: string }>;
  };
  faq: {
    chip: string;
    title1: string;
    title2: string;
    subtitle: string;
    items: Array<{ q: string; a: string }>;
    aside: {
      eyebrow: string;
      title: string;
      text: string;
      cta: string;
      note: string;
    };
  };
  qrCta: {
    title1: string;
    title2: string;
    subtitle1: string;
    subtitle2: string;
    cardTitle: string;
    button: string;
  };
  footer: {
    description: string;
    columns: Array<{ title: string; links: Array<{ label: string; href: string }> }>;
    copyright: string;
    copyrightName: string;
  };
};

