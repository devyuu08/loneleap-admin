import ErrorMessage from "@/components/common/ErrorMessage";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import ButtonSpinner from "@/components/common/ButtonSpinner";
import FormInput from "@/components/common/FormInput";

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
}) {
  return (
    <form
      onSubmit={onSubmit}
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
          <FormInput
            id="email"
            name="email"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            error={error?.includes("이메일") ? error : ""}
            icon={<FiMail className="w-4 h-4" />}
          />
        </div>

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
          />
        </div>

        <div className="relative">
          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
            icon={<FiLock className="w-4 h-4" />}
          />
        </div>

        <button
          type="submit"
          disabled={loadingEmail || loadingGoogle}
          className="w-full h-11 bg-gray-900 text-white py-2 rounded-md font-semibold hover:bg-gray-800 flex items-center justify-center gap-2"
        >
          {loadingEmail ? <ButtonSpinner /> : "로그인"}
        </button>

        <div className="text-center text-sm text-gray-400">또는</div>

        <button
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

        {passwordMatchError && (
          <ErrorMessage message={passwordMatchError} align="center" />
        )}
        {error && <ErrorMessage message={error} align="center" />}
      </div>
    </form>
  );
}
