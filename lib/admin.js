export const suspendUser = async (uid) => {
  const res = await fetch("/api/admin/disableUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "계정 정지 실패");
  }

  return await res.json();
};

export const recoverUser = async (uid) => {
  const res = await fetch("/api/admin/enableUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "복구 실패");
  return result;
};

export const deleteUser = async (uid) => {
  const res = await fetch("/api/admin/deleteUser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ uid }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.error || "삭제 실패");
  return result;
};
