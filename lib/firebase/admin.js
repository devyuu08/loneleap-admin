import admin from "firebase-admin";

/**
 * Firebase Admin SDK 초기화 및 인증/DB 인스턴스 제공 모듈
 *
 * - 서버 환경에서 Firebase 인증 및 Firestore 접근을 위한 Admin SDK 설정
 * - 앱이 이미 초기화된 경우 중복 초기화 방지
 * - 환경변수 기반으로 서비스 계정 인증 처리
 *
 * @module firebaseAdmin
 */

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

const adminAuth = admin.auth();
const db = admin.firestore();

export { adminAuth, db };
