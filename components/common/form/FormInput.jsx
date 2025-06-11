import React from "react";
import ErrorMessage from "@/components/common/feedback/ErrorMessage";
import {
  inputBaseBox,
  inputVisualStyle,
  inputErrorBorder,
  inputNormalBorder,
  formLabelStyle,
} from "@/styles/inputStyles";

function FormInput({
  label,
  id,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error,
  icon,
}) {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className={formLabelStyle}>
          {label}
        </label>
      )}
      {icon && (
        <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBaseBox} ${
          error ? inputErrorBorder : inputNormalBorder
        } ${inputVisualStyle} ${icon ? "pl-10" : ""}`}
      />
      {error && <ErrorMessage id={`${id}-error`} message={error} />}
    </div>
  );
}

export default React.memo(FormInput);
