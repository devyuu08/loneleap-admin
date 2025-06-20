import { db } from "@/lib/firebase/admin";
import { verifyAdminToken } from "@/lib/server/auth";
import admin from "firebase-admin";

export default async function deleteMessageWithReports(req, res) {
  // 메서드 검사
  if (req.method !== "POST") {
    return res.status(405).json({ error: "허용되지 않은 요청 방식입니다." });
  }

  // 관리자 인증
  try {
    const adminUser = await verifyAdminToken(req);
    if (process.env.NODE_ENV === "development") {
      console.log(
        `관리자 ${adminUser.email || adminUser.uid}가 메시지 삭제 시도`
      );
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("관리자 인증 실패:", error);
    } else {
      console.error("관리자 인증 실패");
    }
    return res.status(401).json({ error: "관리자 권한이 필요합니다." });
  }

  const { roomId, messageId } = req.body;

  // 필수 파라미터 확인
  if (!roomId || !messageId) {
    return res.status(400).json({ error: "roomId 또는 messageId가 없습니다." });
  }

  try {
    // 관련된 신고 문서 찾기
    const reportsRef = db
      .collection("chatReports")
      .where("roomId", "==", roomId)
      .where("messageId", "==", messageId);

    const snapshot = await reportsRef.get();

    // 관련 신고가 없는 경우도 처리
    if (snapshot.empty) {
      if (process.env.NODE_ENV === "development") {
        console.log("관련 신고가 없는 메시지입니다. 메시지만 삭제합니다.");
      }
    }

    // 트랜잭션: 메시지 + 신고 일괄 삭제
    await db.runTransaction(async (transaction) => {
      const messageRef = db.collection("chatMessages").doc(messageId);
      const messageSnap = await transaction.get(messageRef);

      if (!messageSnap.exists) {
        throw Object.assign(new Error("삭제할 메시지가 존재하지 않습니다."), {
          code: "not-found",
        });
      }

      const senderUid = messageSnap.data()?.sender?.uid;
      if (!senderUid) {
        throw new Error("메시지 작성자 정보가 없습니다.");
      }

      const userRef = db.collection("users_private").doc(senderUid);
      const userSnap = await transaction.get(userRef); // get 먼저 수행
      const currentCount = userSnap.data()?.reportedCount || 0;

      transaction.delete(messageRef);

      snapshot.docs.forEach((doc) => {
        transaction.delete(doc.ref);
      });

      // 0 이하로 내려가지 않도록 조건 처리
      if (currentCount > 0) {
        transaction.update(userRef, {
          reportedCount: admin.firestore.FieldValue.increment(-1),
        });
      }
    });

    return res.status(200).json({ message: "메시지 및 관련 신고 삭제 완료" });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("채팅 메시지 삭제 오류:", err);
    } else {
      console.error("채팅 메시지 삭제 오류 발생");
    }

    if (err.code === "not-found") {
      return res
        .status(404)
        .json({ error: "삭제할 메시지 또는 신고가 없습니다." });
    } else if (err.code === "permission-denied") {
      return res.status(403).json({ error: "메시지 삭제 권한이 없습니다." });
    } else {
      return res.status(500).json({
        error: "서버 오류로 메시지 삭제 실패",
        details: err.message,
        code: err.code,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  }
}
