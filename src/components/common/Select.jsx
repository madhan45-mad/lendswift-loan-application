import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { AlertCircle, ChevronDown } from 'lucide-react';

const Select = forwardRef(
  (
    {
      label,
      id,
      error,
      helpText,
      options,
      placeholder = 'Select an option',
      className,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className={clsx('flex flex-col gap-1.5', className)}>
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={clsx(
              'block w-full appearance-none rounded-md border py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-2 transition-colors sm:text-sm',
              {
                'border-error text-error focus:border-error focus:ring-error/20': error,
                'border-gray-300 focus:border-primary focus:ring-primary/20': !error,
                'bg-gray-50 cursor-not-allowed': props.disabled,
              }
            )}
            aria-invalid={!!error}
            aria-describedby={
              clsx(error && `${selectId}-error`, helpText && `${selectId}-help`) || undefined
            }
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {error ? (
              <AlertCircle className="h-5 w-5 text-error" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
            )}
          </div>
        </div>
        
        {error && (
          <p
            className="text-sm text-error mt-1 flex items-start gap-1"
            id={`${selectId}-error`}
            role="alert"
            aria-live="polite"
          >
            {error.message || error}
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500" id={`${selectId}-help`}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
