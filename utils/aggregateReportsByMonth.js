import dayjs from "dayjs";

/**
 * 월 단위로 Firestore 스냅샷 데이터를 집계합니다.
 *
 * @param {QuerySnapshot} snapshot - Firestore 쿼리 결과 스냅샷
 * @param {string} field - 집계할 날짜 필드 (ex. "createdAt")
 * @param {Date | string} startMonth - 집계를 시작할 월 (dayjs로 변환 가능해야 함)
 * @param {number} [months=6] - 집계할 개월 수 (기본: 6개월)
 * @returns {Array<{ month: string, count: number }>} 월별 데이터 수 배열
 */

export function aggregateReportsByMonth(
  snapshot,
  field,
  startMonth,
  months = 6
) {
  const countMap = {};

  snapshot.forEach((doc) => {
    const rawDate = doc.data()[field];
    if (!rawDate?.toDate) return;
    const month = dayjs(rawDate.toDate()).format("YYYY-MM");
    countMap[month] = (countMap[month] || 0) + 1;
  });

  const monthList = Array.from({ length: months }).map((_, i) =>
    dayjs(startMonth).add(i, "month").format("YYYY-MM")
  );

  return monthList.map((month) => ({
    month,
    count: countMap[month] || 0,
  }));
}
