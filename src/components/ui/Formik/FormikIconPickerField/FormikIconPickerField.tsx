'use client';

import React, { useState, useEffect } from 'react';
import { ErrorMessage, useField } from 'formik';
import { AlertCircle } from 'lucide-react';
import { LucideIconName } from './LucideIconName';
import WorkingIconPicker from './WorkingIconPicker';

export interface FormikIconPickerFieldProps {
  /** The field name for Formik */
  name: string;
  /** Label text for the field */
  label: string;
  /** Optional help text shown below the field */
  helpText?: string;
  /** Placeholder text for the dropdown */
  placeholder?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the dropdown */
  dropdownClassName?: string;
  /** Maximum height for the dropdown menu */
  maxHeight?: string;
  /** Whether to show a loading state initially */
  showLoadingInitially?: boolean;
}

export default function FormikIconPickerField({
  name,
  label,
  helpText,
  placeholder = "Select an icon",
  required = false,
  disabled = false,
  className = '',
  dropdownClassName = '',
  maxHeight = '320px',
  showLoadingInitially = true
}: FormikIconPickerFieldProps) {
  // Formik field hook
  const [field, meta, helpers] = useField<LucideIconName | null>(name);
  
  // Local state for client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Handle client-side mounting
  useEffect(() => {
    // Small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsClient(true);
    }, showLoadingInitially ? 100 : 0);
    
    return () => clearTimeout(timer);
  }, [showLoadingInitially]);

  // Handle value change
  const handleChange = (iconName: LucideIconName) => {
    helpers.setValue(iconName);
  };

  // Handle clearing the field
  const handleClear = () => {
    helpers.setValue(null);
  };

  // Determine if field has error
  const hasError = Boolean(meta.touched && meta.error);
  
  // Show loading state during SSR or initial hydration
  if (!isClient && showLoadingInitially) {
    return (
      <div className={`space-y-2 ${className}`}>
        {/* Label */}
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {/* Loading skeleton */}
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-md"></div>
        </div>
        
        {/* Help text placeholder */}
        {helpText && (
          <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Icon Picker Dropdown */}
      <div className="relative">
        <WorkingIconPicker
          value={field.value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${dropdownClassName} ${hasError ? 'border-red-300' : ''}`}
        />
        
        {/* Clear button - shown when there's a value */}
        {field.value && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
            title="Clear selection"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Help text */}
      {helpText && !hasError && (
        <p className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {/* Error message */}
      <ErrorMessage name={name}>
        {(error) => (
          <div className="flex items-start gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </ErrorMessage>
      
    </div>
  );
}