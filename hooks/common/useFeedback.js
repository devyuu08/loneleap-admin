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
