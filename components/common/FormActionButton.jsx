import PropTypes from "prop-types";
import clsx from "clsx";
import ButtonSpinner from "@/components/common/ButtonSpinner";
import { btnBaseBox, btnSpinnerBox } from "@/styles/buttonStyles";

export default function FormActionButton({
  type = "button",
  onClick,
  label,
  icon: Icon,
  disabled = false,
  isLoading = false,
  variant = "default",
  fullWidth = false,
}) {
  const variants = {
    default: "bg-black/80 text-white hover:bg-black hover:shadow-xl",
    danger: "bg-red-600 text-white hover:bg-red-700",
    light: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  };

  const spinnerColor = variant === "light" ? "gray" : "white";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={clsx(
        fullWidth ? "w-full" : "w-auto",
        btnBaseBox,
        variants[variant],
        (disabled || isLoading) && "opacity-50 cursor-not-allowed"
      )}
    >
      <div className={btnSpinnerBox}>
        {isLoading ? (
          <ButtonSpinner size={16} color={spinnerColor} />
        ) : (
          <>
            {Icon && <Icon className="w-4 h-4" />}
            <span>{label}</span>
          </>
        )}
      </div>
    </button>
  );
}

FormActionButton.propTypes = {
  type: PropTypes.oneOf(["button", "submit"]),
  onClick: PropTypes.func,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "danger", "light"]),
  fullWidth: PropTypes.bool,
};
