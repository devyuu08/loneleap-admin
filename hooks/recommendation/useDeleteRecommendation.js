import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useState } from "react";

export function useDeleteRecommendation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteRecommendation = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, "recommended_places", id));
    } catch (err) {
      console.error("삭제 실패:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { deleteRecommendation, loading, error };
}
