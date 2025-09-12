'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedFormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void | Promise<void>;
  className?: string;
}

export function AnimatedForm({ children, onSubmit, className }: AnimatedFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'transition-all duration-300 ease-out',
        isSubmitting && 'opacity-75 pointer-events-none',
        className
      )}
    >
      {children}
    </form>
  );
}

interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  error?: string;
  className?: string;
}

export function FormField({ children, label, error, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2 fade-slide-up', className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive animate-in slide-in-from-bottom-2 duration-300">
          {error}
        </p>
      )}
    </div>
  );
}
