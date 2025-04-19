export default function InlineSpinner({ size = "sm", color = "gray" }) {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }[size];

  const colorClass = {
    gray: "border-gray-500",
    white: "border-white",
    red: "border-red-500",
  }[color];

  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-t-transparent ${sizeClass} ${colorClass}`}
    />
  );
}
