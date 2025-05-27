import dayjs from "dayjs";

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

  const reviewMap = {},
    chatMap = {};

  reviewSnap.forEach((doc) => {
    const date = dayjs(doc.data().reportedAt?.toDate()).format("YYYY-MM-DD");
    reviewMap[date] = (reviewMap[date] || 0) + 1;
  });

  chatSnap.forEach((doc) => {
    const date = dayjs(doc.data().reportedAt?.toDate()).format("YYYY-MM-DD");
    chatMap[date] = (chatMap[date] || 0) + 1;
  });

  const reviewReports = Array.from({ length: 7 }).map((_, i) => {
    const date = sevenDaysAgo.add(i, "day").format("YYYY-MM-DD");
    return { date, count: reviewMap[date] || 0 };
  });

  const chatReports = Array.from({ length: 7 }).map((_, i) => {
    const date = sevenDaysAgo.add(i, "day").format("YYYY-MM-DD");
    return { date, count: chatMap[date] || 0 };
  });

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

  const reviewMonthMap = {},
    itineraryMonthMap = {};

  reviewMonthSnap.forEach((doc) => {
    const month = dayjs(doc.data().createdAt.toDate()).format("YYYY-MM");
    reviewMonthMap[month] = (reviewMonthMap[month] || 0) + 1;
  });

  itinerarySnap.forEach((doc) => {
    const month = dayjs(doc.data().createdAt.toDate()).format("YYYY-MM");
    itineraryMonthMap[month] = (itineraryMonthMap[month] || 0) + 1;
  });

  const months = Array.from({ length: 6 }).map((_, i) =>
    sixMonthsAgo.add(i, "month").format("YYYY-MM")
  );

  const activityByMonth = months.map((month) => ({
    month,
    reviews: reviewMonthMap[month] || 0,
    itineraries: itineraryMonthMap[month] || 0,
  }));

  return {
    reviewReports,
    chatReports,
    userStatusDist,
    activityByMonth,
  };
}
