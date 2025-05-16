import { PauseCircle, Trash2, RotateCcw } from "lucide-react";
import { updateUserStatus } from "@/lib/users";

export default function UserActionButtons({ userId, currentStatus }) {
  console.log("currentStatus:", currentStatus);
  const handleSuspend = async () => {
    const confirm = window.confirm("정말 이 사용자의 계정을 정지하시겠어요?");
    if (!confirm) return;

    try {
      await updateUserStatus(userId, "suspended");
      alert("계정이 정지되었습니다.");
      // 리프레시 필요 시 외부에서 처리
    } catch (err) {
      console.error("계정 정지 실패:", err);
      alert("오류가 발생했습니다.");
    }
  };

  const handleRecover = async () => {
    const confirm = window.confirm("이 사용자의 계정을 다시 활성화할까요?");
    if (!confirm) return;
    try {
      await updateUserStatus(userId, "active");
      alert("계정이 복구되었습니다.");
    } catch (err) {
      console.error("계정 복구 실패:", err);
      alert("오류가 발생했습니다.");
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
      <button className="text-gray-400 hover:text-red-500">
        <Trash2 size={16} strokeWidth={1.8} />
      </button>
    </div>
  );
}
