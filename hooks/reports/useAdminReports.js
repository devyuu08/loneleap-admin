import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function useAdminReports({ endpoint, queryKey = "lastDoc" }) {
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocId, setLastDocId] = useState(null);
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
    fetchInitialReports();
  }, [authReady, authUser]);

  const fetchInitialReports = async () => {
    try {
      setError(null);
      setLoading(true);
      await fetchReports();
    } catch (err) {
      setError(err.message || "데이터 로딩 실패");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async (isLoadMore = false) => {
    if (!authUser) return;
    const token = await authUser.getIdToken();
    const query = new URLSearchParams();
    query.append("limit", 50);
    if (isLoadMore && lastDocId) query.append(queryKey, lastDocId);

    const res = await fetch(`${endpoint}?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다");

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

  return {
    authReady,
    loading,
    reports,
    hasMore,
    loadingMore,
    selectedReport,
    error,
    setSelectedReport,
    handleLoadMore,
    handleReportSuccess,
  };
}
