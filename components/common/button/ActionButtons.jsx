import { useState } from "react";
import { getAuth } from "firebase/auth";
import ButtonSpinner from "@/components/common/loading/ButtonSpinner";

import { btnFlexBox, btnSmallBox } from "@/styles/buttonStyles";

export default function ActionButtons({ report, onSuccess }) {
  const [deleting, setDeleting] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const { reviewId, roomId, messageId, id: reportId } = report;
  const isChat = !!(roomId && messageId);

  const handleDelete = async () => {
    const confirmMessage = isChat
      ? "정말 해당 메시지를 삭제하시겠습니까?"
      : "정말 해당 리뷰를 삭제하시겠습니까?";
    const confirm = window.confirm(confirmMessage);
    if (!confirm) return;

    setDeleting(true);
    try {
      const token = await getAuth().currentUser?.getIdToken();

      const res = await fetch(
        isChat
          ? "/api/admin/report/chat/deleteWithReports"
          : "/api/admin/report/review/deleteWithReports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(isChat ? { roomId, messageId } : { reviewId }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert(
          isChat
            ? "메시지와 신고가 삭제되었습니다."
            : "리뷰와 신고가 삭제되었습니다."
        );
        onSuccess?.(report); // 전체 report 전달
      } else {
        alert("삭제 실패: " + result.error);
      }
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("신고 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDismiss = async () => {
    const confirm = window.confirm("해당 신고를 무시하시겠습니까?");
    if (!confirm) return;

    setDismissing(true);
    try {
      const token = await getAuth().currentUser?.getIdToken();

      const res = await fetch(
        isChat
          ? "/api/admin/report/chat/dismiss"
          : "/api/admin/report/review/dismiss",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(isChat && token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ reportId }),
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert("신고가 삭제되었습니다.");
        onSuccess?.(report); // 전체 report 전달
      } else {
        alert("삭제 실패: " + result.error);
      }
    } catch (err) {
      console.error("신고 삭제 오류:", err);
      alert("신고 삭제 중 오류가 발생했습니다.");
    } finally {
      setDismissing(false);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <button
        onClick={handleDelete}
        disabled={deleting}
        className={`${btnFlexBox} ${btnSmallBox} bg-red-500 hover:bg-red-600 text-white`}
      >
        {deleting ? <ButtonSpinner /> : isChat ? "메시지 삭제" : "리뷰 삭제"}
      </button>

      <button
        onClick={handleDismiss}
        disabled={dismissing}
        className={`${btnFlexBox} ${btnSmallBox} bg-gray-300 hover:bg-gray-400 text-gray-800`}
      >
        {dismissing ? <ButtonSpinner color="gray" /> : "신고 무시"}
      </button>
    </div>
  );
}
