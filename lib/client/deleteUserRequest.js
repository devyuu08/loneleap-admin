export const deleteUserRequest = async (uid) => {
  const res = await fetch("/api/admin/deleteUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "계정 삭제 실패");
  return data;
};
