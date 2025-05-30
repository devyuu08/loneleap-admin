import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ReviewReportTable from "@/components/reports/tables/ReviewReportTable";
import ReviewReportDetail from "@/components/reports/details/ReviewReportDetail";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import NoReportSelected from "@/components/common/NoReportSelected";

export default function AdminReviewReportsContainer() {
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!authReady || !authUser) return;

    const fetchInitialReports = async () => {
      try {
        setError(null);
        setLoading(true);
        await fetchReports();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialReports();
  }, [authReady, authUser]);

  const fetchReports = async (isLoadMore = false) => {
    if (!authUser) return;
    const token = await authUser.getIdToken();

    const query = new URLSearchParams();
    query.append("limit", 50);
    if (isLoadMore && lastDoc) query.append("lastDoc", lastDoc);

    const res = await fetch(`/api/admin/report/review/get?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "데이터를 불러오는데 실패했습니다");
    }

    const data = await res.json();
    if (data.length < 50) setHasMore(false);
    if (data.length > 0) setLastDoc(data[data.length - 1].id);

    if (isLoadMore) {
      setReports((prev) => [...prev, ...data]);
    } else {
      setReports(data);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      await fetchReports(true);
    } catch (err) {
      console.error("더 불러오기 실패:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleReportSuccess = (deletedReport) => {
    setReports((prev) => prev.filter((r) => r.id !== deletedReport.id));
    setSelectedReport(null);
  };

  if (loading || !authReady) {
    return <LoadingSpinner text="신고된 리뷰를 불러오는 중..." />;
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">리뷰 신고 목록</h2>
        <p className="text-gray-600 text-sm mt-1">
          총 <strong>{reports.length}</strong>개의 신고가 접수되었습니다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <>
            <ReviewReportTable
              reports={reports}
              onSelect={setSelectedReport}
              selectedReportId={selectedReport?.id}
            />
            {hasMore && reports.length > 0 && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleLoadMore}
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

      {selectedReport ? (
        <div className="bg-white p-6 rounded-xl shadow min-h-[300px]">
          <ReviewReportDetail
            report={selectedReport}
            onSuccess={handleReportSuccess}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center bg-white p-6 rounded-xl shadow min-h-[300px] text-gray-500 text-sm border border-dashed border-gray-300">
          <NoReportSelected />
        </div>
      )}
    </>
  );
}
