"use client";

import { useUploadImage } from "@/hooks/useUploadImage";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { addRecommendationToFirestore } from "@/services/recommendationService";

export function useAddRecommendation() {
  const { uploadImage } = useUploadImage();
  const router = useRouter();

  const {
    mutate: addRecommendation,
    isLoading,
    error,
  } = useMutation({
    mutationFn: async (formData) => {
      const { imageFile } = formData;
      const imageUrl = await uploadImage(imageFile, "recommendations");
      if (!imageUrl) throw new Error("이미지 업로드 실패");

      return await addRecommendationToFirestore(formData, imageUrl);
    },
    onSuccess: () => {
      alert("추천 여행지가 등록되었습니다.");
      router.push("/admin/recommendation");
    },
    onError: (err) => {
      console.error("추천 여행지 등록 실패:", err);
      alert("등록 중 오류가 발생했습니다.");
    },
  });

  return { addRecommendation, isLoading, error };
}
