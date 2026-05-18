import { useState, useCallback } from 'react';
import pinCodeData from '../utils/pinCodeData.json';

export default function usePinCodeLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const lookup = useCallback(async (pinCode) => {
    if (!pinCode || pinCode.length !== 6) {
      return null;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        const data = pinCodeData[pinCode];
        
        if (data) {
          resolve(data);
        } else {
          // If not in our mock DB but valid format, we could return generic
          // but let's strictly enforce our mock DB for this exercise to show errors
          setError('PIN Code not found. Try 110001, 400001, 560001, etc.');
          resolve(null);
        }
      }, 800); // 800ms delay for realistic feel
    });
  }, []);

  return { lookup, isLoading, error };
}
