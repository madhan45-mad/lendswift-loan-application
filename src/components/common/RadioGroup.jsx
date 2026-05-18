import React, { forwardRef } from 'react';
import clsx from 'clsx';

const RadioGroup = forwardRef(
  (
    {
      label,
      name,
      options,
      error,
      className,
      layout = 'vertical', // 'vertical' | 'horizontal'
      ...props
    },
    ref
  ) => {
    return (
      <fieldset className={clsx('flex flex-col gap-2', className)}>
        {label && (
          <legend className="text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </legend>
        )}
        <div 
          className={clsx('flex', {
            'flex-col gap-3': layout === 'vertical',
            'flex-row flex-wrap gap-4': layout === 'horizontal',
          })}
        >
          {options.map((option) => {
            const id = `radio-${name}-${option.value}`;
            return (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={id}
                  name={name}
                  value={option.value}
                  ref={ref}
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary focus:ring-offset-1"
                  aria-invalid={!!error}
                  {...props}
                />
                <label htmlFor={id} className="ml-2 block text-sm text-gray-800">
                  {option.label}
                </label>
              </div>
            );
          })}
        </div>
        
        {error && (
          <p
            className="text-sm text-error mt-1"
            role="alert"
            aria-live="polite"
          >
            {error.message || error}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;
