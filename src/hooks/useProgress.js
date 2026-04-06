import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ccaf-progress';

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  const setStatus = useCallback((key, value) => {
    setProgress((prev) => {
      const next = { ...prev, [key]: value };
      saveProgress(next);
      return next;
    });
  }, []);

  const getStatus = useCallback(
    (key, fallback) => {
      return progress[key] !== undefined ? progress[key] : fallback;
    },
    [progress]
  );

  const toggleChecked = useCallback((key) => {
    setProgress((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({});
  }, []);

  return { progress, getStatus, setStatus, toggleChecked, resetAll };
}
