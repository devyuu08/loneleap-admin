import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import ErrorMessage from "@/components/auth/ErrorMessage";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import InlineSpinner from "@/components/common/InlineSpinner";

export default function AdminLoginForm({ errorMessage }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const [emailLoginLoading, setEmailLoginLoading] = useState(false);
  const [googleLoginLoading, setGoogleLoginLoading] = useState(false);

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

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    // 기본 유효성 검사
    if (!email.trim()) return setError("이메일을 입력해주세요.");
    if (!password) return setError("비밀번호를 입력해주세요.");
    if (password !== confirmPassword) {
      setPasswordMatchError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setEmailLoginLoading(true);
    setError("");
    setPasswordMatchError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();

      await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      localStorage.setItem("sessionStart", new Date().toISOString());
      router.push("/admin");
    } catch (err) {
      // 외부 errorMessage가 없을 때만 setError 실행
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
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoginLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider); // 1번만 로그인
      const token = await result.user.getIdToken(); // 토큰 발급

      await fetch("/api/admin/login", {
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
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleAdminLogin}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
    >
      <div className="flex flex-col items-center mb-6">
        <div className="text-3xl">🔐</div>
        <h2 className="text-xl font-bold mt-2">관리자 로그인</h2>
        <p className="text-sm text-gray-500 mt-1">
          리뷰와 오픈채팅, LoneLeap의 소중한 공간을 지켜주세요.
        </p>
      </div>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="email"
            placeholder="이메일"
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        <button
          type="submit"
          disabled={emailLoginLoading || googleLoginLoading}
          className="w-full h-11 bg-gray-900 text-white py-2 rounded-md font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
        >
          {emailLoginLoading ? (
            <>
              로그인 중...
              <InlineSpinner size="sm" color="white" />
            </>
          ) : (
            "로그인"
          )}
        </button>

        <div className="text-center text-sm text-gray-400">또는</div>

        <button
          onClick={handleGoogleLogin}
          disabled={emailLoginLoading || googleLoginLoading}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-50 text-sm"
        >
          <FcGoogle className="text-xl" />
          {googleLoginLoading ? (
            <>
              로그인 중...
              <InlineSpinner size="sm" />
            </>
          ) : (
            "Google 계정으로 로그인"
          )}
        </button>
      </div>
      {passwordMatchError && <ErrorMessage message={passwordMatchError} />}
      {error && <ErrorMessage message={error} />}
      <div className="mt-6 text-center text-sm text-gray-400">
        비밀번호를 잊으셨나요?
      </div>
      {/* 비밀번호 재설정 기능이 구현되면 아래 코드로 대체 */}{" "}
      {/* <div className="mt-6 text-center text-sm">
        <button 
          type="button"
          onClick={handlePasswordReset}
          className="text-gray-500 hover:text-gray-700"
        >
          비밀번호를 잊으셨나요?
        </button>
     </div> */}
    </form>
  );
}
