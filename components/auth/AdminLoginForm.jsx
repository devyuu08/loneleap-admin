import ErrorMessage from "@/components/common/feedback/ErrorMessage";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import ButtonSpinner from "@/components/common/loading/ButtonSpinner";
import FormInput from "@/components/common/form/FormInput";

/**
 * AdminLoginForm
 * - LoneLeap 관리자 페이지 로그인 폼
 * - 이메일/비밀번호 로그인 + 구글 로그인 지원
 * - 입력 오류 및 로딩 상태 처리 포함
 */

export default function AdminLoginForm({
  email,
  password,
  confirmPassword,
  onChange,
  onSubmit,
  onGoogleLogin,
  loadingEmail,
  loadingGoogle,
  error,
  passwordMatchError,
  emailErrorId,
  passwordErrorId,
  passwordMatchErrorId,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
    >
      {/* 로그인 설명 영역 */}
      <header className="flex flex-col items-center mb-6 text-center">
        <div className="text-3xl">🔐</div>
        <h1 className="text-xl font-bold mt-2">관리자 로그인</h1>
        <p className="text-sm text-gray-500 mt-1">
          리뷰와 오픈채팅, LoneLeap의 소중한 공간을 지켜주세요.
        </p>
      </header>

      {/* 입력 필드 영역 */}
      <fieldset className="space-y-4">
        {/* 이메일 입력 */}
        <div className="relative">
          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            error={error?.includes("이메일") ? error : ""}
            icon={<FiMail className="w-4 h-4" />}
            ariaDescribedBy={emailErrorId}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="relative">
          <FormInput
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => onChange("password", e.target.value)}
            error={error?.includes("비밀번호") ? error : ""}
            icon={<FiLock className="w-4 h-4" />}
            ariaDescribedBy={passwordErrorId}
          />
        </div>

        {/* 비밀번호 확인 입력 */}
        <div className="relative">
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            icon={<FiLock className="w-4 h-4" />}
            ariaDescribedBy={passwordMatchErrorId}
          />
        </div>
      </fieldset>

      {/* 로그인 버튼 */}
      <div className="mt-6">
        <button
          type="submit"
          disabled={loadingEmail || loadingGoogle}
          className="w-full h-11 bg-gray-900 text-white py-2 rounded-md font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
        >
          {loadingEmail ? <ButtonSpinner /> : "로그인"}
        </button>
      </div>

      {/* 또는 구글 로그인 */}
      <div className="text-center text-sm text-gray-400">또는</div>

      <div className="mt-2">
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={loadingEmail || loadingGoogle}
          className="w-full flex items-center justify-center gap-2 border py-2 rounded-md hover:bg-gray-50 text-sm"
        >
          <FcGoogle className="text-xl" />
          {loadingGoogle ? (
            <ButtonSpinner color="black" />
          ) : (
            "Google 계정으로 로그인"
          )}
        </button>
      </div>

      {/* 오류 메시지 */}
      <div className="mt-4 space-y-2">
        {passwordMatchError && (
          <ErrorMessage message={passwordMatchError} align="center" />
        )}
        {error && <ErrorMessage message={error} align="center" />}
      </div>
    </form>
  );
}
