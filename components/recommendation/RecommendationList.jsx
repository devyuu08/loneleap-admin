import React from "react";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import EmptyState from "@/components/common/EmptyState";
import { MapPin } from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";

function RecommendationList({ recommendations, loading }) {
  if (loading || !recommendations) {
    return (
      <div className="py-20">
        <LoadingSpinner text="추천 여행지를 불러오는 중입니다..." />
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <EmptyState
        message="등록된 추천 여행지가 없습니다."
        icon={<MapPin className="w-8 h-8 text-gray-300 mb-2" />}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((item) => (
        <Link
          key={item.id}
          href={`/admin/recommendation/${item.id}`}
          className="bg-white rounded-xl shadow hover:bg-gray-50 transition overflow-hidden"
        >
          <div className="relative w-full h-40 sm:h-48">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>

          <div className="p-4 space-y-1">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">{item.location}</p>
            <p className="text-sm text-gray-700 line-clamp-2">{item.summary}</p>

            <div className="flex items-center justify-between pt-2">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  item.visible
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {item.visible ? "공개" : "비공개"}
              </span>
              <span className="text-xs text-gray-400">
                {item.createdAt?.toDate
                  ? format(item.createdAt.toDate(), "yyyy.MM.dd")
                  : "-"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default React.memo(RecommendationList);
