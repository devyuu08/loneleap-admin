import ErrorMessage from "@/components/common/ErrorMessage";
import PropTypes from "prop-types";

export default function FormTextarea({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = "",
  error,
  rows = 3,
}) {
  const baseStyle =
    "w-full px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2";
  const borderColor = error ? "border-red-400" : "border-gray-300";
  const visualStyle =
    "bg-white/70 text-gray-800 placeholder:text-gray-400 focus:ring-gray-700";

  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-bold text-gray-700"
        >
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
        className={`${baseStyle} ${borderColor} ${visualStyle}`}
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
