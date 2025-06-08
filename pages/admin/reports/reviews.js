import AdminReviewReportsContainer from "@/components/reports/review/AdminReviewReportsContainer";

/**
 * AdminReviewReportsPage
 * - 리뷰 신고 목록 페이지
 * - 서버사이드 데이터를 컨테이너에 전달
 */

function AdminReviewReportsPage(props) {
  return <AdminReviewReportsContainer {...props} />;
}

AdminReviewReportsPage.title = "LoneLeap Admin | 리뷰 신고";

export default AdminReviewReportsPage;
