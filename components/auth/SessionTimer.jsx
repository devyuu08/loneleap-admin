import { useState, useEffect } from "react";
import toast from "react-hot-toast";

/**
 * SessionTimer
 * - 관리자 세션 남은 시간을 실시간으로 표시하는 컴포넌트
 * - 세션은 로그인 시점 기준으로 1시간 유지
 * - 시간이 만료되면 localStorage 초기화 및 로그인 페이지로 강제 이동
 */

export default function SessionTimer() {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const SESSION_START_KEY = "sessionStart";
    const sessionStart = localStorage.getItem(SESSION_START_KEY);

    if (!sessionStart) return; // 세션 시작 정보 없음 → 타이머 동작 X

    const sessionStartTime = new Date(sessionStart).getTime();
    const sessionDuration = 60 * 60 * 1000; // 1시간
    const sessionEndTime = sessionStartTime + sessionDuration;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((sessionEndTime - now) / 1000);
      const clamped = Math.max(diff, 0); // 음수 방지
      setRemainingTime(clamped);

      // 세션 만료 시 처리
      if (clamped === 0) {
        clearInterval(interval);
        localStorage.removeItem(SESSION_START_KEY);

        toast.error("세션이 만료되었습니다. 다시 로그인해 주세요.");

        // 토스트가 사용자에게 보일 수 있도록 약간의 대기 시간 후 이동
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 1500); // 1.5초 정도
      }
    }, 1000); // 1초마다 체크

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="text-sm text-gray-500">
      세션 남은 시간: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
}
