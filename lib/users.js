import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * users_public + users_private 병합된 사용자 목록 조회
 */
export async function fetchUsers() {
  try {
    const [publicSnap, privateSnap] = await Promise.all([
      getDocs(collection(db, "users_public")),
      getDocs(collection(db, "users_private")),
    ]);

    // 1. public 유저 데이터를 map으로 정리
    const publicMap = {};
    publicSnap.docs.forEach((doc) => {
      publicMap[doc.id] = doc.data();
    });

    // 2. private 데이터 + public 데이터 병합해서 반환
    const mergedUsers = privateSnap.docs.map((doc) => {
      const privateData = doc.data();
      const publicData = publicMap[doc.id] || {};

      return {
        id: doc.id, // UID
        ...privateData, // email, createdAt, role, status 등
        ...publicData, // displayName, photoURL, bio 등
      };
    });

    return mergedUsers;
  } catch (error) {
    console.error("사용자 병합 조회 실패:", error);
    throw error;
  }
}

// 사용자 상태 업데이트 함수
export const updateUserStatus = async (uid, status) => {
  const userRef = doc(db, "users_private", uid);
  await updateDoc(userRef, { status });
};
