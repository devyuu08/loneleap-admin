import { db, adminAuth } from "@/lib/firebase/admin";

/**
 * 주어진 UID를 가진 사용자의 모든 데이터를 Firestore 및 Firebase Auth에서 삭제합니다.
 *
 * 삭제 항목:
 * - users_private / users_public 문서
 * - 생성한 일정, 리뷰, 채팅방, 채팅 메시지
 * - 작성한 리뷰/채팅 신고
 * - Firebase Auth 계정
 *
 * @param {string} uid - 삭제할 사용자 UID
 * @returns {Promise<{ success: boolean }>} - 성공 여부 반환
 * @throws {Error} - 삭제 실패 시 에러 발생
 */

export default async function deleteUserData(uid) {
  if (!uid) throw new Error("UID 누락");

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

    // 3. 리뷰 삭제
    const reviewSnap = await db
      .collection("reviews")
      .where("createdBy.uid", "==", uid)
      .get();
    const reviewDeletes = reviewSnap.docs.map((doc) =>
      db.collection("reviews").doc(doc.id).delete()
    );

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

    // 7. Firebase Auth 계정 삭제
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

    return { success: true };
  } catch (error) {
    console.error("계정 삭제 실패:", error);
    throw new Error(error.message || "서버 오류");
  }
}
