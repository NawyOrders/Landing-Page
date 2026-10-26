'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import LeadDialog from './LeadDialog';
import FaqDialog from './FaqDialog';

type UiContextValue = {
  openLead: () => void;
  openFaq: () => void;
};

const UiContext = createContext<UiContextValue>({ openLead: () => {}, openFaq: () => {} });

export function useUi() {
  return useContext(UiContext);
}

export default function UiProvider({ children }: { children: ReactNode }) {
  const [leadOpen, setLeadOpen] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState<boolean>(false);

  const openLead = useCallback(() => setLeadOpen(true), []);
  const openFaq = useCallback(() => setFaqOpen(true), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('start') === '1') {
      setLeadOpen(true);
      params.delete('start');
      const query = params.toString();
      window.history.replaceState(
        null,
        '',
        window.location.pathname + (query ? `?${query}` : '') + window.location.hash
      );
    }
  }, []);

  const talkToUs = useCallback(() => {
    setFaqOpen(false);
    setLeadOpen(true);
  }, []);

  return (
    <UiContext.Provider value={{ openLead, openFaq }}>
      {children}
      <LeadDialog open={leadOpen} onClose={() => setLeadOpen(false)} />
      <FaqDialog open={faqOpen} onClose={() => setFaqOpen(false)} onTalkToUs={talkToUs} />
    </UiContext.Provider>
  );
}
