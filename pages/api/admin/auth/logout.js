import { clearAuthCookie } from "@/lib/server/cookies";

export default function logouthandler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("허용되지 않은 메서드입니다.");
  }

  clearAuthCookie({ res });
  return res.status(200).json({ success: true });
}
