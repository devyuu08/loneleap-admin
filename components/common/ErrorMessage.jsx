import { AlertCircle } from "lucide-react";

export default function ErrorMessage({
  message,
  className = "",
  align = "left", // "left" or "center"
  id,
}) {
  if (!message) return null;

  const alignmentClass =
    align === "center" ? "justify-center text-center mt-3" : "mt-1";

  return (
    <div
      role="alert"
      id={id}
      className={`flex items-start gap-1 text-sm text-red-500 ${alignmentClass} ${className}`}
    >
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
