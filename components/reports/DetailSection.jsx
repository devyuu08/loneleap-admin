// components/reports/DetailSection.jsx

export default function DetailSection({ title, children }) {
  return (
    <section className="space-y-1">
      <h3 className="text-base font-medium text-gray-700">{title}</h3>
      <div className="text-sm text-gray-800">{children}</div>
    </section>
  );
}
