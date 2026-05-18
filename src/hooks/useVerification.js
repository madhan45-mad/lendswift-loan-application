import { useState, useCallback } from 'react';
import { validatePAN, validateAadhaar } from '../utils/validators';

export default function useVerification(type, loanType) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(null);

  const verify = useCallback(
    async (value) => {
      if (!value) {
        setError(null);
        setIsVerified(false);
        return false;
      }

      setIsVerifying(true);
      setError(null);
      setIsVerified(false);

      // 1. Synchronous format validation
      let validationResult = true;
      if (type === 'PAN') {
        validationResult = validatePAN(value.toUpperCase(), loanType);
      } else if (type === 'Aadhaar') {
        validationResult = validateAadhaar(value);
      }

      if (validationResult !== true) {
        setIsVerifying(false);
        setError(validationResult);
        return false;
      }

      // 2. Simulate API Call Delay (1.5s as per spec)
      return new Promise((resolve) => {
        setTimeout(() => {
          setIsVerifying(false);
          setIsVerified(true);
          resolve(true);
        }, 1500);
      });
    },
    [type, loanType]
  );

  const reset = useCallback(() => {
    setIsVerifying(false);
    setIsVerified(false);
    setError(null);
  }, []);

  return { isVerifying, isVerified, error, verify, reset };
}
