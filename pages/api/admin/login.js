import { setCookie } from "nookies";
import { adminAuth } from "@/lib/firebaseAdmin"; // Firebase Admin SDK 세팅

export default async function createAdminSession(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("허용되지 않은 메서드입니다.");
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "토큰이 제공되지 않았습니다." });
  }

  try {
    // 토큰 검증
    const decoded = await adminAuth.verifyIdToken(token);

    // HttpOnly 쿠키 저장
    setCookie({ res }, "admin-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1시간(3600초) 후 세션 만료
    });

    return res.status(200).json({ message: "로그인에 성공했습니다." });
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
}
