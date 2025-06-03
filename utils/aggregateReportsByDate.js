import dayjs from "dayjs";

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
