import { getAuth } from "firebase-admin/auth";

export async function verifyAdminToken(req, res) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    console.log("[auth] 토큰 없음");
    throw new Error("토큰이 없습니다.");
  }

  try {
    const decoded = await getAuth().verifyIdToken(token);

    // 관리자 이메일 리스트 체크
    const adminEmails = process.env.ADMIN_EMAILS
      ? process.env.ADMIN_EMAILS.split(",")
      : [];
    if (!adminEmails.includes(decoded.email)) {
      console.log("[auth] 관리자 아님:", decoded.email);
      throw new Error("관리자 권한이 없습니다.");
    }

    return decoded;
  } catch (error) {
    console.error("[auth] verifyIdToken 실패:", error.code, error.message);
    if (error.code === "auth/id-token-expired") {
      throw new Error("토큰이 만료되었습니다. 다시 로그인해 주세요.");
    } else if (error.code === "auth/id-token-revoked") {
      throw new Error("토큰이 취소되었습니다. 다시 로그인해 주세요.");
    } else if (error.message === "관리자 권한이 없습니다.") {
      throw error; // 이미 구체적인 오류 메시지가 있으므로 그대로 전달
    } else {
      throw new Error(
        "토큰 검증에 실패했습니다: " + (error.code || "알 수 없는 오류")
      );
    }
  }
}
