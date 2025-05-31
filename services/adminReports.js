export async function getAdminReports({ endpoint, token, query = {} }) {
  const searchParams = new URLSearchParams({ limit: 50, ...query });
  const res = await fetch(`${endpoint}?${searchParams.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다");
  return await res.json();
}
