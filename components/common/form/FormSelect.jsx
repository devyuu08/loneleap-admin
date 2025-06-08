import React from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/shared/utils";
import {
  inputBaseBox,
  inputNormalBorder,
  formLabelStyle,
} from "@/styles/inputStyles";

function FormSelect({ label, id, value, onChange, options = [] }) {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className={formLabelStyle}>
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`${inputBaseBox} pr-10 appearance-none ${inputNormalBorder} bg-white text-gray-800`}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {/* 사용자 정의 화살표 아이콘 */}
      <ChevronDown
        className={cn(
          "pointer-events-none absolute right-3 w-4 h-4 text-gray-400",
          label ? "top-[42px]" : "top-1/2 -translate-y-1/2"
        )}
      />
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

export default React.memo(FormSelect);
