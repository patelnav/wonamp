"use client"

import LogRocket from 'logrocket';
import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function AnalyticsProvider() {
  useEffect(() => {
    // Initialize LogRocket in production
    if (process.env.NODE_ENV === 'production') {
      LogRocket.init('98k6pd/wonamp');
    }

    // Initialize Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', 'G-013B1YZQXZ');
  }, []);

  return null;
} 