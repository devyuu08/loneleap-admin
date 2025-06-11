import { destroyCookie } from "nookies";

/**
 * 관리자 인증 쿠키를 삭제합니다. 로그아웃 시 사용됩니다.
 *
 * @param {import("next").NextApiContext | null} ctx - Next.js API 또는 페이지 컨텍스트 (서버/클라이언트 구분용)
 */

export function clearAuthCookie(ctx = null) {
  destroyCookie(ctx, "admin-auth-token", {
    path: "/",
  });
}
