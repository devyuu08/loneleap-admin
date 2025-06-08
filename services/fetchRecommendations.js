import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/**
 * Firestore에서 추천 여행지 목록을 최신순으로 불러옵니다.
 *
 * @returns {Promise<Object[]>} - 추천 여행지 문서 배열
 */

export async function fetchRecommendationsFromFirestore() {
  const q = query(
    collection(db, "recommended_places"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
