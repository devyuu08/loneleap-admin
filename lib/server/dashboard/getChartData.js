import dayjs from "dayjs";
import { aggregateReportsByDate } from "@/utils/aggregateReportsByDate";
import { aggregateReportsByMonth } from "@/utils/aggregateReportsByMonth";

export async function getChartData(db) {
  const today = dayjs().endOf("day");
  const sevenDaysAgo = today.subtract(6, "day").startOf("day");
  const sixMonthsAgo = today.subtract(5, "month").startOf("month");

  const [reviewSnap, chatSnap] = await Promise.all([
    db
      .collection("review_reports")
      .where("reportedAt", ">=", sevenDaysAgo.toDate())
      .get(),
    db
      .collection("chatReports")
      .where("reportedAt", ">=", sevenDaysAgo.toDate())
      .get(),
  ]);

  const reviewReports = aggregateReportsByDate(
    reviewSnap,
    "reportedAt",
    sevenDaysAgo,
    7
  );
  const chatReports = aggregateReportsByDate(
    chatSnap,
    "reportedAt",
    sevenDaysAgo,
    7
  );

  const [userSnap, reviewMonthSnap, itinerarySnap] = await Promise.all([
    db.collection("users_private").get(),
    db
      .collection("reviews")
      .where("createdAt", ">=", sixMonthsAgo.toDate())
      .get(),
    db
      .collection("itineraries")
      .where("createdAt", ">=", sixMonthsAgo.toDate())
      .get(),
  ]);

  const statusDistMap = {};
  userSnap.forEach((doc) => {
    const status = doc.data().status || "unknown";
    statusDistMap[status] = (statusDistMap[status] || 0) + 1;
  });

  const userStatusDist = Object.entries(statusDistMap).map(
    ([status, count]) => ({ status, count })
  );

  const reviewMonths = aggregateReportsByMonth(
    reviewMonthSnap,
    "createdAt",
    sixMonthsAgo,
    6
  );
  const itineraryMonths = aggregateReportsByMonth(
    itinerarySnap,
    "createdAt",
    sixMonthsAgo,
    6
  );

  const activityByMonth = reviewMonths.map(({ month, count }) => ({
    month,
    reviews: count,
    itineraries:
      itineraryMonths.find((item) => item.month === month)?.count || 0,
  }));

  return {
    reviewReports,
    chatReports,
    userStatusDist,
    activityByMonth,
  };
}
