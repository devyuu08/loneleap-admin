// loneleap-admin/components/common/LoadingSpinner.jsx
import PropTypes from "prop-types";

export default function LoadingSpinner({
  text = "불러오는 중...",
  size = "md",
}) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className="flex flex-col items-center justify-center py-8"
      role="status"
      aria-live="polite"
    >
      <div
        className={`${
          sizeClasses[size] || sizeClasses.md
        } rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin mb-2`}
      />
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}

LoadingSpinner.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};
