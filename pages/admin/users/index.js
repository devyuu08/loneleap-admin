import UserTableContainer from "@/components/users/UserTableContainer";

function AdminUsersPage() {
  return (
    <div className="p-6">
      <UserTableContainer />
    </div>
  );
}

AdminUsersPage.title = "LoneLeap Admin | 사용자 관리";

export default AdminUsersPage;
