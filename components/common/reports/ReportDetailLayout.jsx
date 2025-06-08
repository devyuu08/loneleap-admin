export default function ReportDetailLayout({ left, right, children }) {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {left}
        {right}
      </div>
      <div className="pt-6 mt-6 border-t">{children}</div>
    </div>
  );
}
