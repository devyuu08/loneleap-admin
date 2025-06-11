/**
 * 사용자 상태 변경 (관리자 전용)
 *
 * 지정한 사용자 UID에 대해 'active', 'banned' 등 상태를 변경하는 API 요청을 수행합니다.
 *
 * @param {string} uid - 상태를 변경할 사용자 UID
 * @param {string} status - 설정할 상태값 ('active', 'banned' 등)
 * @returns {Promise<Object>} - 변경된 사용자 정보 객체
 * @throws {Error} - 요청 실패 시 에러 메시지를 포함한 예외를 발생시킴
 */

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

/**
 * 사용자 계정 삭제 (관리자 전용)
 *
 * 지정한 사용자 UID에 대해 계정 삭제 API 요청을 수행합니다. 되돌릴 수 없는 작업이므로 주의가 필요합니다.
 *
 * @param {string} uid - 삭제할 사용자 UID
 * @returns {Promise<Object>} - 삭제 결과를 담은 응답 객체
 * @throws {Error} - 요청 실패 시 에러 메시지를 포함한 예외를 발생시킴
 */

export const deleteUser = async (uid) => {
  const res = await fetch(`/api/admin/users/${uid}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "계정 삭제 실패");
  return data;
};
