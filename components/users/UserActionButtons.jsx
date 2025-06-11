import React from "react";
import { PauseCircle, Trash2, RotateCcw } from "lucide-react";
import { changeAdminUserStatus, deleteUser } from "@/lib/admin/userActions";
import { updateUserStatus } from "@/lib/server/users";
import { toast } from "react-hot-toast";

/**
 * UserActionButtons
 * - 관리자 페이지 사용자 행위 제어 버튼 모음 (계정 정지, 복구, 삭제)
 * - 계정 상태에 따라 버튼 비활성화 조건을 제어
 * - 액션 처리 후 상위 컴포넌트에 성공 콜백 전달
 */

function UserActionButtons({ userId, currentStatus, onSuccess }) {
  const isBanned = currentStatus === "banned";

  const handleAction = async ({ message, action }) => {
    const confirmed = window.confirm(message);
    if (!confirmed) return;

    try {
      await action();
      onSuccess();
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("액션 실패:", err);
      }
      if (err.message?.includes("no user record")) {
        toast.success(
          "이미 탈퇴된 사용자입니다. 남은 데이터는 정리되었습니다."
        );
      } else {
        toast.error(err.message || "작업 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      {/* 계정 복구 버튼 (정지 상태일 때만 활성화) */}
      <button
        onClick={() =>
          handleAction({
            message: "이 사용자의 계정을 다시 활성화할까요?",
            action: async () => {
              await changeAdminUserStatus(userId, "active");
              await updateUserStatus(userId, "active");
              toast.success("계정이 복구되었습니다.");
            },
          })
        }
        className={`text-gray-400 hover:text-blue-500 ${
          isBanned ? "" : "opacity-40 cursor-not-allowed"
        }`}
        disabled={!isBanned}
        title="계정 복구"
      >
        <RotateCcw size={16} strokeWidth={1.8} />
      </button>

      {/* 계정 정지 버튼 (이미 정지된 경우 비활성화) */}
      <button
        onClick={() =>
          handleAction({
            message: "정말 이 사용자의 계정을 정지하시겠어요?",
            action: async () => {
              await changeAdminUserStatus(userId, "banned");
              await updateUserStatus(userId, "banned");
              toast.success("계정이 정지되었습니다.");
              location.reload();
            },
          })
        }
        className={`text-gray-400 hover:text-yellow-500 ${
          isBanned ? "opacity-40 cursor-not-allowed" : ""
        }`}
        disabled={isBanned}
        title="계정 정지"
      >
        <PauseCircle size={16} strokeWidth={1.8} />
      </button>

      {/* 계정 삭제 버튼 (항상 활성화됨, 복구 불가) */}
      <button
        onClick={() =>
          handleAction({
            message:
              "정말 이 계정을 완전히 삭제하시겠어요?\n이 작업은 되돌릴 수 없습니다.",
            action: async () => {
              await deleteUser(userId);
              toast.success("계정이 성공적으로 삭제되었습니다.");
            },
          })
        }
        className="text-gray-400 hover:text-red-500"
        title="계정 삭제"
      >
        <Trash2 size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}

export default React.memo(UserActionButtons);
