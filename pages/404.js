import { useState } from "react";
import { useRouter } from "next/router";
import EmptyState from "@/components/common/feedback/EmptyState";
import { CircleAlert } from "lucide-react";
import FormActionButton from "@/components/common/button/FormActionButton";

export default function Custom404() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = () => {
    setIsNavigating(true);
    router.replace("/admin");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <EmptyState
        message="존재하지 않는 관리자 경로입니다."
        icon={<CircleAlert className="w-10 h-10 text-red-300 mb-2" />}
      />
      <FormActionButton
        onClick={handleClick}
        label="대시보드로 돌아가기"
        isLoading={isNavigating}
        variant="default"
        className="mt-4"
      />
    </div>
  );
}
