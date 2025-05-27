export const suspendUser = async (uid) => {
  const res = await fetch(`/api/admin/users/${uid}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "banned" }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "계정 정지 실패");
  return data;
};

export const recoverUser = async (uid) => {
  const res = await fetch(`"/api/admin/users/${uid}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "active" }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "계정 복구 실패");
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
