import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "./firebase"; // firebase 초기화된 db 객체

export async function fetchUsers() {
  try {
    // createdAt 정렬 시, 모든 문서에 createdAt이 있어야 함 (Timestamp 권장)
    const userRef = collection(db, "users");
    const q = query(userRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const users = snapshot.docs.map((doc) => ({
      id: doc.id, // UID
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("사용자 목록 조회 실패:", error);
    // 정렬 에러 발생 시 createdAt 없이 다시 시도
    try {
      const fallbackSnapshot = await getDocs(collection(db, "users"));
      return fallbackSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (fallbackError) {
      console.error("백업 조회도 실패:", fallbackError.message);
      throw fallbackError;
    }
  }
}
