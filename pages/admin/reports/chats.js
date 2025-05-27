import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ChatReportTable from "@/components/reports/tables/ChatReportTable";
import ChatReportDetail from "@/components/reports/details/ChatReportDetail";
import NoReportSelected from "@/components/reports/ui/NoReportSelected";

export default function AdminChatReportsPage() {
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocId, setLastDocId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState(null);

  // 인증 준비
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // 인증 후 데이터 가져오기
  useEffect(() => {
    if (!authReady || !authUser) return;

    const fetchInitialReports = async () => {
      try {
        setLoading(true);
        await fetchReports();
      } catch (err) {
        console.error("신고 채팅 불러오기 실패:", err);
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialReports();
  }, [authReady, authUser]);

  // 신고 목록 가져오기
  const fetchReports = async (isLoadMore = false) => {
    if (!authUser) return;

    const token = await authUser.getIdToken();
    const query = new URLSearchParams();
    query.append("limit", 50);
    if (isLoadMore && lastDocId) {
      query.append("lastDocId", lastDocId);
    }

    const res = await fetch(`/api/admin/report/chat/get?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("데이터 불러오기 실패");

    const data = await res.json();
    if (data.length < 50) setHasMore(false);
    if (data.length > 0) setLastDocId(data[data.length - 1].id);

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

  if (!authReady || loading) {
    return <LoadingSpinner text="신고된 채팅 메시지를 불러오는 중..." />;
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">채팅 신고 목록</h2>
        <p className="text-gray-600 text-sm mt-1">
          총 <strong>{reports.length}</strong>개의 신고가 접수되었습니다.
        </p>
      </div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      {/* 신고 목록 */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        {reports.length === 0 ? (
          <div className="text-center text-gray-500">
            신고된 채팅이 없습니다.
          </div>
        ) : (
          <>
            <ChatReportTable
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

      {/* 상세 정보 */}
      {selectedReport ? (
        <div className="bg-white p-6 rounded-xl shadow min-h-[300px]">
          <ChatReportDetail
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
