export async function getStats(db) {
  const [reviewCountSnap, chatCountSnap, activeUserCountSnap] =
    await Promise.all([
      db.collection("review_reports").count().get(),
      db.collection("chatReports").count().get(),
      db
        .collection("users_private")
        .where("status", "==", "active")
        .count()
        .get(),
    ]);

  return {
    reviewReports: reviewCountSnap.data().count,
    chatReports: chatCountSnap.data().count,
    activeUsers: activeUserCountSnap.data().count,
  };
}
