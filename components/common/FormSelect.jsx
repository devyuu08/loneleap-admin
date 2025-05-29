import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";

export default function FormSelect({
  label,
  id,
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-bold text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-md bg-white text-sm appearance-none"
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* 사용자 정의 화살표 아이콘 */}
      <ChevronDown className="pointer-events-none absolute right-3 top-[40px] w-4 h-4 text-gray-400" />
    </div>
  );
}

FormSelect.propTypes = {
  label: PropTypes.string,
  id: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};
