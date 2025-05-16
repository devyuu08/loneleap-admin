import { db, adminAuth } from "@/lib/firebaseAdmin";

/**
 * UID 기반으로 유저의 모든 컨텐츠 + 계정 삭제
 */
export default async function deleteUserData(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "UID 누락" });

  try {
    // 1. users_private & users_public 삭제
    await Promise.all([
      db.collection("users_private").doc(uid).delete(),
      db.collection("users_public").doc(uid).delete(),
    ]);

    // 2. 일정 삭제
    const itinerarySnap = await db
      .collection("itineraries")
      .where("createdBy.uid", "==", uid)
      .get();

    const itineraryDeletes = itinerarySnap.docs.map((doc) =>
      db.collection("itineraries").doc(doc.id).delete()
    );

    // 3. 리뷰 + 리뷰 내 서브컬렉션 삭제
    const reviewSnap = await db
      .collection("reviews")
      .where("createdBy.uid", "==", uid)
      .get();

    const reviewDeletes = reviewSnap.docs.map(async (doc) => {
      const reviewRef = db.collection("reviews").doc(doc.id);

      // likes
      const likesSnap = await reviewRef.collection("likes").get();
      const likesDeletes = likesSnap.docs.map((d) => d.ref.delete());

      // comments (작성자만 삭제)
      const commentsSnap = await reviewRef
        .collection("comments")
        .where("author.uid", "==", uid)
        .get();
      const commentsDeletes = commentsSnap.docs.map((d) => d.ref.delete());

      await Promise.all([...likesDeletes, ...commentsDeletes]);
      return reviewRef.delete();
    });

    // 4. 채팅 메시지 삭제
    const msgSnap = await db
      .collection("chatMessages")
      .where("sender.uid", "==", uid)
      .get();
    const messageDeletes = msgSnap.docs.map((doc) =>
      db.collection("chatMessages").doc(doc.id).delete()
    );

    // 5. 채팅방 삭제 (본인이 만든 채팅방만)
    const chatRoomSnap = await db
      .collection("chatRooms")
      .where("createdBy.uid", "==", uid)
      .get();
    const chatRoomDeletes = chatRoomSnap.docs.map((doc) =>
      db.collection("chatRooms").doc(doc.id).delete()
    );

    // 6. 신고 기록 삭제
    const reviewReportSnap = await db
      .collection("review_reports")
      .where("reporterId", "==", uid)
      .get();
    const reviewReportDeletes = reviewReportSnap.docs.map((doc) =>
      db.collection("review_reports").doc(doc.id).delete()
    );

    const chatReportSnap = await db
      .collection("chatReports")
      .where("reporterId", "==", uid)
      .get();
    const chatReportDeletes = chatReportSnap.docs.map((doc) =>
      db.collection("chatReports").doc(doc.id).delete()
    );

    // 7. Firebase Authentication 계정 삭제
    await adminAuth.deleteUser(uid);

    // 병렬 처리 실행
    await Promise.all([
      ...itineraryDeletes,
      ...reviewDeletes,
      ...messageDeletes,
      ...chatRoomDeletes,
      ...reviewReportDeletes,
      ...chatReportDeletes,
    ]);

    return res.status(200).json({ message: "모든 데이터 및 계정 삭제 완료" });
  } catch (error) {
    console.error("계정 삭제 실패:", error);
    return res.status(500).json({ error: error.message || "서버 오류" });
  }
}
