import { useEffect, useState } from 'react';

export function readStored(key, fallback, validate = () => true) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value !== null && validate(value) ? value : fallback;
  } catch { return fallback; }
}

export function useLocalStorage(key, initialValue, validate) {
  const [value, setValue] = useState(() => readStored(key, initialValue, validate));
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setStorageError(false);
    } catch { setStorageError(true); }
  }, [key, value]);
  return [value, setValue, storageError];
}
