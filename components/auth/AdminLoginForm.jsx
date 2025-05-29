import ErrorMessage from "@/components/auth/ErrorMessage";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock } from "react-icons/fi";
import ButtonSpinner from "@/components/common/ButtonSpinner";

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
          <input
            type="email"
            placeholder="이메일"
            required
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
          />
          <FiMail className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={password}
            onChange={(e) => onChange("password", e.target.value)}
          />
          <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="relative">
          <input
            type="password"
            placeholder="비밀번호 확인"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
            value={confirmPassword}
            onChange={(e) => onChange("confirmPassword", e.target.value)}
          />
          <FiLock className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
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

        {passwordMatchError && <ErrorMessage message={passwordMatchError} />}
        {error && <ErrorMessage message={error} />}
      </div>
    </form>
  );
}
