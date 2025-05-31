import { getAdminReports } from "@/services/adminReports";
import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/auth/useAdminAuth";

export function useAdminReports({ endpoint, queryKey = "lastDoc" }) {
  const { authReady, authUser, getToken } = useAdminAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDocId, setLastDocId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authReady && authUser) {
      fetchReports();
    }
  }, [authReady, authUser]);

  const fetchReports = async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const query = isLoadMore && lastDocId ? { [queryKey]: lastDocId } : {};
      const data = await getAdminReports({ endpoint, token, query });

      if (data.length < 50) setHasMore(false);
      if (data.length > 0) setLastDocId(data[data.length - 1].id);

      setReports((prev) => (isLoadMore ? [...prev, ...data] : data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    loading,
    hasMore,
    selectedReport,
    setSelectedReport,
    fetchReports,
  };
}
