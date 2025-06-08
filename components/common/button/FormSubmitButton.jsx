import PropTypes from "prop-types";
import clsx from "clsx";
import ButtonSpinner from "@/components/common/loading/ButtonSpinner";
import { btnBaseBox, btnSpinnerBox } from "@/styles/buttonStyles";

export default function FormSubmitButton({
  isLoading,
  label = "제출",
  fullWidth = false,
  variant = "dark",
  type = "submit",
}) {
  const variants = {
    dark: isLoading
      ? "bg-gray-400 text-white cursor-not-allowed opacity-70"
      : "bg-black/80 text-white hover:bg-black hover:shadow-xl",
    light: isLoading
      ? "bg-gray-300 text-white cursor-not-allowed opacity-70"
      : "bg-[#6D8591] text-white hover:bg-[#4d5e66]",
  };

  const spinnerColor = variant === "light" ? "white" : "white";

  return (
    <button
      type={type}
      disabled={isLoading}
      aria-busy={isLoading}
      className={clsx(
        fullWidth ? "w-full" : "w-auto",
        btnBaseBox,
        variants[variant]
      )}
    >
      <div className={btnSpinnerBox}>
        {isLoading ? (
          <ButtonSpinner size={16} color={spinnerColor} />
        ) : (
          <span>{label}</span>
        )}
      </div>
    </button>
  );
}

FormSubmitButton.propTypes = {
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(["dark", "light"]),
  type: PropTypes.oneOf(["submit", "button"]),
};
