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
import { db } from "@/lib/firebase/client";

/**
 * users_private 및 users_public 컬렉션을 병합하여 사용자 목록을 반환합니다.
 * 필터 및 정렬 옵션을 적용할 수 있습니다.
 *
 * @param {Object} filters - 필터 객체 (status, date, sort)
 * @param {string} [filters.status] - 유저 상태 필터 ("all" | "active" | "suspended")
 * @param {string} [filters.date] - 가입일 필터 ("7days" | "30days")
 * @param {string} [filters.sort] - 정렬 기준 ("latest" | "oldest" | "review" | "itinerary")
 * @returns {Promise<Array<Object>>} - 병합된 사용자 데이터 리스트
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
    if (process.env.NODE_ENV === "development") {
      console.error("사용자 병합 조회 실패:", err);
    }
    throw err;
  }
}

/**
 * users_private 컬렉션의 사용자 상태 필드를 업데이트합니다.
 *
 * @param {string} uid - 사용자 UID
 * @param {string} status - 새 상태 ("active" | "suspended" 등)
 * @returns {Promise<void>}
 */

export const updateUserStatus = async (uid, status) => {
  const userRef = doc(db, "users_private", uid);
  await updateDoc(userRef, { status });
};

/**
 * Firestore에서 사용자 계정 문서(users_private, users_public)를 삭제합니다.
 * Firebase Auth 계정 삭제는 포함하지 않습니다.
 *
 * @param {string} uid - 사용자 UID
 * @returns {Promise<void>}
 */

export const deleteUserAccount = async (uid) => {
  const privateRef = doc(db, "users_private", uid);
  const publicRef = doc(db, "users_public", uid);

  await Promise.all([deleteDoc(privateRef), deleteDoc(publicRef)]);
};
