import EmptyState from "@/components/common/EmptyState";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <EmptyState
        message="존재하지 않는 관리자 경로입니다."
        icon={<CircleAlert className="w-10 h-10 text-red-300 mb-2" />}
      />
      <button
        onClick={() => router.push("/admin")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        대시보드로 돌아가기
      </button>
    </div>
  );
}
