export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-6">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md text-sm border transition ${
            page === currentPage
              ? "bg-black text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
