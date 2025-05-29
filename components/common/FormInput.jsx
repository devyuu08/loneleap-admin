import ErrorMessage from "@/components/common/ErrorMessage";

export default function FormInput({
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
  const inputBaseStyle =
    "w-full px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2";
  const borderColor = error ? "border-red-400" : "border-gray-300";
  const visualStyle =
    "bg-white/70 text-gray-800 placeholder:text-gray-400 focus:ring-gray-700";

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
        className={`${inputBaseStyle} ${borderColor} ${visualStyle} ${
          icon ? "pl-10" : ""
        }`}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
