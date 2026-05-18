import React, { useRef, useState, useEffect } from 'react';
import SignaturePad from 'react-signature-canvas';
import { Eraser } from 'lucide-react';
import clsx from 'clsx';

export default function SignatureCanvas({ label, error, onChange, value, required }) {
  const padRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);

  // Load existing value if any
  useEffect(() => {
    if (value && padRef.current && padRef.current.isEmpty()) {
      padRef.current.fromDataURL(value);
      setIsEmpty(false);
    }
  }, [value]);

  const handleClear = () => {
    if (padRef.current) {
      padRef.current.clear();
      setIsEmpty(true);
      onChange('');
    }
  };

  const handleEnd = () => {
    if (padRef.current) {
      setIsEmpty(padRef.current.isEmpty());
      const dataUrl = padRef.current.getTrimmedCanvas().toDataURL('image/png');
      onChange(dataUrl);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700 flex justify-between items-center">
          <span>
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
          >
            <Eraser className="w-3 h-3" />
            Clear
          </button>
        </label>
      )}
      
      <div 
        className={clsx(
          "border rounded-lg overflow-hidden bg-gray-50 touch-none relative transition-colors",
          {
            "border-error focus-within:border-error focus-within:ring-1 focus-within:ring-error/20": error,
            "border-gray-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20": !error,
          }
        )}
      >
        {/* Overlay to prevent basic screen capture / emphasize area */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 select-none">
            Sign here
          </div>
        )}
        <SignaturePad
          ref={padRef}
          onEnd={handleEnd}
          canvasProps={{
            className: "w-full h-40 cursor-crosshair relative z-10",
          }}
        />
      </div>

      {error && (
        <p className="text-sm text-error mt-1" role="alert" aria-live="polite">
          {error.message || error}
        </p>
      )}
    </div>
  );
}
