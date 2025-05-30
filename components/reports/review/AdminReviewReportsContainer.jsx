import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import ReviewReportView from "@/components/reports/review/ReviewReportView";

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
    <ReviewReportView
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
