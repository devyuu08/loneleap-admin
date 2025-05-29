export default function InlineSpinner({ color = "white" }) {
  const sizeClass = "w-4 h-4"; // 버튼에 맞게 고정
  const colorClass = {
    gray: "border-gray-500",
    white: "border-white",
    red: "border-red-500",
  }[color];

  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-t-transparent ${sizeClass} ${colorClass}`}
      role="status"
      aria-label="로딩 중"
    />
  );
}
