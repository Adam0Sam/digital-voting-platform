/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(val: string) {
  return val.charAt(0).toUpperCase() + String(val).slice(1);
}

export function getProgressBetweenDates(startDate: Date, endDate: Date) {
  return function (date: Date) {
    const total = endDate.getTime() - startDate.getTime();
    const current = date.getTime() - startDate.getTime();
    return (current / total) * 100;
  };
}
