// loneleap-admin/components/common/EmptyState.jsx

export default function EmptyState({ message = "데이터가 없습니다." }) {
  return (
    <div className="text-center py-12 text-gray-400 text-sm">
      <p>{message}</p>
    </div>
  );
}
