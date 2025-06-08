import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/**
 * Firestore에서 추천 여행지 문서를 삭제합니다.
 *
 * @param {string} id - 삭제할 문서의 ID
 * @returns {Promise<void>}
 */

export async function deleteRecommendationFromFirestore(id) {
  const ref = doc(db, "recommended_places", id);
  await deleteDoc(ref);
}
