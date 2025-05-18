import { useState, useEffect } from "react";

export default function SessionTimer() {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const SESSION_START_KEY = "sessionStart";
    const sessionStart = localStorage.getItem(SESSION_START_KEY);

    if (!sessionStart) return;

    const sessionStartTime = new Date(sessionStart).getTime();
    const sessionDuration = 60 * 60 * 1000; // 1시간
    const sessionEndTime = sessionStartTime + sessionDuration;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((sessionEndTime - now) / 1000);
      const clamped = Math.max(diff, 0);
      setRemainingTime(clamped);

      if (clamped === 0) {
        clearInterval(interval);
        localStorage.removeItem(SESSION_START_KEY);
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");
        window.location.href = "/admin/login";
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="text-sm text-gray-500">
      세션 남은 시간: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}
