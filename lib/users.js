import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
  query,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * users_public + users_private 병합된 사용자 목록 조회
 */
export async function fetchUsers(filters = {}) {
  try {
    const privateRef = collection(db, "users_private");

    const q = [];

    // 상태 필터
    if (filters.status && filters.status !== "all") {
      q.push(where("status", "==", filters.status));
    }

    // 날짜 필터 (가입일 기준)
    if (filters.date === "7days") {
      const sevenDaysAgo = Timestamp.fromDate(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      q.push(where("createdAt", ">=", sevenDaysAgo));
    } else if (filters.date === "30days") {
      const thirtyDaysAgo = Timestamp.fromDate(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      q.push(where("createdAt", ">=", thirtyDaysAgo));
    }

    // 정렬 기준
    let sortField = "createdAt";
    let sortDirection = "desc";

    if (filters.sort === "oldest") {
      sortDirection = "asc";
    } else if (filters.sort === "review") {
      sortField = "reviewCount";
      sortDirection = "desc";
    } else if (filters.sort === "itinerary") {
      sortField = "itineraryCount";
      sortDirection = "desc";
    }

    q.push(orderBy(sortField, sortDirection));

    const privateQuery = query(privateRef, ...q);
    const privateSnap = await getDocs(privateQuery);

    // public 데이터 가져오기
    const publicSnap = await getDocs(collection(db, "users_public"));

    const publicMap = {};
    publicSnap.docs.forEach((doc) => {
      publicMap[doc.id] = doc.data();
    });

    const merged = privateSnap.docs.map((doc) => {
      const privateData = doc.data();
      const publicData = publicMap[doc.id] || {};

      return {
        id: doc.id,
        ...privateData,
        ...publicData,
      };
    });

    return merged;
  } catch (err) {
    console.error("사용자 병합 조회 실패:", err);
    throw err;
  }
}

// 사용자 상태 업데이트 함수
export const updateUserStatus = async (uid, status) => {
  const userRef = doc(db, "users_private", uid);
  await updateDoc(userRef, { status });
};

export const deleteUserAccount = async (uid) => {
  const privateRef = doc(db, "users_private", uid);
  const publicRef = doc(db, "users_public", uid);

  await Promise.all([deleteDoc(privateRef), deleteDoc(publicRef)]);
};
