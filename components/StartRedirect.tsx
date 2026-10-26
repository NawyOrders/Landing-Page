'use client';

import { useEffect } from 'react';
import { REGISTER_URL } from './links';

export default function StartRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('start') === '1') {
      window.location.replace(REGISTER_URL);
    }
  }, []);

  return null;
}
