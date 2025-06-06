import React from "react";
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
import FormActionButton from "@/components/common/FormActionButton";

function RecommendationDetail({
  name,
  summary,
  location,
  description,
  locationInfo,
  directions,
  nearbyInfo,
  imageUrl,
  visible,
  createdAt,
  updatedAt,
  onEdit,
  onDelete,
  loading,
}) {
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
        <div className="relative w-full h-[240px] sm:h-[280px] md:h-[320px] rounded-lg overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mt-6">
          <div className="flex-1 min-w-0 space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <p className="text-gray-500 flex items-center gap-1 break-words">
              <MapPin className="w-4 h-4" />
              {location}
            </p>
            <p className="text-gray-700 break-words">{summary}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium text-xs ${
                visible
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {visible ? (
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
                {createdAt?.toDate
                  ? format(createdAt.toDate(), "yyyy.MM.dd")
                  : "-"}
              </p>
              {updatedAt?.toDate && (
                <p className="flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  수정일: {format(updatedAt.toDate(), "yyyy.MM.dd")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 상세 설명 */}
      {description && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BookText className="w-5 h-5" /> 상세 설명
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {description}
          </ReactMarkdown>
        </div>
      )}

      {/* 위치 설명 */}
      {locationInfo && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" /> 위치 설명
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {locationInfo}
          </ReactMarkdown>
        </div>
      )}

      {/* 찾아가는 방법 */}
      {directions?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Navigation className="w-5 h-5" /> 찾아가는 방법
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {directions.join("\n")}
          </ReactMarkdown>
        </div>
      )}

      {/* 주변 정보 */}
      {nearbyInfo?.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Landmark className="w-5 h-5" /> 주변 정보
          </h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {nearbyInfo.join("\n")}
          </ReactMarkdown>
        </div>
      )}

      <div className="flex flex-row flex-wrap justify-end items-center gap-3 mt-8">
        <FormActionButton
          label="수정하기"
          icon={Pencil}
          variant="default"
          onClick={onEdit}
        />

        <FormActionButton
          label="삭제하기"
          icon={Trash2}
          variant="danger"
          onClick={onDelete}
          disabled={loading}
          isLoading={loading}
        />
      </div>
    </div>
  );
}

export default React.memo(RecommendationDetail);
