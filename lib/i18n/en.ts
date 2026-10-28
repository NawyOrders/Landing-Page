import type { Dictionary } from './dictionary';

export const en: Dictionary = {
  header: {
    nav: {
      home: 'Home',
      features: 'Features',
      howToJoin: 'How to join',
      pricing: 'Plans',
      faq: 'FAQ',
    },
    getStarted: 'Get Started',
  },
  hero: {
    badge: 'Smart Restaurant Management',
    title1: 'Your Restaurant.',
    title2: 'Your Orders',
    title3: 'All in One',
    title3Em: 'Place',
    text: 'Manage orders, simplify daily operations, and deliver a better customer experience — all from one powerful platform.',
    cta: 'Explore Nawy Orders',
  },
  featureStrip: {
    items: [
      { title: 'Easy Setup', sub: 'Get Started in minutes' },
      { title: 'Trusted by 500+', sub: 'Cafes World Wide' },
      { title: 'Secure & reliable', sub: 'Your Data is always Safe' },
      { title: '24/7 Support', sub: 'Partner Companies' },
    ],
  },
  features: {
    title1: 'Everything your restaurant needs',
    title2: 'in one app',
    subtitle1: 'Integrated features that help you manage your restaurant and',
    subtitle2: 'increase your sales',
    items: [
      {
        title: 'Zero Commission',
        text: 'Orders reach you in full, with no commission or percentage taken from your profits.',
      },
      {
        title: 'Online Orders',
        text: 'Receive orders directly on the app without an intermediary.',
      },
      {
        title: 'Coupons and Discounts',
        text: "Activate offers and discount coupons to increase your customers' loyalty.",
      },
      {
        title: 'Your Own Website',
        text: "An online ordering website with your menu and your restaurant's name.",
      },
      {
        title: 'Smart Dashboard',
        text: 'Track orders, sales, and the menu from one simple dashboard.',
      },
      {
        title: "Your Customers' Data",
        text: 'Know your customers and make them prefer you with discounts and offers.',
      },
    ],
  },
  steps: {
    chip: 'How to Join',
    title1: 'Nawy Order solves the problem',
    title2: 'in 3 simple steps',
    intro: 'From subscribing until receiving your ready app… all in a short time.',
    items: [
      {
        title: 'Subscribe',
        text: 'From subscribing until receiving your ready app… all in a short time.',
      },
      {
        title: 'Send the Logo',
        text: "Send us your restaurant's logo, name, and preferred colors, and leave the rest to us.",
      },
      {
        title: 'Receive your App',
        text: 'A ready app with your complete visual identity, published on Google Play and the App Store.',
      },
    ],
  },
  brand: {
    title1: 'We provide you with an app',
    title2: 'customized',
    title3: 'exclusively for',
    title4: 'your brand identity',
    subtitle: "As soon as you send us your restaurant's logo and colors, we will create your app with your complete visual identity.",
    items: [
      { title: 'Appetite Boost', sub: 'Colors that drive sales' },
      { title: 'Natural Vibes', sub: 'Fresh and organic feel' },
      { title: 'Cool Trust', sub: 'Builds customer confidence' },
    ],
  },
  darkCta: {
    title: 'More Orders, Lower Costs.',
    subtitle: 'Take your restaurant digital and easily double your profits.',
    cta: 'Start Now',
  },
  pricing: {
    title1: 'Two packages to',
    title2: 'suit every stage',
    subtitle: 'Choose the package that fits your restaurant and start today',
    monthly: 'Monthly',
    yearly: 'Yearly',
    billingNoteMonthly: 'Billed monthly',
    billingNoteYearly: 'Billed yearly — choose your term',
    plans: [
      {
        key: 'start',
        name: 'Start',
        desc: 'For restaurants starting their journey',
        prices: {
          yearly: [
            { amount: '15,000 EGP', term: '/ 3 months' },
            { amount: '32,000 EGP', term: '/ 6 Months' },
            { amount: '60,000 EGP', term: '/ 12 months' },
          ],
          monthly: [{ amount: '6,000 EGP', term: '/ month' }],
        },
        features: [
          { text: 'Menu and item management' },
          { text: 'Daily sales reports' },
          { text: 'Two connected branches' },
          { text: 'Email support' },
          { text: 'Website, PWA' },
          { text: 'Android and iOS app', disabled: true },
        ],
        cta: 'Get Started',
      },
      {
        key: 'growth',
        name: 'Growth',
        desc: 'For growing and expanding restaurants',
        prices: {
          yearly: [
            { amount: '17,000 EGP', term: '/ 3 months' },
            { amount: '34,000 EGP', term: '/ 6 months' },
          ],
          monthly: [{ amount: '7,000 EGP', term: '/ month' }],
        },
        features: [
          { text: 'Menu and item management' },
          { text: 'Daily sales reports' },
          { text: 'Two connected branches' },
          { text: 'Email support' },
          { text: 'Website, PWA' },
          { text: 'Android and iOS app' },
        ],
        cta: 'Get Started',
      },
    ],
  },
  testimonials: {
    title1: 'What they say',
    title2: 'about us',
    subtitle: 'Real success stories from restaurants using Nawy Orders',
    items: [
      {
        name: 'Khaled Lamri',
        place: 'Burger kings',
        quote: 'Inventory reports saved us a lot of waste. My team learned the system in one day. Highly professional technical support.',
      },
      {
        name: 'Sara El-Khatib',
        place: "Al-Sa'ada Cafe",
        quote: 'Orders now reach the kitchen in seconds. Customers noticed the difference from the first week. The best decision I made is Nawy Orders.',
      },
      {
        name: 'Ahmed El-Masry',
        place: 'Pie & Honey Restaurant',
        quote: 'We waste hours every day on calculations. Now everything is in front of me on one screen. And sales increased by 30% in the first two months.',
      },
    ],
  },
  faq: {
    chip: 'FAQ',
    title1: 'Frequently asked',
    title2: 'questions',
    subtitle: 'Everything you need to know before getting started.',
    items: [
      {
        q: 'What is Nawy Orders?',
        a: 'A platform that helps restaurant owners build their own ordering app and website with their own visual identity, plus a dashboard to manage orders, menus, and daily sales.',
      },
      {
        q: 'Do you take a commission on my orders?',
        a: 'No. Orders reach you in full, with zero commission or percentage taken from your profits. You keep every pound your restaurant earns.',
      },
      {
        q: 'How long does the setup take?',
        a: 'From subscribing until receiving your ready app, everything happens in a short time. Our team contacts you within 48 hours and walks you through the whole process.',
      },
      {
        q: 'What is included in the plans?',
        a: 'Both packages include menu and item management, daily sales reports, two connected branches, email support, and a website/PWA. Growth adds the Android and iOS app.',
      },
      {
        q: 'Can the app match my restaurant brand?',
        a: 'Yes. Send us your logo, name, and preferred colors, and we will create your app with your complete visual identity before publishing it on Google Play and the App Store.',
      },
    ],
    aside: {
      eyebrow: 'Need a hand?',
      title: 'Still have a question?',
      text: 'Talk to our team. We will walk you through setup, plans, and the app that fits your restaurant.',
      cta: 'Talk to our team',
      note: 'We usually reply within 48 hours.',
    },
  },
  qrCta: {
    title1: 'Start your journey today with',
    title2: 'Nawy Orders',
    subtitle1: 'Register your details and our team will contact your restaurant within',
    subtitle2: '48 hours.',
    cardTitle: 'Scan the code to register',
    button: 'Register directly',
  },
  footer: {
    description: 'A platform that helps restaurant owners build their own applications with their visual identity easily and quickly.',
    columns: [
      {
        title: 'Company',
        links: [
          { label: 'About Us', href: '#home' },
          { label: 'Our Team', href: '#testimonials' },
          { label: 'Careers', href: '#how-to-join' },
          { label: 'Contact Us', href: '#get-started' },
        ],
      },
      {
        title: 'Product',
        links: [
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Templates', href: '#brand' },
          { label: 'FAQ', href: '#faq' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '#home' },
          { label: 'Terms and Conditions', href: '#home' },
          { label: 'Refund Policy', href: '#home' },
        ],
      },
    ],
    copyright: '© 2026 Nawy Orders. All rights reserved to',
    copyrightName: 'SpaceTech',
  },
};

