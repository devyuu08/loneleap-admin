export default function StatusBadge({ status }) {
  const variant = {
    active: "bg-green-100 text-green-800",
    banned: "bg-yellow-100 text-yellow-800",
    dormant: "bg-gray-100 text-gray-600",
  };

  const label = {
    active: "활성",
    banned: "정지",
    dormant: "휴면",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${variant[status]}`}>
      {label[status]}
    </span>
  );
}
