import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// アイコンが URL か判定（http/https で始まるか）
export function isImageUrl(value?: string): boolean {
  return Boolean(value && (value.startsWith("http://") || value.startsWith("https://")))
}