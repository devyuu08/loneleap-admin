import { useRouter } from "next/router";
import { useRecommendationDetail } from "@/hooks/recommendation/useRecommendationDetail";
import { useDeleteRecommendation } from "@/hooks/recommendation/useDeleteRecommendation";
import RecommendationDetail from "@/components/recommendation/RecommendationDetail";

export default function RecommendationDetailContainer() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, notFound } = useRecommendationDetail(id);
  const { deleteRecommendation, loading: deleting } = useDeleteRecommendation();

  const handleDelete = async () => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    await deleteRecommendation(id);
    router.push("/admin/recommendation");
  };

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;
  if (notFound)
    return (
      <div className="p-10 text-center text-gray-500">
        존재하지 않는 여행지입니다.
      </div>
    );

  return (
    <RecommendationDetail
      id={id}
      name={data.name}
      summary={data.summary}
      location={data.location}
      description={data.description}
      locationInfo={data.locationInfo}
      directions={data.directions}
      nearbyInfo={data.nearbyInfo}
      imageUrl={data.imageUrl}
      visible={data.visible}
      createdAt={data.createdAt}
      updatedAt={data.updatedAt}
      onDelete={handleDelete}
      loading={deleting}
    />
  );
}
