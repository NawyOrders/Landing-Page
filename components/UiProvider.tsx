'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import FaqDialog from './FaqDialog';
import { REGISTER_URL } from './links';

type UiContextValue = {
  openFaq: () => void;
};

const UiContext = createContext<UiContextValue>({ openFaq: () => {} });

export function useUi() {
  return useContext(UiContext);
}

export default function UiProvider({ children }: { children: ReactNode }) {
  const [faqOpen, setFaqOpen] = useState<boolean>(false);

  const openFaq = useCallback(() => setFaqOpen(true), []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('start') === '1') {
      window.location.replace(REGISTER_URL);
    }
  }, []);

  return (
    <UiContext.Provider value={{ openFaq }}>
      {children}
      <FaqDialog open={faqOpen} onClose={() => setFaqOpen(false)} />
    </UiContext.Provider>
  );
}
