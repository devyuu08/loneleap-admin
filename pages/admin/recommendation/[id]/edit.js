import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecommendationDetail } from "@/hooks/useRecommendationDetail";
import { useUpdateRecommendation } from "@/hooks/useUpdateRecommendation";
import RecommendationForm from "@/components/recommendation/RecommendationForm";

export default function AdminRecommendationEditPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, notFound } = useRecommendationDetail(id);
  const { updateRecommendation } = useUpdateRecommendation();

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (data) {
      setInitialData({
        name: data.name || "",
        summary: data.summary || "",
        location: data.location || "",
        description: data.description || "",
        imageUrl: data.imageUrl || "",
        visible: data.visible ?? true,
        locationInfo: data.locationInfo || "",
        directions: data.directions || [],
        nearbyInfo: data.nearbyInfo || [],
      });
    }
  }, [data]);

  const handleUpdate = async (formData) => {
    try {
      // 이미지 변경 시 처리
      let imageUrl = initialData.imageUrl;
      if (formData.imageFile) {
        const { uploadImage } = await import("@/hooks/useUploadImage").then(
          (mod) => mod.useUploadImage()
        );
        imageUrl = await uploadImage(formData.imageFile, "recommendations");
      }

      await updateRecommendation(id, {
        ...formData,
        imageUrl,
      });

      alert("수정이 완료되었습니다.");
      router.push("/admin/recommendation");
    } catch (err) {
      console.error("추천 여행지 수정 실패:", err);
      alert("수정 중 오류 발생");
    }
  };

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;
  if (notFound)
    return (
      <div className="p-10 text-center text-gray-500">
        존재하지 않는 여행지입니다.
      </div>
    );

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">추천 여행지 수정</h1>
      {initialData && (
        <RecommendationForm
          initialValues={initialData}
          onSubmit={handleUpdate}
          loading={false}
        />
      )}
    </div>
  );
}
