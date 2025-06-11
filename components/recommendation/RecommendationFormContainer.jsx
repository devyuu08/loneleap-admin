import { useCallback, useEffect, useState } from "react";
import RecommendationForm from "@/components/recommendation/RecommendationForm";
import { useFeedback } from "@/hooks/common/useFeedback";

/**
 * RecommendationFormContainer
 * - 추천 여행지 생성/수정 폼의 상태를 관리하는 컨테이너 컴포넌트
 * - 초기 값이 있을 경우 수정 폼으로, 없으면 신규 생성 폼으로 동작
 * - 내부 상태: form 객체 (입력 필드 상태), image preview 관리
 * - 제출 시 directions/nearbyInfo를 줄 단위 배열로 변환 후 상위 콜백 호출
 */

export default function RecommendationFormContainer({
  onSubmit,
  loading,
  initialValues,
}) {
  const [form, setForm] = useState({
    name: "",
    summary: "",
    location: "",
    description: "",
    imageFile: null,
    imagePreview: null,
    visible: true,
    locationInfo: "",
    direction: "",
    nearby: "",
  });

  const [isInitialized, setIsInitialized] = useState(false);
  const { error } = useFeedback();

  // 초기값이 있을 경우 수정 폼으로 세팅
  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        summary: initialValues.summary || "",
        location: initialValues.location || "",
        description: initialValues.description || "",
        imageFile: null,
        imagePreview: initialValues.imageUrl || null,
        visible: initialValues.visible ?? true,
        locationInfo: initialValues.locationInfo || "",
        direction: (initialValues.directions || []).join("\n"),
        nearby: (initialValues.nearbyInfo || []).join("\n"),
      });
      setIsInitialized(true);
    } else {
      setIsInitialized(true); // 값이 없더라도 초기화는 완료됨
    }
  }, [initialValues]);

  // Blob 이미지 주소 해제 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (form.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(form.imagePreview);
      }
    };
  }, [form.imagePreview]);

  const handleChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleImageChange = useCallback((file) => {
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { name, location, description, imageFile, imagePreview } = form;

      if (!name || !location || !description || (!imageFile && !imagePreview)) {
        return error("필수 항목을 모두 입력하세요.");
      }

      // 줄바꿈 기준 배열 변환 후 상위 onSubmit 호출
      await onSubmit({
        ...form,
        directions: form.direction.split("\n").filter((l) => l.trim()),
        nearbyInfo: form.nearby.split("\n").filter((l) => l.trim()),
      });
    },
    [form, onSubmit, error]
  );

  if (!isInitialized) return null;

  return (
    <RecommendationForm
      form={form}
      onChange={handleChange}
      onImageChange={handleImageChange}
      onSubmit={handleSubmit}
      loading={loading}
      isEdit={!!initialValues}
    />
  );
}
