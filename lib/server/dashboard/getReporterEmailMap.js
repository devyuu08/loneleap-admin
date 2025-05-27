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
