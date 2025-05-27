import { useRouter } from "next/router";
import { useRecommendationDetail } from "@/hooks/recommendation/useRecommendationDetail";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MapPin,
  Eye,
  EyeOff,
  ArrowLeft,
  Pencil,
  Trash2,
  BookText,
  Navigation,
  Landmark,
  CalendarDays,
} from "lucide-react";
import { useDeleteRecommendation } from "@/hooks/recommendation/useDeleteRecommendation";

export default function AdminRecommendationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, notFound } = useRecommendationDetail(id);
  const { deleteRecommendation, loading: deleting } = useDeleteRecommendation();

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;
  if (notFound)
    return (
      <div className="p-10 text-center text-gray-500">
        존재하지 않는 여행지입니다.
      </div>
    );

  const handleDelete = async () => {
    const confirm = window.confirm("정말 삭제하시겠습니까?");
    if (!confirm) return;
    await deleteRecommendation(id);
    router.push("/admin/recommendation");
  };

  const markdownComponents = {
    p: ({ children }) => (
      <p className="text-gray-800 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">
        {children}
      </blockquote>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4">{children}</ul>
    ),
    li: ({ children }) => <li className="mb-1">{children}</li>,
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-10 space-y-10">
      <div>
        <Link
          href="/admin/recommendation"
          className="inline-flex items-center text-sm text-gray-500 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          목록으로 돌아가기
        </Link>
      </div>

      {/* 기본 정보 */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="relative w-full h-[320px] rounded-lg overflow-hidden">
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-6 gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <p className="text-gray-500 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {data.location}
            </p>
            <p className="text-gray-700">{data.summary}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium text-xs ${
                data.visible
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {data.visible ? (
                <>
                  <Eye className="w-4 h-4" /> 공개
                </>
              ) : (
                <>
                  <EyeOff className="w-4 h-4" /> 비공개
                </>
              )}
            </span>
            <div className="text-xs text-gray-500 text-right space-y-1">
              <p className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3" />
                등록일:{" "}
                {data.createdAt?.toDate
                  ? format(data.createdAt.toDate(), "yyyy.MM.dd")
                  : "-"}
              </p>
              {data.updatedAt?.toDate && (
                <p className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  수정일: {format(data.updatedAt.toDate(), "yyyy.MM.dd")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 상세 설명 */}
      {data.description && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookText className="w-5 h-5" /> 상세 설명
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {data.description}
          </ReactMarkdown>
        </div>
      )}

      {/* 위치 설명 */}
      {data.locationInfo && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" /> 위치 설명
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {data.locationInfo}
          </ReactMarkdown>
        </div>
      )}

      {/* 찾아가는 방법 */}
      {data.directions?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Navigation className="w-5 h-5" /> 찾아가는 방법
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {data.directions.join("\n")}
          </ReactMarkdown>
        </div>
      )}

      {/* 주변 정보 */}
      {data.nearbyInfo?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Landmark className="w-5 h-5" /> 주변 정보
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {data.nearbyInfo.join("\n")}
          </ReactMarkdown>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-end items-center gap-4 mt-8">
        <Link
          href={`/admin/recommendation/${id}/edit`}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-gray-800 hover:bg-black transition"
        >
          <Pencil className="w-4 h-4" /> 수정하기
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" /> 삭제하기
        </button>
      </div>
    </div>
  );
}
