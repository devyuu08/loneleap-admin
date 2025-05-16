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
