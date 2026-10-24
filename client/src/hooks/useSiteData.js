import { useState, useEffect } from 'react';
import fallbackData from '../data/data.json';

export default function useSiteData() {
  const hasLocalData = typeof window !== 'undefined' && !!localStorage.getItem('lfc_data');
  const [data, setData] = useState(() => {
    try {
      const local = localStorage.getItem('lfc_data');
      return local ? JSON.parse(local) : fallbackData;
    } catch {
      return fallbackData;
    }
  });
  const [loading, setLoading] = useState(!hasLocalData);

  useEffect(() => {
    if (hasLocalData) return;

    fetch('/data.json')
      .then(r => r.ok ? r.json() : fallbackData)
      .then(j => setData(j))
      .catch(() => setData(fallbackData))
      .finally(() => setLoading(false));

    const onStorage = (e) => {
      if (e.key === 'lfc_data' && e.newValue) {
        try { setData(JSON.parse(e.newValue)); } catch {}
      }
    };

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [hasLocalData]);

  return { data, loading };
}
