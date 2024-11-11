/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + String(val).slice(1);
}

export function getCachedFunction<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => TResult,
) {
  const cache: Record<string, TResult> = {};
  return (...args: TArgs) => {
    const key = JSON.stringify(args);
    if (cache[key]) {
      return cache[key];
    }
    console.log('Cache miss');
    cache[key] = fn(...args);
    return cache[key];
  };
}

export function getProgressBetweenDates(startDate: Date, endDate: Date) {
  return function (date: Date) {
    const total = endDate.getTime() - startDate.getTime();
    const current = date.getTime() - startDate.getTime();
    return (current / total) * 100;
  };
}
