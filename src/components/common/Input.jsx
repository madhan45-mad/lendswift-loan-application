import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

const Input = forwardRef(
  (
    {
      label,
      id,
      error,
      helpText,
      className,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={clsx('flex flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={clsx(
              'block w-full rounded-md border py-2 px-3 shadow-sm focus:outline-none focus:ring-2 transition-colors sm:text-sm',
              {
                'border-error text-error focus:border-error focus:ring-error/20': error,
                'border-gray-300 focus:border-primary focus:ring-primary/20': !error,
                'bg-gray-50 cursor-not-allowed': props.disabled,
              }
            )}
            aria-invalid={!!error}
            aria-describedby={
              clsx(error && `${inputId}-error`, helpText && `${inputId}-help`) || undefined
            }
            {...props}
          />
          {error && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <AlertCircle className="h-5 w-5 text-error" aria-hidden="true" />
            </div>
          )}
        </div>
        
        {error && (
          <p
            className="text-sm text-error mt-1 flex items-start gap-1"
            id={`${inputId}-error`}
            role="alert"
            aria-live="polite"
          >
            {error.message || error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500" id={`${inputId}-help`}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
