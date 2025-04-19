import { db } from "@/lib/firebaseAdmin";
import { verifyAdminToken } from "@/lib/auth";

export default async function getReviewReportsHandler(req, res) {
  try {
    await verifyAdminToken(req, res);
  } catch (error) {
    return res.status(401).json({ error: "인증되지 않은 요청입니다." });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "허용되지 않은 요청 방식입니다." });
  }

  try {
    const parsedLimit = parseInt(req.query.limit);
    const limit = Number.isNaN(parsedLimit) ? 50 : parsedLimit;
    const lastDoc = req.query.lastDoc || null;

    let query = db
      .collection("review_reports")
      .orderBy("reportedAt", "desc")
      .limit(limit);

    if (lastDoc) {
      const lastSnapshot = await db
        .collection("review_reports")
        .doc(lastDoc)
        .get();
      if (lastSnapshot.exists) {
        query = query.startAfter(lastSnapshot);
      }
    }

    const snapshot = await query.get();

    // 1. 신고 데이터 수집
    const reports = snapshot.docs.map((docSnap) => {
      const report = docSnap.data();
      return {
        id: docSnap.id,
        ...report,
        reportedAt: report.reportedAt?.toDate?.().toISOString() || null,
      };
    });

    // 2. 리뷰 ID → 리뷰 정보 조회
    const reviewIds = [...new Set(reports.map((r) => r.reviewId))];
    const reviewSnaps = await Promise.all(
      reviewIds.map((id) => db.collection("reviews").doc(id).get())
    );
    const reviewsMap = {};
    reviewSnaps.forEach((snap) => {
      if (snap.exists) {
        reviewsMap[snap.id] = snap.data();
      }
    });

    const dataWithReviews = reports.map((report) => ({
      ...report,
      review: reviewsMap[report.reviewId] || null,
    }));

    // 3. 사용자 ID → 이메일 조회
    const reporterIds = [...new Set(dataWithReviews.map((r) => r.reporterId))];
    const userSnaps = await Promise.all(
      reporterIds.map((uid) => db.collection("users").doc(uid).get())
    );
    const userMap = {};
    userSnaps.forEach((snap) => {
      if (snap.exists) {
        const userData = snap.data();
        userMap[snap.id] = userData.email || "(이메일 없음)";
      }
    });

    // 4. reporterEmail 추가
    const enrichedData = dataWithReviews.map((report) => {
      return {
        ...report,
        reporterEmail: userMap[report.reporterId] || "(탈퇴한 사용자)",
      };
    });

    return res.status(200).json(enrichedData);
  } catch (error) {
    console.error("리뷰 신고 데이터 불러오기 오류:", error);
    return res.status(500).json({
      error: "리뷰 신고 데이터를 불러오는 중 서버 오류가 발생했습니다",
      ...(process.env.NODE_ENV === "development" && {
        message: error.message,
        stack: error.stack,
      }),
    });
  }
}
