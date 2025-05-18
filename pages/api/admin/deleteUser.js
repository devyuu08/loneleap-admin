import deleteUserData from "@/lib/server/deleteUserData";

export default async function deleteUserHandler(req, res) {
  console.log("/api/admin/deleteUser 호출됨");
  if (req.method !== "POST") return res.status(405).end();

  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: "UID 누락" });

  try {
    await deleteUserData(req, res);
  } catch (error) {
    console.error("유저 삭제 실패:", error);
    return res.status(500).json({ error: "서버 오류" });
  }
}
