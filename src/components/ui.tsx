import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variants = {
    primary: 'bg-black text-white hover:bg-zinc-800',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
    outline: 'border border-zinc-200 bg-transparent hover:bg-zinc-50',
    ghost: 'bg-transparent hover:bg-zinc-100 text-zinc-600',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg font-medium',
  };

  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('bg-white border border-zinc-100 rounded-2xl shadow-sm overflow-hidden', className)}>
      {children}
    </div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      className={cn(
        'w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all',
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea 
      className={cn(
        'w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all min-h-[100px]',
        className
      )}
      {...props}
    />
  );
}
