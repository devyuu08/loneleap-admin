import { adminAuth, db } from "@/lib/firebase/admin";
import deleteUserData from "@/lib/server/deleteUserData";

export default async function handler(req, res) {
  const { uid } = req.query;

  if (!uid) return res.status(400).json({ error: "UID 누락" });

  try {
    if (req.method === "PATCH") {
      const { status } = req.body;

      if (!["active", "banned"].includes(status)) {
        return res.status(400).json({ error: "잘못된 상태 값" });
      }

      // Firestore 업데이트
      await db.collection("users_private").doc(uid).update({ status });

      // Firebase Auth 상태 반영
      await adminAuth.updateUser(uid, {
        disabled: status === "banned",
      });

      return res.status(200).json({
        message: `계정이 ${status === "banned" ? "정지" : "복구"}되었습니다.`,
      });
    }

    if (req.method === "DELETE") {
      try {
        await deleteUserData(uid);
        return res
          .status(200)
          .json({ message: "모든 데이터 및 계정 삭제 완료" });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }

    return res.status(405).end(); // 허용되지 않은 메서드
  } catch (error) {
    const errorMessage = "계정 처리 실패";

    if (process.env.NODE_ENV === "development") {
      console.error(`${errorMessage}:`, error);
    } else {
      console.error(errorMessage);
    }
    return res.status(500).json({ error: "서버 오류" });
  }
}
