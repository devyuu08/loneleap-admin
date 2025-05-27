export const changeAdminUserStatus = async (uid, status) => {
  const res = await fetch(`/api/admin/users/${uid}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `상태 변경 실패 (${status})`);
  return data;
};

export const deleteUser = async (uid) => {
  const res = await fetch(`/api/admin/users/${uid}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "계정 삭제 실패");
  return data;
};
