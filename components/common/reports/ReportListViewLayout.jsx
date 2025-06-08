export default function ReportListViewLayout({
  title,
  totalCount,
  error,
  isEmpty,
  table,
  onLoadMore,
  hasMore,
  loadingMore,
  detail,
  noSelection,
}) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-gray-600 text-sm mt-1">
          총 <strong>{totalCount}</strong>개의 신고가 접수되었습니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : isEmpty ? (
          <div className="text-center text-gray-500">
            신고된 항목이 없습니다.
          </div>
        ) : (
          <>
            {table}
            {hasMore && (
              <div className="mt-4 text-center">
                <button
                  onClick={onLoadMore}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                  disabled={loadingMore}
                >
                  {loadingMore ? "불러오는 중..." : "더 보기"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow min-h-[300px]">
        {detail ?? (
          <div className="flex items-center justify-center bg-white p-6 rounded-xl shadow min-h-[300px] text-gray-500 text-sm border border-dashed border-gray-300">
            {noSelection}
          </div>
        )}
      </div>
    </>
  );
}
