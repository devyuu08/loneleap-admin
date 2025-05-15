import { db } from "@/lib/firebaseAdmin";
import { verifyAdminToken } from "@/lib/auth";
import admin from "firebase-admin";

export default async function deleteReviewWithReports(req, res) {
  // 1. 관리자 인증
  try {
    await verifyAdminToken(req, res); // 이 안에서 토큰 검증 + 이메일 체크 진행
  } catch (err) {
    console.error("관리자 인증 실패:", err.message);
    return res.status(401).json({ error: "관리자 권한이 필요합니다." });
  }

  // 2. 메서드 확인
  if (req.method !== "POST") {
    return res.status(405).json({ error: "허용되지 않은 요청 방식입니다." });
  }

  // 3. 요청 데이터 체크
  const { reviewId } = req.body;
  if (!reviewId) {
    return res.status(400).json({ error: "리뷰 ID가 없습니다." });
  }

  try {
    // 4. 리뷰 신고 문서 조회
    const reportsRef = db
      .collection("review_reports")
      .where("reviewId", "==", reviewId);
    const snapshot = await reportsRef.get();

    // 리뷰 문서 존재 여부 확인
    const reviewRef = db.collection("reviews").doc(reviewId);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res
        .status(404)
        .json({ error: "삭제할 리뷰가 존재하지 않습니다." });
    }

    const createdBy = reviewDoc.data()?.createdBy;
    const authorUid = createdBy?.uid;

    if (!authorUid) {
      return res.status(400).json({ error: "작성자 UID가 없습니다." });
    }

    // 5. 트랜잭션: 리뷰 + 신고 삭제 + 작성자 신고카운트 감소
    await db.runTransaction(async (transaction) => {
      transaction.delete(reviewRef);
      snapshot.docs.forEach((doc) => {
        transaction.delete(doc.ref);
      });

      const userRef = db.collection("users_private").doc(authorUid);
      transaction.update(userRef, {
        reportedCount: admin.firestore.FieldValue.increment(-1),
      });
    });

    return res.status(200).json({
      message: "리뷰 및 신고 삭제 완료",
      deletedReportsCount: snapshot.docs.length,
    });
  } catch (err) {
    console.error("리뷰 삭제 오류:", err);

    if (err.code === "not-found") {
      return res
        .status(404)
        .json({ error: "삭제할 리뷰 또는 신고를 찾을 수 없습니다." });
    } else if (err.code === "permission-denied") {
      return res.status(403).json({ error: "리뷰 삭제 권한이 없습니다." });
    } else {
      return res.status(500).json({
        error: "서버 오류로 삭제 실패",
        details: err.message,
      });
    }
  }
}
