import { useEffect, useRef, useState, useCallback } from 'react';
import useFormStore from '../store/useFormStore';
import { encryptData, decryptData } from '../utils/encryption';

const AUTO_SAVE_KEY = 'lendswift_draft_application';
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds
const MAX_AGE_HOURS = 72;

export default function useAutoSave() {
  const { formData, currentStep, setStep, updateFormData, resetForm } = useFormStore();
  const [lastSaved, setLastSaved] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const timerRef = useRef(null);

  // Check for existing draft on mount
  useEffect(() => {
    const checkDraft = async () => {
      const draftInfo = localStorage.getItem(`${AUTO_SAVE_KEY}_meta`);
      if (draftInfo) {
        try {
          const meta = JSON.parse(draftInfo);
          const now = new Date();
          const draftDate = new Date(meta.timestamp);
          const ageHours = (now - draftDate) / (1000 * 60 * 60);

          if (ageHours < MAX_AGE_HOURS) {
            setHasDraft(true);
          } else {
            // Expired
            clearDraft();
          }
        } catch (e) {
          clearDraft();
        }
      }
      setIsRestoring(false);
    };
    checkDraft();
  }, []);

  const saveDraft = useCallback(async () => {
    if (Object.keys(formData).length === 0) return;

    try {
      const stateToSave = {
        formData,
        currentStep,
      };
      
      // Serialize files to base64 or skip them if they are too large
      // For this simulation, we'll strip out File objects to avoid LocalStorage limits
      // In a real app, files would be uploaded immediately to a temp URL
      const cleanData = JSON.parse(JSON.stringify(stateToSave, (key, value) => {
        if (value instanceof File) return null; // Strip files
        return value;
      }));

      const encrypted = await encryptData(cleanData);
      
      if (encrypted) {
        localStorage.setItem(AUTO_SAVE_KEY, encrypted);
        const meta = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          step: currentStep,
          loanType: formData.loanType || 'Unknown',
        };
        localStorage.setItem(`${AUTO_SAVE_KEY}_meta`, JSON.stringify(meta));
        setLastSaved(new Date());
        
        // Show a temporary toast if we had a toast system
        console.log('Draft auto-saved at', new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error('Failed to auto-save', e);
    }
  }, [formData, currentStep]);

  // Setup interval
  useEffect(() => {
    if (isRestoring || hasDraft) return; // Don't save while asking to restore

    timerRef.current = setInterval(() => {
      saveDraft();
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [saveDraft, isRestoring, hasDraft]);

  // Debounced save on state change (optional, could just rely on interval)
  // For this project, the interval is enough as per spec: "Every 30 seconds..."

  const restoreDraft = async () => {
    const encrypted = localStorage.getItem(AUTO_SAVE_KEY);
    if (encrypted) {
      try {
        const decrypted = await decryptData(encrypted);
        if (decrypted && decrypted.formData) {
          updateFormData(decrypted.formData);
          setStep(decrypted.currentStep || 1);
        }
      } catch (e) {
        console.error('Failed to restore draft', e);
      }
    }
    setHasDraft(false);
  };

  const clearDraft = () => {
    localStorage.removeItem(AUTO_SAVE_KEY);
    localStorage.removeItem(`${AUTO_SAVE_KEY}_meta`);
    setHasDraft(false);
    resetForm();
  };

  return { lastSaved, saveDraft, hasDraft, restoreDraft, clearDraft, isRestoring };
}
