import { useState, useEffect } from "react";

export default function SessionTimer() {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const sessionStart = localStorage.getItem("sessionStart");

    if (sessionStart) {
      const sessionStartTime = new Date(sessionStart).getTime();
      const sessionDuration = 60 * 60 * 1000; // 1시간 = 3600초 = 3600,000ms
      const sessionEndTime = sessionStartTime + sessionDuration;

      const updateRemainingTime = () => {
        const now = Date.now();
        const diff = Math.floor((sessionEndTime - now) / 1000);
        setRemainingTime(diff > 0 ? diff : 0);
      };

      updateRemainingTime(); // mount되자마자 한번 실행
      const interval = setInterval(updateRemainingTime, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="text-sm text-gray-500">
      세션 남은 시간: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}
