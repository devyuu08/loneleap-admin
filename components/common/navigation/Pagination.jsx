export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center gap-2 mt-6">
      {pages.map((page) => (
        <button
          key={page}
          aria-current={page === currentPage ? "page" : undefined}
          aria-label={`페이지 ${page}`}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 rounded-md text-sm border transition ${
            page === currentPage
              ? "bg-black text-white"
              : "bg-white text-gray-600 hover:bg-gray-100 transition-colors duration-150"
          }`}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}
    </div>
  );
}
