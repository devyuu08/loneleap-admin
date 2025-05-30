import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ChatReportView from "@/components/reports/chat/ChatReportView";

export default function AdminChatReportsContainer() {
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
    <ChatReportView
      reports={reports}
      selectedReport={selectedReport}
      onSelect={setSelectedReport}
      onLoadMore={handleLoadMore}
      hasMore={hasMore}
      loadingMore={loadingMore}
      error={error}
      onSuccess={handleReportSuccess}
    />
  );
}
