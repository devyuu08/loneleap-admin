import { adminAuth } from "@/lib/firebaseAdmin";
import { clearAuthCookie } from "@/lib/cookies";
import { parseCookies } from "nookies";

export default async function checkAdminAuth(req, res) {
  try {
    const cookies = parseCookies({ req });
    const token = cookies["admin-auth-token"];

    if (!token) {
      throw new Error("No token");
    }

    const decoded = await adminAuth.verifyIdToken(token);

    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",").map((email) =>
          email.trim().toLowerCase()
        )
      : [];

    if (!adminEmails.includes(decoded.email.toLowerCase())) {
      throw new Error("Unauthorized admin");
    }

    return res.status(200).json({ admin: true, uid: decoded.uid });
  } catch (error) {
    console.error("[auth] 인증 실패:", error.message);

    clearAuthCookie({ res });
    return res.status(401).json({ error: "Unauthorized" });
  }
}
