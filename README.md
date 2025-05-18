# 🛡️ LoneLeap 관리자 페이지 (Next.js)

> 혼자 여행 플랫폼의 신고 관리, 사용자 관리, 추천 여행지 관리를 위한 Next.js 기반 관리자 페이지입니다. 서버 렌더링(SSR) 구조로 되어 있으며, Firebase Admin SDK를 활용하여 보안과 기능을 분리했습니다.

---

## **1. 📌 프로젝트 소개**

**LoneLeap 관리자 페이지**는 메인 사용자 웹앱(React)에서 생성된 일정, 리뷰, 채팅 메시지 등 사용자 콘텐츠에 대한 **신고 접수 및 사용자 관리**를 담당하는 전용 관리자 대시보드입니다.

Next.js 기반의 서버사이드 렌더링(SSR) 구조로 구현되었으며, Firebase Admin SDK를 활용해 보안성과 기능 분리를 강화했습니다.

> 관리자 기능은 사용자 앱과 완전히 분리된 독립 프로젝트로 운영됩니다.

### 🎯 주요 특징

- **서버 인증 기반 보호 라우팅**  
  Firebase ID 토큰을 쿠키에 저장하고 서버에서 검증하는 방식으로, 클라이언트 기반 인증보다 보안성이 높음.

- **관리자 이메일 기반 접근 제어**  
  `.env.local`에 등록된 `ADMIN_EMAILS` 목록에 포함된 이메일만 관리자 권한 부여.

- **콘텐츠 신고 처리 및 사용자 관리 기능 제공**  
  신고된 리뷰/채팅 메시지 확인 및 삭제, 사용자 정지·복구·삭제, 추천 여행지 등록/수정 등 다양한 기능을 제공.

- **SSR 환경에서 Firestore 데이터 제어**  
  클라이언트가 아닌 서버에서 Firestore 데이터를 조회/수정하여 성능과 보안을 함께 확보.

- **대시보드 통계 시각화**  
  신고 추이, 사용자 활동, 리뷰/일정 작성 현황 등 주요 지표를 차트로 시각화하여 한눈에 파악 가능.

---

## **2. 🛠️ 기술 스택**

- **Next.js (Pages Router)**

  - 서버사이드 렌더링 기반 라우팅
  - `getServerSideProps`를 통한 인증 및 데이터 패칭

- **Firebase Admin SDK**

  - 서버에서 Firestore 접근 및 사용자 계정 관리
  - 관리자 인증 및 토큰 검증 처리

- **Firebase Authentication**

  - 클라이언트 로그인 처리 (이메일/비밀번호)
  - 로그인 후 서버 쿠키에 토큰 저장

- **HttpOnly Cookie 기반 인증**

  - 관리자 인증 토큰을 쿠키로 저장하여 보안 강화
  - 서버에서만 접근 가능한 `HttpOnly` 속성 사용

- **Tailwind CSS**

  - 반응형 UI 구현
  - 디자인 호텔 스타일을 참고한 감성적 관리자 UI

- **Recharts**

  - 대시보드 통계 시각화 (라인, 바, 도넛 차트 등)

- **환경 변수 (.env.local)**
  - 관리자 이메일 목록, Firebase Admin 키 등 민감 정보 관리

---

## **3. 📁 폴더 구조**

```bash
loneleap-admin/
├── .env.local                    # 환경 변수 설정 (Firebase Admin, 관리자 이메일 등)
├── components/                  # 공통 UI 컴포넌트
├── hooks/                       # 커스텀 훅
├── lib/                         # 서버 사이드 로직 및 유틸리티
│   ├── auth.js                  # 토큰 검증 및 인증 유틸
│   ├── cookies.js               # 쿠키 설정 및 삭제
│   ├── firebase.js              # Firebase Client SDK (사용자 로그인 등)
│   ├── firebaseAdmin.js         # Firebase Admin SDK 초기화
│   ├── uploadImage.js           # Firebase Storage 이미지 업로드 처리
│   ├── admin.js                 # 관리자 관련 유틸
│   ├── users.js                 # 사용자 관리 관련 유틸
│   └── utils.js                 # 공통 유틸 함수
├── pages/                       # Next.js 라우팅 기반 구조
│   ├── admin/
│   │   ├── index.js             # 관리자 대시보드
│   │   ├── login.js             # 관리자 로그인 페이지
│   │   ├── recommendation/      # 추천 여행지 관리 페이지
│   │   ├── reports/             # 신고 관리 (리뷰/채팅)
│   │   └── users/               # 사용자 관리
│   ├── api/                     # API Routes (서버 함수)
│   │   ├── admin/               # 인증/로그아웃 API
│   │   ├── chatReports/         # 채팅 신고 처리 API
│   │   ├── reviewReports/       # 리뷰 신고 처리 API
│   ├── _app.js                  # 글로벌 App 설정
│   ├── 404.js                   # Not Found 페이지
│   └── index.js                 # 루트 페이지 (리다이렉트 등)
├── public/                      # 정적 파일
├── styles/                      # Tailwind CSS 글로벌 스타일
└── utils/                       # 범용 유틸리티 함수
```

---

## 🔐 4. 관리자 인증 방식

관리자 인증은 일반 사용자와 분리된 구조로 설계되어 있으며, 다음과 같은 방식으로 인증 흐름이 구성됩니다.

### ✅ 현재 배포 버전 (v2 기준)

