import { db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

/**
 * 특정 추천 여행지 문서의 상세 정보를 가져옵니다.
 *
 * @param {string} id - 추천 여행지 문서 ID
 * @returns {Promise<Object|null>} - 상세 정보 또는 null
 */

export async function getRecommendationDetail(id) {
  const ref = doc(db, "recommended_places", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}
