import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

/**
 * Firestore에 추천 여행지 데이터를 추가합니다.
 *
 * @param {Object} formData - 추천 여행지 폼 데이터
 * @param {string} imageUrl - 업로드된 이미지 URL
 * @returns {Promise<string>} - 생성된 문서의 ID
 */

export async function addRecommendationToFirestore(formData, imageUrl) {
  const {
    name,
    summary,
    location,
    description,
    visible,
    locationInfo,
    directions,
    nearbyInfo,
  } = formData;

  const docRef = await addDoc(collection(db, "recommended_places"), {
    name,
    summary,
    location,
    description,
    imageUrl,
    visible,
    locationInfo,
    directions: directions ?? [],
    nearbyInfo: nearbyInfo ?? [],
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}
