/**
 * reporterId(uid) 리스트를 받아 해당 유저의 이메일을 매핑하여 반환합니다.
 * users 컬렉션에 없을 경우 Firebase Auth에서 직접 조회하거나 '탈퇴한 사용자'로 처리합니다.
 *
 * @param {FirebaseFirestore.Firestore} db - Firestore 인스턴스
 * @param {Set<string>} ids - UID 문자열 Set
 * @returns {Promise<Record<string, string>>} - UID → 이메일 매핑 객체
 */

export async function getReporterEmailMap(db, ids) {
  const { getAuth } = await import("firebase-admin/auth");
  const emailMap = {};

  await Promise.all(
    Array.from(ids).map(async (uid) => {
      if (!uid) return;

      try {
        const userDoc = await db.collection("users").doc(uid).get();
        if (userDoc.exists) {
          emailMap[uid] = userDoc.data().email || "알 수 없음";
        } else {
          const userRecord = await getAuth().getUser(uid);
          emailMap[uid] = userRecord.email || "알 수 없음";
        }
      } catch {
        emailMap[uid] = "탈퇴한 사용자";
      }
    })
  );

  return emailMap;
}
