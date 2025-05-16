import { adminAuth } from "@/lib/firebaseAdmin";

export default async function enableUserHandler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { uid } = req.body;
  if (!uid) {
    return res.status(400).json({ error: "UID 누락" });
  }

  try {
    await adminAuth.updateUser(uid, { disabled: false });
    return res.status(200).json({ message: "계정이 복구되었습니다." });
  } catch (error) {
    console.error("계정 복구 실패:", error);
    return res.status(500).json({ error: "서버 오류" });
  }
}
