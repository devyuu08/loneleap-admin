import { useEffect, useState } from "react";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import AdminLayout from "@/components/layout/AdminLayout";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ReviewReportTable from "@/components/reports/tables/ReviewReportTable";
import ReviewReportDetail from "@/components/reports/details/ReviewReportDetail";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NoReportSelected from "@/components/reports/ui/NoReportSelected";

export default function AdminReviewReportsPage() {
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState(null);

  // 인증 상태 체크
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user); // null or user
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 인증 완료 후 데이터 가져오기
  useEffect(() => {
    if (!authReady || !authUser) return;

    const fetchInitialReports = async () => {
      try {
        setError(null);
        setLoading(true);
        await fetchReports(); // 초기 불러오기
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

    const res = await fetch(`/api/reviewReports/getReviewReports?${query}`, {
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
    <AdminProtectedRoute>
      <AdminLayout title="리뷰 신고 관리">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">리뷰 신고 목록</h2>
          <p className="text-gray-600 text-sm mt-1">
            총 <strong>{reports.length}</strong>개의 신고가 접수되었습니다.
          </p>
        </div>

        <div className="flex gap-6">
          <div className="w-1/2 bg-white p-6 rounded-xl shadow">
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

          <div className="w-1/2 bg-white p-6 rounded-xl shadow min-h-[300px]">
            {selectedReport ? (
              <ReviewReportDetail
                report={selectedReport}
                onSuccess={handleReportSuccess}
              />
            ) : (
              <NoReportSelected />
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
