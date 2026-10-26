'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowIcon } from './Icons';

type LeadDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function LeadDialog({ open, onClose }: LeadDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [sent, setSent] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>('');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add('dialog-open');
      const card = dialog.querySelector<HTMLElement>('.modal-card');
      if (card) card.scrollTop = 0;
      window.setTimeout(() => {
        const firstField = dialog.querySelector<HTMLInputElement>('input');
        if (firstField) firstField.focus();
      }, 60);
    } else if (!open && dialog.open) {
      dialog.close();
      document.documentElement.classList.remove('dialog-open');
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSent(false);
      setFirstName('');
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setFirstName(String(data.get('contactName') || '').trim().split(' ')[0]);
    setSent(true);
  }

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="lead-title"
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div className="modal-card lead-card">
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

        {sent ? (
          <div className="lead-success">
            <span className="success-badge" aria-hidden="true">
              <svg viewBox="0 0 48 48" focusable="false">
                <circle cx="24" cy="24" r="24" fill="#fde4dc" />
                <path
                  d="m14.5 24.4 6.4 6.4L34 17.4"
                  fill="none"
                  stroke="#e43820"
                  strokeWidth="3.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h2 id="lead-title">Request received{firstName ? `, ${firstName}` : ''}!</h2>
            <p className="modal-sub">
              Our team will contact your restaurant within <strong>48 hours</strong> to get your app
              up and running.
            </p>
            <button type="button" className="btn btn--primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <>
            <span className="chip">Get started</span>
            <h2 id="lead-title">
              Start your journey with <span className="accent">Nawy Orders</span>
            </h2>
            <p className="modal-sub">
              Register your details and our team will contact your restaurant within{' '}
              <strong>48 hours.</strong>
            </p>

            <form className="lead-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="lead-restaurant">Restaurant name</label>
                <input
                  id="lead-restaurant"
                  name="restaurantName"
                  type="text"
                  autoComplete="organization"
                  placeholder="Moonlight Cafe"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="lead-name">Your name</label>
                <input
                  id="lead-name"
                  name="contactName"
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="lead-phone">Phone number</label>
                <input
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+20 1XX XXX XXXX"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="lead-email">Email</label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@restaurant.com"
                />
              </div>
              <div className="field field--full">
                <label htmlFor="lead-branches">Number of branches</label>
                <select id="lead-branches" name="branches" defaultValue="1">
                  <option value="1">1 branch</option>
                  <option value="2">2 branches</option>
                  <option value="3-5">3 – 5 branches</option>
                  <option value="6+">6+ branches</option>
                </select>
              </div>
              <div className="field field--full">
                <label htmlFor="lead-notes">Anything we should know?</label>
                <textarea
                  id="lead-notes"
                  name="notes"
                  rows={3}
                  placeholder="Tell us about your restaurant (optional)"
                />
              </div>

              <div className="lead-actions field--full">
                <button type="submit" className="btn btn--primary">
                  Send request
                  <ArrowIcon />
                </button>
                <p className="form-note">
                  By sending this request you agree to be contacted about Nawy Orders.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
