/**
 * 공통 피드백 메시지 훅
 * - 사용자에게 알림(alert)을 통해 성공 또는 오류 메시지를 표시하는 유틸리티 훅
 * - 에러 로그는 콘솔에 출력하고, 사용자에겐 fallback 메시지 또는 에러 메시지를 보여줌
 *
 * 사용 예:
 * const { success, error } = useFeedback();
 * success("작업이 완료되었습니다.");
 * error(err, "저장 중 오류가 발생했습니다.");
 */

export function useFeedback() {
  const success = (message) => {
    alert(message);
  };

  const error = (err, fallbackMessage = "오류가 발생했습니다.") => {
    console.error(err);
    alert(err?.message || fallbackMessage);
  };

  return { success, error };
}
