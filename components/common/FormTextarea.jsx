import React from "react";
import ErrorMessage from "@/components/common/ErrorMessage";
import PropTypes from "prop-types";
import {
  inputBaseBox,
  inputVisualStyle,
  inputErrorBorder,
  inputNormalBorder,
  formLabelStyle,
} from "@/styles/inputStyles";

function FormTextarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = "",
  error,
  rows = 3,
}) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={formLabelStyle}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`${inputBaseBox} ${
          error ? inputErrorBorder : inputNormalBorder
        } ${inputVisualStyle}`}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

FormTextarea.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  rows: PropTypes.number,
};

export default React.memo(FormTextarea);
