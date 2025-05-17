import { clearAuthCookie } from "@/lib/cookies";

export default function logouthandler(req, res) {
  clearAuthCookie({ res });
  res.status(200).json({ success: true });
}
