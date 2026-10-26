'use client';

import { useEffect, useRef } from 'react';
import RegisterLink from './RegisterLink';

const faqs = [
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
];

type FaqDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function FaqDialog({ open, onClose }: FaqDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('dialog-open');
      const firstSummary = dialog.querySelector<HTMLElement>('summary');
      if (firstSummary) firstSummary.focus();
    } else if (!open && dialog.open) {
      dialog.close();
      document.documentElement.classList.remove('dialog-open');
    }
  }, [open]);

  useEffect(() => {
    return () => document.documentElement.classList.remove('dialog-open');
  }, []);

  function handleCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    onClose();
  }

  function handleBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="faq-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="modal-card faq-card">
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M6 6l12 12M18 6 6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <span className="chip">FAQ</span>
        <h2 id="faq-title">Frequently asked questions</h2>
        <p className="modal-sub">Everything you need to know before getting started.</p>

        <div className="faq-list">
          {faqs.map((item) => (
            <details key={item.q}>
              <summary>
                {item.q}
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M6 9.5 12 15l6-5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        <div className="faq-cta">
          <p>Still have a question?</p>
          <RegisterLink className="btn btn--primary">Talk to our team</RegisterLink>
        </div>
      </div>
    </dialog>
  );
}
