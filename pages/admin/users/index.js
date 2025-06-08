import UserTableContainer from "@/components/users/UserTableContainer";

/**
 * AdminUsersPage
 * - 사용자 관리 테이블 페이지
 * - 사용자 목록 및 상태 관리 기능 제공
 */

function AdminUsersPage() {
  return (
    <div className="p-6">
      <UserTableContainer />
    </div>
  );
}

AdminUsersPage.title = "LoneLeap Admin | 사용자 관리";

export default AdminUsersPage;
