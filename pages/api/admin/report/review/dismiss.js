import { db } from "@/lib/firebase/admin";
import admin from "firebase-admin";

export default async function dismissReviewReports(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "허용되지 않은 요청 방식입니다." });
  }

  const { reportId } = req.body;

  if (!reportId) {
    return res.status(400).json({ error: "신고 ID가 없습니다." });
  }

  try {
    const docRef = db.collection("review_reports").doc(reportId);
    const reportDoc = await docRef.get();

    if (!reportDoc.exists) {
      return res.status(404).json({ error: "해당 신고를 찾을 수 없습니다." });
    }

    const { reviewId } = reportDoc.data();
    if (!reviewId) {
      return res.status(400).json({ error: "리뷰 ID가 누락되었습니다." });
    }

    // 리뷰 문서에서 작성자 정보 조회
    const reviewRef = db.collection("reviews").doc(reviewId);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res.status(404).json({ error: "리뷰 문서를 찾을 수 없습니다." });
    }

    const createdBy = reviewDoc.data().createdBy;
    const authorUid = createdBy?.uid;

    if (!authorUid) {
      return res.status(400).json({ error: "리뷰 작성자 UID가 없습니다." });
    }

    // 트랜잭션으로 신고 문서 삭제 + 작성자 reportedCount 감소
    await db.runTransaction(async (transaction) => {
      const userRef = db.collection("users_private").doc(authorUid);
      const userSnap = await transaction.get(userRef);
      const currentCount = userSnap.data()?.reportedCount || 0;

      transaction.delete(docRef);

      // 0 이하로 내려가지 않도록 방어
      if (currentCount > 0) {
        transaction.update(userRef, {
          reportedCount: admin.firestore.FieldValue.increment(-1),
        });
      }
    });

    return res
      .status(200)
      .json({ message: "신고 무시 및 사용자 이력 반영 완료" });
  } catch (err) {
    console.error("신고 무시 처리 중 오류:", err);
    return res
      .status(500)
      .json({ error: "서버 오류로 삭제 실패", details: err.message });
  }
}
