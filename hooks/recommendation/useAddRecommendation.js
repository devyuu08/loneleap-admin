import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useUploadImage } from "@/hooks/useUploadImage";
import { useRouter } from "next/router";

export function useAddRecommendation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { uploadImage } = useUploadImage();
  const router = useRouter();

  const addRecommendation = async (formData) => {
    console.log("🔥 addRecommendation 실행됨");
    const {
      name,
      summary,
      location,
      description,
      imageFile,
      visible,
      locationInfo,
      directions,
      nearbyInfo,
    } = formData;

    setLoading(true);
    setError(null);

    try {
      // 1. 이미지 업로드
      const imageUrl = await uploadImage(imageFile, "recommendations");
      if (!imageUrl) throw new Error("이미지 업로드 실패");

      // 2. Firestore 저장
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

      console.log("등록 완료:", docRef.id);

      // 3. 성공 후 이동
      router.push("/admin/recommendation"); // 목록 페이지
    } catch (err) {
      console.error("추천 여행지 등록 실패:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { addRecommendation, loading, error };
}
