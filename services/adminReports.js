/**
 * 관리자 권한으로 신고 데이터를 불러옵니다.
 *
 * @param {Object} params - 요청 파라미터
 * @param {string} params.endpoint - API 엔드포인트 URL
 * @param {string} params.token - 인증 토큰 (Bearer)
 * @param {Object} [params.query={}] - 검색/페이징용 쿼리 파라미터
 * @returns {Promise<Object[]>} - 신고 데이터 배열
 */

export async function getAdminReports({ endpoint, token, query = {} }) {
  const searchParams = new URLSearchParams({ limit: 50, ...query });
  const res = await fetch(`${endpoint}?${searchParams.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("데이터를 불러오는데 실패했습니다");
  return await res.json();
}
