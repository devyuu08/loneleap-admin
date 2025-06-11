/**
 * 다양한 날짜 입력 값을 한국어(KR) 로케일 기준의 날짜 문자열로 포맷팅합니다.
 * - 입력이 없거나 유효하지 않을 경우 "N/A"를 반환합니다.
 * - 문자열, Date 객체, Firestore Timestamp 모두 처리 가능합니다.
 *
 * @param {string | Date | { toDate: () => Date }} input - 날짜 문자열, Date 객체, 또는 Firestore Timestamp
 * @returns {string} - "YYYY.MM.DD HH:MM" 형식의 날짜 문자열 (예: 2025.06.08 14:30)
 */

export function formatDateKR(input) {
  if (!input) return "N/A";
  const date =
    typeof input === "string" ? new Date(input) : input.toDate?.() ?? null;

  return date
    ? date.toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
}
