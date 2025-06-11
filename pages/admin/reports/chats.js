import AdminChatReportsContainer from "@/components/reports/chat/AdminChatReportsContainer";

/**
 * AdminChatReportsPage
 * - 채팅 신고 목록 페이지
 * - 서버사이드 데이터를 컨테이너에 전달
 */

function AdminChatReportsPage(props) {
  return <AdminChatReportsContainer {...props} />;
}

AdminChatReportsPage.title = "LoneLeap Admin | 채팅 신고";

export default AdminChatReportsPage;
