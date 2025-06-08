import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/**
 * 클라이언트 측 Firebase 초기화 모듈
 *
 * - Firebase Web SDK를 기반으로 클라이언트 앱에서 Firebase 서비스(auth, db, storage)를 초기화
 * - `getApps()`를 통해 중복 초기화를 방지하고, 이미 초기화된 앱을 재사용
 * - 환경변수(`NEXT_PUBLIC_*`) 기반 설정 사용
 *
 * @module firebaseClient
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
