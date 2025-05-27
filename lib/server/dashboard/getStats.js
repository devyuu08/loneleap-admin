export async function getStats(db) {
  const [reviewSnap, chatSnap, activeUserSnap] = await Promise.all([
    db.collection("review_reports").get(),
    db.collection("chatReports").get(),
    db.collection("users_private").where("status", "==", "active").get(),
  ]);

  return {
    reviewReports: reviewSnap.size,
    chatReports: chatSnap.size,
    activeUsers: activeUserSnap.size,
  };
}
