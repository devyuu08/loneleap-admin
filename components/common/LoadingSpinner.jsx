import PropTypes from "prop-types";

export default function LoadingSpinner({
  text = "불러오는 중...",
  size = "md",
  showText = true,
  fullscreen = false,
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClass = fullscreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm"
    : "flex flex-col items-center justify-center py-8";

  return (
    <div className={containerClass} role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin mb-2`}
      />
      {showText && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
}

LoadingSpinner.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  showText: PropTypes.bool,
  fullscreen: PropTypes.bool,
};
