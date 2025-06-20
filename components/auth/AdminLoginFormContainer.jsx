import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import AdminLoginForm from "@/components/auth/AdminLoginForm";

/**
 * AdminLoginFormContainer
 * - LoneLeap 관리자 로그인 컨테이너 컴포넌트
 * - 입력 상태 관리, 유효성 검사, Firebase 인증 로직 처리
 * - AdminLoginForm 컴포넌트에 props로 전달
 */

export default function AdminLoginFormContainer({ errorMessage }) {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // 접근성용 오류 ID
  const emailErrorId = error?.includes("이메일") ? "email-error" : undefined;
  const passwordErrorId = error?.includes("비밀번호")
    ? "password-error"
    : undefined;
  const passwordMatchErrorId = passwordMatchError
    ? "confirm-password-error"
    : undefined;

  // URL 쿼리 기반 에러 메시지 처리
  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const errorType = router.query.error;

    if (errorType) {
      const messages = {
        "login-required": "로그인이 필요합니다.",
        unauthorized: "관리자 권한이 없습니다.",
      };

      setError(messages[errorType] || "로그인이 필요합니다.");
    }
  }, [errorMessage, router.query.error]);

  // 입력 값 변경 핸들러
  const handleChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  // 이메일 로그인 처리
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = form;

    // 유효성 검사
    if (!email.trim()) return setError("이메일을 입력해주세요.");
    if (!password) return setError("비밀번호를 입력해주세요.");
    if (password !== confirmPassword) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoadingEmail(true);
    setError("");
    setPasswordMatchError("");

    try {
      // Firebase 인증 → 토큰 발급 → 서버에 로그인 요청
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      localStorage.setItem("sessionStart", new Date().toISOString());
      router.push("/admin");
    } catch (err) {
      if (!errorMessage) {
        const code = err?.code || "";
        switch (code) {
          case "auth/user-not-found":
            setError("해당 계정이 존재하지 않습니다.");
            break;
          case "auth/wrong-password":
            setError("비밀번호가 올바르지 않습니다.");
            break;
          case "auth/invalid-email":
            setError("올바른 이메일 형식이 아닙니다.");
            break;
          case "auth/invalid-credential":
            setError("입력하신 계정 정보가 올바르지 않습니다.");
            break;
          default:
            setError("로그인 중 오류가 발생했습니다.");
        }
      }
    } finally {
      setLoadingEmail(false);
    }
  };

  // 구글 로그인 처리
  const handleGoogleLogin = async () => {
    setLoadingGoogle(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider); // 1번만 로그인
      const token = await result.user.getIdToken(); // 토큰 발급

      await fetch("/api/admin/auth/login", {
        // 서버에 토큰 전송
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      localStorage.setItem("sessionStart", new Date().toISOString());
      router.push("/admin"); // 세션 세팅 완료 후 /admin 이동
    } catch (err) {
      const code = err?.code || "";
      switch (code) {
        case "auth/popup-closed-by-user":
          setError("로그인 창이 닫혔습니다. 다시 시도해 주세요.");
          break;
        case "auth/cancelled-popup-request":
          setError("이전 로그인 요청이 진행 중입니다.");
          break;
        case "auth/popup-blocked":
          setError("팝업이 차단되었습니다. 팝업 차단을 해제해 주세요.");
          break;
        default:
          setError("Google 로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <AdminLoginForm
      email={form.email}
      password={form.password}
      confirmPassword={form.confirmPassword}
      onChange={handleChange}
      onSubmit={handleEmailLogin}
      onGoogleLogin={handleGoogleLogin}
      loadingEmail={loadingEmail}
      loadingGoogle={loadingGoogle}
      error={error}
      passwordMatchError={passwordMatchError}
      emailErrorId={emailErrorId}
      passwordErrorId={passwordErrorId}
      passwordMatchErrorId={passwordMatchErrorId}
    />
  );
}
