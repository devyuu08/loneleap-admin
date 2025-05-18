import { destroyCookie } from "nookies";

export function clearAuthCookie(ctx = null) {
  destroyCookie(ctx, "admin-auth-token", {
    path: "/",
  });
}
