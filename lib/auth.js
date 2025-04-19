import { getAuth } from "firebase-admin/auth";

export async function verifyAdminToken(req) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      console.log("[auth] 토큰 없음");
      return null;
    }

    const decoded = await getAuth().verifyIdToken(token);

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",").map((email) =>
          email.trim().toLowerCase()
        )
      : [];

    if (!adminEmails.includes(decoded.email.toLowerCase())) {
      console.log("[auth] 관리자 아님:", decoded.email);
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("[auth] verifyIdToken 실패:", error.code, error.message);
    return null; // 어떤 오류든 일단 null로 처리 (500 방지)
  }
}