- Firebase Authentication을 통해 로그인 후,
- 로그인 성공 시 서버 API(`/api/admin/session`)를 통해 ID Token을 검증하고 **HttpOnly 쿠키에 세션 저장**.
- 이후 모든 인증된 요청은 서버에서 쿠키에 저장된 토큰을 통해 인증 확인.
- 관리자 이메일은 환경변수(`ADMIN_EMAILS`)에서 관리되며, 허용된 이메일만 인증 통과.

#### 인증 흐름 요약

1. **클라이언트**: 이메일/비밀번호로 Firebase 로그인
2. **서버**: Firebase Admin SDK로 ID Token 검증
3. **쿠키 저장**: 인증 성공 시 `admin-auth-token`이라는 이름의 HttpOnly 쿠키 생성
4. **SSR 인증 확인**: `getServerSideProps` 또는 API Route에서 토큰 유효성 검증 및 관리자 이메일 확인
5. **라우팅 보호**: `AdminProtectedRoute` 또는 SSR 인증에서 비관리자/만료된 세션 접근 제한

#### 환경변수 예시 (.env.local)

```env
ADMIN_EMAILS=admin@example.com,test@domain.com
```

---

## ✅ 5. 기능 요약

| 기능                | 설명                                                                 |
| ------------------- | -------------------------------------------------------------------- |
| 🔐 관리자 로그인    | Firebase Auth 기반 로그인 / 허용된 이메일만 관리자 권한 부여         |
| 🔒 보호 라우팅      | 인증되지 않은 사용자는 접근 불가 / 서버 쿠키 기반 인증               |
| 🧭 대시보드         | 신고된 리뷰/채팅/사용자 수, 최근 신고 내역, 통계 시각화              |
| 📝 리뷰 신고 관리   | review_reports 컬렉션 기반 목록 조회, 신고 리뷰 확인 및 삭제 기능    |
| 💬 채팅 신고 관리   | chatReports 컬렉션 기반 신고 메시지 조회 및 삭제                     |
| 👥 사용자 관리      | 사용자 목록 확인, 정렬/필터링, 통계 필드 기반 상태 확인              |
| 🚫 계정 상태 제어   | 사용자 계정 정지/복구/삭제 기능 (Auth 연동 및 Firestore 콘텐츠 제거) |
| 📍 추천 여행지 관리 | 여행지 등록/수정/삭제 기능, 이미지 업로드, Firestore 연동            |
| 📊 통계 시각화      | 리뷰 신고 추이, 채팅 신고 추이, 사용자 활동 분포, 콘텐츠 생성 추이   |
| ⏱ 세션 타이머       | 로그인 유지 시간 표시, 세션 만료 시 자동 로그아웃 UX                 |

> 모든 기능은 관리자 권한이 있는 계정으로 로그인한 경우에만 접근 가능하며, 인증은 Firebase Admin SDK를 통해 서버에서 검증됩니다.

## ✅ 주요 기능 개선 내역 (v2)

### 🔐 인증 방식 개선

- Firebase Authentication → **쿠키 기반 인증 구조로 전환**
- 로그인 성공 시 서버에서 HttpOnly 쿠키(`admin-auth-token`) 저장
- 클라이언트 측 인증 제거, 서버 사이드에서 ID 토큰 검증
- 세션 만료 감지 시 자동 로그아웃 + 알림 처리(alert 방식)
- 사이드바에 `SessionTimer` 도입 → 세션 남은 시간 실시간 표시

---

### 👥 사용자 관리 기능 추가

- 사용자 목록 테이블 구현 (이메일, 가입일, 작성 콘텐츠 수, 신고 이력 등)
- Firestore 기반 서버 측 카운트 필드 활용
  - `itineraryCount`, `reviewCount`, `reportedCount`
- 사용자 상태 관리
  - `active` / `banned` 상태 제어
  - Firebase Auth `disable` / `enable` 연동 처리
- 사용자 계정 삭제 시:
  - Firestore 문서 + 인증 계정 동시 삭제
  - 리뷰/일정 삭제 처리 (댓글, 좋아요는 유지)

---

### 📊 통계 시각화 기능 추가 (대시보드)

- Recharts 기반 관리자 통계 UI 도입
  1. 리뷰 신고 추이 (최근 7일)
  2. 채팅 신고 추이 (최근 7일)
  3. 사용자 활동 분포 (active/banned)
  4. 월별 콘텐츠 등록 추이 (리뷰/일정)

---

### 📌 추천 여행지 관리 기능 개선

- 추천 여행지 등록/수정/삭제 기능 전체 구현
- 폼 UI 통일 및 이미지 업로드 리팩토링
- Firestore 보안 규칙 강화 및 Storage 권한 재정비

---

### 🔧 전반적인 리팩토링 및 개선

- 관리자 보호 라우팅 개선 (`AdminProtectedRoute`)
- 페이지 접근 조건을 명확하게 분기 처리
- 사용자 목록 필터링/정렬 기능 개선
- CSV 내보내기 기능 도입 (사용자 데이터)
- 리뷰/채팅 신고 목록 UI 개선 및 상세 보기 구조화
- Firestore 구조 개편 대응 (e.g. `users_private`, `sender.uid` 등)
- constants.js 제거 → 관리자 이메일을 환경변수로 통합 관리

---

## **6. 🚀 실행 방법**

```bash
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
