import { verifyAdminToken } from "@/lib/auth";
import { db } from "@/lib/firebaseAdmin";

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

  // 필수 파라미터 검증
  if (!reportId || typeof reportId !== "string") {
    return res.status(400).json({ error: "유효하지 않은 신고 ID입니다." });
  }

  try {
    const docRef = db.collection("chatReports").doc(reportId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "해당 신고를 찾을 수 없습니다." });
    }

    const adminId = decoded.uid || decoded.email || "unknown";

    // 감사 로그 기록
    await db.collection("adminLogs").add({
      action: "dismissChatReport",
      adminId,
      reportId,
      reportData: docSnap.data(), // 삭제 전 데이터 저장
      timestamp: new Date(),
    });

    // 문서 삭제
    await docRef.delete();

    return res
      .status(200)
      .json({ message: "신고가 성공적으로 삭제되었습니다." });
  } catch (err) {
    console.error("신고 삭제 실패:", err);
    return res.status(500).json({
      error: "서버 오류로 인해 삭제에 실패했습니다.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
}
