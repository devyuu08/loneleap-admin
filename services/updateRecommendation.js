import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/**
 * Firestore의 추천 여행지 문서를 업데이트합니다.
 *
 * @param {string} id - 수정할 문서의 ID
 * @param {Object} data - 수정할 데이터
 * @returns {Promise<void>}
 */

export async function updateRecommendationInFirestore(id, data) {
  const ref = doc(db, "recommended_places", id);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}
