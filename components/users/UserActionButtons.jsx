import { suspendUser, recoverUser } from "@/lib/admin";

import { PauseCircle, Trash2, RotateCcw } from "lucide-react";
import { updateUserStatus } from "@/lib/users";
import { deleteUserRequest } from "@/lib/client/deleteUserRequest";

export default function UserActionButtons({ userId, currentStatus }) {
  const handleSuspend = async () => {
    const confirm = window.confirm("정말 이 사용자의 계정을 정지하시겠어요?");
    if (!confirm) return;

    try {
      await suspendUser(userId); // Firebase Auth 정지
      await updateUserStatus(userId, "suspended"); // Firestore 상태 반영

      alert("계정이 정지되었습니다.");
      location.reload(); // 필요 시 상태 새로고침
    } catch (err) {
      console.error("계정 정지 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  const handleRecover = async () => {
    const confirm = window.confirm("이 사용자의 계정을 다시 활성화할까요?");
    if (!confirm) return;

    try {
      await recoverUser(userId); // Firebase Auth 복구
      await updateUserStatus(userId, "active"); // Firestore 상태 업데이트

      alert("계정이 복구되었습니다.");
    } catch (err) {
      console.error("계정 복구 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "정말 이 계정을 완전히 삭제하시겠어요?\n이 작업은 되돌릴 수 없습니다."
    );
    if (!confirmDelete) return;

    try {
      await deleteUserRequest(userId); // 인증 + DB + 콘텐츠 삭제
      alert("계정이 성공적으로 삭제되었습니다.");

      if (typeof onSuccess === "function") onSuccess();
    } catch (err) {
      console.error("계정 삭제 실패:", err);
      alert(err.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={handleRecover}
        className={`text-gray-400 hover:text-blue-500 ${
          currentStatus === "suspended" ? "" : "opacity-40 cursor-not-allowed"
        }`}
        disabled={currentStatus !== "suspended"}
        title="계정 복구"
      >
        <RotateCcw size={16} strokeWidth={1.8} />
      </button>
      <button
        onClick={handleSuspend}
        className={`text-gray-400 hover:text-yellow-500 ${
          currentStatus === "suspended" ? "opacity-40 cursor-not-allowed" : ""
        }`}
        disabled={currentStatus === "suspended"}
        title="계정 정지"
      >
        <PauseCircle size={16} strokeWidth={1.8} />
      </button>
      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-500"
        title="계정 삭제"
      >
        <Trash2 size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}
