import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function to combine Tailwind CSS classes and resolve conflicts.
 * Uses clsx for conditional logic and tailwind-merge to handle overrides.
 * 
 * @param inputs - List of class names or conditional class objects
 * @returns A merged string of valid Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
