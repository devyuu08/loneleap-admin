import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind 조건부 클래스 병합 함수
 * @param  {...any} inputs - clsx 조건들
 * @returns {string} 병합된 className 문자열
 */
export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}
