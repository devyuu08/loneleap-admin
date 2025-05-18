export default function NoReportSelected() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <p>선택된 신고가 없습니다.</p>
      <p className="text-sm mt-2">목록에서 항목을 선택해주세요.</p>
    </div>
  );
}
