import { getAuth } from "firebase-admin/auth";

/**
 * 요청 헤더의 Firebase ID 토큰을 검증하고, 관리자인 경우 디코딩된 토큰을 반환합니다.
 *
 * @param {import("next").NextApiRequest} req - Next.js API 요청 객체
 * @returns {Promise<import("firebase-admin").auth.DecodedIdToken|null>} - 유효한 관리자 토큰 또는 null
 */

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
