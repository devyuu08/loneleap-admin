import { verifyAdminToken } from "@/lib/server/auth";
import { db } from "@/lib/firebase/admin";
import admin from "firebase-admin";

export default async function dismissChatReport(req, res) {
  // 관리자 인증
  let decoded;
  try {
    decoded = await verifyAdminToken(req, res);
  } catch (error) {
    return res.status(401).json({ error: error.message || "인증 실패" });
  }

  // 메서드 검증
  if (req.method !== "POST") {
    return res.status(405).json({ error: "허용되지 않은 요청 방식입니다." });
  }

  const { reportId } = req.body;
  if (!reportId || typeof reportId !== "string") {
    return res.status(400).json({ error: "유효하지 않은 신고 ID입니다." });
  }

  try {
    const reportRef = db.collection("chatReports").doc(reportId);
    const reportSnap = await reportRef.get();

    if (!reportSnap.exists) {
      return res.status(404).json({ error: "해당 신고를 찾을 수 없습니다." });
    }

    const reportData = reportSnap.data();
    const { messageId } = reportData;

    const messageRef = db.collection("chatMessages").doc(messageId);
    const messageSnap = await messageRef.get();

    if (!messageSnap.exists) {
      return res
        .status(404)
        .json({ error: "신고 대상 메시지를 찾을 수 없습니다." });
    }

    const messageData = messageSnap.data();
    const senderUid = messageData?.sender?.uid;

    if (!senderUid) {
      return res.status(400).json({ error: "메시지 작성자 UID가 없습니다." });
    }

    // 트랜잭션 처리
    await db.runTransaction(async (transaction) => {
      const userRef = db.collection("users_private").doc(senderUid);
      const userSnap = await transaction.get(userRef);
      const currentCount = userSnap.data()?.reportedCount || 0;

      // 신고 문서 삭제
      transaction.delete(reportRef);

      // 0 이하로 내려가지 않도록 방어
      if (currentCount > 0) {
        transaction.update(userRef, {
          reportedCount: admin.firestore.FieldValue.increment(-1),
        });
      }

      // 감사 로그
      const adminId = decoded.uid || decoded.email || "unknown";
      transaction.set(db.collection("adminLogs").doc(), {
        action: "dismissChatReport",
        adminId,
        reportId,
        senderId: senderUid,
        reportData,
        timestamp: new Date(),
      });
    });

    return res
      .status(200)
      .json({ message: "신고가 성공적으로 무시 처리되었습니다." });
  } catch (err) {
    console.error("신고 무시 실패:", err);
    return res.status(500).json({
      error: "서버 오류로 인해 무시 처리에 실패했습니다.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}
