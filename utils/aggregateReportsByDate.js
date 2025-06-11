import dayjs from "dayjs";

/**
 * 일 단위로 Firestore 스냅샷 데이터를 집계합니다.
 *
 * @param {QuerySnapshot} snapshot - Firestore 쿼리 결과 스냅샷
 * @param {string} field - 집계할 날짜 필드 (ex. "reportedAt")
 * @param {Date | string} startDate - 집계를 시작할 날짜 (dayjs로 변환 가능해야 함)
 * @param {number} [days=7] - 집계할 일수 (기본: 7일)
 * @returns {Array<{ date: string, count: number }>} 날짜별 리포트 수 배열
 */

export function aggregateReportsByDate(snapshot, field, startDate, days = 7) {
  const countMap = {};

  snapshot.forEach((doc) => {
    const rawDate = doc.data()[field];
    if (!rawDate?.toDate) return; // 안전 체크
    const date = dayjs(rawDate.toDate()).format("YYYY-MM-DD");
    countMap[date] = (countMap[date] || 0) + 1;
  });

  return Array.from({ length: days }).map((_, i) => {
    const date = dayjs(startDate).add(i, "day").format("YYYY-MM-DD");
    return { date, count: countMap[date] || 0 };
  });
}
