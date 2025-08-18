import { useCallback } from "react";
import { useUploadImage } from "@/hooks/useUploadImage";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { addRecommendationToFirestore } from "@/services/addRecommendation";
import { useFeedback } from "@/hooks/common/useFeedback";

/**
 * 추천 여행지 등록 훅
 * - 이미지 업로드 후 Firestore에 추천 여행지 데이터 저장
 * - 성공 시 알림 후 추천 목록 페이지로 이동
 */

export function useAddRecommendation() {
  const { uploadImage } = useUploadImage();
  const router = useRouter();
  const { success, error } = useFeedback();

  const handleSubmit = useCallback(
    async (formData) => {
      const { imageFile } = formData;
      const imageUrl = await uploadImage(imageFile, "recommendations");
      if (!imageUrl) throw new Error("이미지 업로드 실패");
      return await addRecommendationToFirestore(formData, imageUrl);
    },
    [uploadImage]
  );

  const { mutate: addRecommendation, isLoading } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => {
      success("추천 여행지가 등록되었습니다.");
      router.push("/admin/recommendation");
    },
    onError: (err) => {
      error(err, "등록 중 오류가 발생했습니다.");
    },
  });

  return { addRecommendation, isLoading };
}
