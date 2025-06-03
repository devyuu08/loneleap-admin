import dayjs from "dayjs";

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
