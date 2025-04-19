# 🛡️ LoneLeap 관리자 페이지 (Next.js)

> 혼자 여행 플랫폼의 신고 관리, 사용자 관리, 추천 여행지 관리를 위한 Next.js 기반 관리자 페이지입니다. 서버 렌더링(SSR) 구조로 되어 있으며, Firebase Admin SDK를 활용하여 보안과 기능을 분리했습니다.

---

## **1. 📌 프로젝트 소개**

**LoneLeap 관리자 페이지**는 메인 플랫폼에서 생성된 사용자 콘텐츠(리뷰/채팅 등)에 대해 신고가 접수되었을 때, 이를 관리자가 처리할 수 있도록 구성된 별도 인터페이스입니다.

- 일반 사용자는 접근 불가
- Firebase Authentication 기반 로그인
- 관리자 이메일 인증으로 접근 제어
- 서버 측에서 Firestore 데이터를 조회/수정
- 신고된 리뷰 및 채팅 메시지를 확인하고 삭제 가능

---

## **2. 🛠️ 기술 스택**

- **Next.js** – Pages Router + SSR 렌더링
- **Firebase Admin SDK** – 서버에서 Firestore 인증 및 데이터 접근
- **Firebase Authentication** – 관리자 로그인 처리
- **Tailwind CSS** – 반응형 UI 구현
- **환경변수 기반 설정 (.env.local)**

---

## **3. 📁 폴더 구조**

```
loneleap-admin/
├── pages/
│   ├── admin/
│   │   ├── index.js            # 대시보드
│   │   ├── login.js            # 관리자 로그인
│   │   ├── users.js            # 사용자 관리
│   │   ├── spots.js            # 추천 여행지 관리
│   │   └── reports/
│   │       ├── reviews.js      # 리뷰 신고 관리
│   │       └── chats.js        # 채팅 신고 관리
│   └── api/                    # Next.js API Routes
│       ├── reviewReports/
│       ├── chatReports/
│       └── auth.js
├── components/
│   ├── layout/                 # AdminLayout, Sidebar 등
│   ├── auth/                   # 로그인 폼
│   ├── common/                 # 스피너, 버튼 등 공용 UI
│   └── reports/
│       ├── tables/
│       ├── details/
│       └── ui/
├── lib/
│   ├── firebaseAdmin.js        # Admin SDK 초기화
│   ├── auth.js                 # 토큰 검증 유틸
│   └── constants.js            # 관리자 이메일 리스트 (v1)
├── styles/
│   └── globals.css
├── .env.local                  # 환경변수
└── next.config.js

```

---

## **4. 🔐 관리자 인증 방식**

### ✅ **v1 기준 (현재 배포 버전)**

- **Firebase Authentication**을 통해 로그인한 후,
- 클라이언트 측에서 `adminEmails` 리스트에 포함된 이메일인지 확인
- 해당 이메일에 포함된 계정만 관리자 기능 접근 가능

```
// lib/constants.js
export const adminEmails = ["admin@example.com"];

```

- `AdminProtectedRoute`에서 라우팅 보호 처리:

```
if (!user || !adminEmails.includes(user.email)) {
  router.replace("/admin/login?error=not-admin");
}

```

### 🔄 **v2 예정 구조 (보안 강화)**

- Firebase ID Token → **쿠키 저장**
- 서버 측 `getServerSideProps`에서 토큰 검증
- 이메일 화이트리스트는 `.env.local`의 `ADMIN_EMAILS`로 분리 관리

```
ADMIN_EMAILS=admin@example.com

```

---

## **5. ✅ 기능 요약**

| 기능                          | 설명                                                         |
| ----------------------------- | ------------------------------------------------------------ |
| 🔐 관리자 로그인              | Firebase Auth 기반 로그인 (지정된 이메일만 관리자 권한 허용) |
| 🧭 대시보드                   | 신고된 리뷰/채팅/사용자 수 및 최근 신고 내역 요약            |
| 📝 리뷰 신고 관리             | review_reports 문서 리스트 확인 / 리뷰 삭제 처리             |
| 💬 채팅 신고 관리             | chatReports 문서 리스트 확인 / 채팅 메시지 삭제              |
| 👥 사용자 관리                | Firestore users 컬렉션 기반 사용자 리스트 확인               |
| 📍 추천 여행지 관리 (v4 예정) | 추천 장소 등록 및 편집 UI 구성 완료                          |
| 🔐 인증 보호 라우팅           | 관리자 외 접근 차단 (Firebase Admin SDK 검증)                |

> 모든 관리자 기능은 로그인된 상태이면서, 지정된 관리자 이메일일 경우에만 접근 가능합니다.

---

## **6. 🚀 실행 방법**

```bash
cd loneleap-admin
npm install
npm run dev

```

- `http://localhost:3000/admin` 접속 후 로그인
- `.env.local` 파일에 Firebase Admin SDK 관련 설정 필요

---

## **7. 🌍 배포 정보**

- **배포 플랫폼**: Vercel
- **배포 URL**: [https://loneleap-admin.vercel.app/admin](https://loneleap-admin.vercel.app/)

---

## **8. ✨ 기타**

- 이 프로젝트는 신입 프론트엔드 개발자의 포트폴리오 용도로 제작되었습니다.
- 실사용보다는 기술 구현, 인증 흐름, SSR 구조 구현에 초점이 맞춰져 있습니다.

---

## 📘 관련 문서

- 클라이언트 페이지: loneleap-client/README.md
- 전체 구조 및 연동 흐름은 Notion 문서 참조 예정
