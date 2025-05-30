import { adminAuth } from "@/lib/firebaseAdmin";

export default async function disablehandler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: "UID 누락" });
  }

  try {
    await adminAuth.updateUser(uid, { disabled: true });
    return res.status(200).json({ message: "계정이 정지되었습니다." });
  } catch (error) {
    console.error("계정 정지 실패:", error);
    return res.status(500).json({ error: "서버 오류" });
  }
}
