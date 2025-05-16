import { adminAuth } from "@/lib/firebaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "UID 누락" });

  try {
    await adminAuth.deleteUser(uid);
    return res.status(200).json({ message: "계정이 삭제되었습니다." });
  } catch (error) {
    console.error("계정 삭제 실패:", error);
    return res.status(500).json({ error: "Firebase 인증 삭제 실패" });
  }
}
