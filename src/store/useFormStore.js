import { create } from 'zustand';

const useFormStore = create((set) => ({
  currentStep: 1,
  furthestStep: 1,
  formData: {},
  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ 
    currentStep: Math.min(state.currentStep + 1, 8),
    furthestStep: Math.max(state.furthestStep, state.currentStep + 1)
  })),
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(state.currentStep - 1, 1) 
  })),
  updateFormData: (stepData) => set((state) => ({
    formData: { ...state.formData, ...stepData }
  })),
  resetForm: () => set({ currentStep: 1, furthestStep: 1, formData: {} }),
}));

export default useFormStore;
