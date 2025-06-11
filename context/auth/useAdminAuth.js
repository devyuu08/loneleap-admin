import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

/**
 * 관리자 인증 컨텍스트를 제공하는 Provider 컴포넌트
 * - Firebase Auth의 상태를 감지하여 인증 사용자 정보를 전역에서 공유
 * - 초기 로딩 여부(authReady)와 현재 로그인된 사용자(authUser)를 상태로 관리
 * - 필요한 경우 사용자 ID 토큰을 가져오는 getToken 함수 제공
 */

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [authReady, setAuthReady] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    // Firebase 인증 상태 감지: 로그인/로그아웃 시 상태 자동 반영
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  /**
   * 현재 로그인된 사용자의 Firebase ID 토큰을 반환
   * - API 요청 시 인증 헤더로 사용
   */
  const getToken = async () => {
    if (!authUser) return null;
    return await authUser.getIdToken();
  };

  return (
    <AdminAuthContext.Provider value={{ authReady, authUser, getToken }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

/**
 * 관리자 인증 컨텍스트를 사용하는 커스텀 훅
 * - 전역 인증 상태(authReady, authUser, getToken)를 반환
 */

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
