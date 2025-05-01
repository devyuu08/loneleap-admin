import { useRouter } from "next/router";
import { useRecommendationDetail } from "@/hooks/useRecommendationDetail";
import AdminLayout from "@/components/layout/AdminLayout";
import AdminProtectedRoute from "@/components/auth/AdminProtectedRoute";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MapPin, Eye, EyeOff, Clock, ArrowLeft, Pencil } from "lucide-react";

export default function AdminRecommendationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, notFound } = useRecommendationDetail(id);

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;
  if (notFound)
    return (
      <div className="p-10 text-center text-gray-500">
        존재하지 않는 여행지입니다.
      </div>
    );

  return (
    <AdminProtectedRoute>
      <AdminLayout>
        <div className="w-full max-w-4xl mx-auto px-6 py-10 space-y-10">
          {/* 뒤로가기 */}
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
            {/* 이미지 */}
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

            {/* 텍스트 + 메타 정보 분리 레이아웃 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-6 gap-6">
              {/* 텍스트 정보 */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {data.name}
                </h1>
                <p className="text-gray-500 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {data.location}
                </p>
                <p className="text-gray-700">{data.summary}</p>
              </div>

              {/* 등록/수정일 */}
              <div className="text-xs text-gray-500 space-y-1">
                <p className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  등록일:{" "}
                  {data.createdAt?.toDate
                    ? format(data.createdAt.toDate(), "yyyy.MM.dd")
                    : "-"}
                </p>
                {data.updatedAt?.toDate && (
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    수정일: {format(data.updatedAt.toDate(), "yyyy.MM.dd")}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* 상세 설명 */}
          {data.description && (
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                상세 설명
              </h2>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ children }) => (
                    <p className="text-gray-800 leading-relaxed mb-4">
                      {children}
                    </p>
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
                }}
              >
                {data.description}
              </ReactMarkdown>
            </div>
          )}

          {/* 위치 설명 */}
          {data.locationInfo && (
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                위치 설명
              </h2>
              <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                {data.locationInfo}
              </p>
            </div>
          )}

          {/* 찾아가는 방법 */}
          {data.directions?.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                찾아가는 방법
              </h2>
              <ul className="space-y-1 list-disc list-inside text-sm text-gray-700">
                {data.directions.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 주변 정보 */}
          {data.nearbyInfo?.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">주변 정보</h2>
              <ul className="space-y-1 list-disc list-inside text-sm text-gray-700">
                {data.nearbyInfo.map((place, i) => (
                  <li key={i}>{place}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 메타 정보 + 버튼 */}
          <div className="bg-white rounded-xl shadow p-6 text-sm text-gray-500">
            <div className="flex items-center justify-between">
              {/* 공개 여부 */}
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

              {/* 수정 버튼 */}
              <Link
                href={`/admin/recommendation/${id}/edit`}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-black rounded-lg transition"
              >
                <Pencil className="w-4 h-4 mr-2" />
                수정하기
              </Link>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminProtectedRoute>
  );
}
