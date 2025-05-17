import { adminAuth } from "@/lib/firebaseAdmin";
import { clearAuthCookie } from "@/lib/cookies";
import { parseCookies } from "nookies";

export default async function checkAdminAuth(req, res) {
  try {
    const cookies = parseCookies({ req });
    const token = cookies["admin-auth-token"];

    if (!token) {
      console.warn("[auth] 토큰 없음");
      clearAuthCookie({ res });
      return res.status(401).json({ error: "unauthenticated" });
    }

    const decoded = await adminAuth.verifyIdToken(token);

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",").map((email) =>
          email.trim().toLowerCase()
        )
      : [];

    if (!adminEmails.includes(decoded.email.toLowerCase())) {
      console.warn("[auth] 관리자 이메일 아님:", decoded.email);
      clearAuthCookie({ res });
      return res.status(401).json({ error: "unauthorized" });
    }

    return res.status(200).json({ admin: true, uid: decoded.uid });
  } catch (error) {
    console.error("[auth] 인증 실패:", error.message);

    clearAuthCookie({ res });
    return res.status(401).json({ error: "session-expired" });
  }
}
