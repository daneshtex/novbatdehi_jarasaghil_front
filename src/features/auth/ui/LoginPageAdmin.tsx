import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../../shared/api/http";
import { sendCode, loginWithPassword } from "../api";
import { useAppDispatch } from "../../../store/hooks";
import { setSession } from "../../../store/slices/sessionSlice";
import Button from "../../../shared/ui/Button";
import FormError from "../../../shared/ui/FormError";
import { normalizeIranMobile } from "../../../shared/lib/phone";
import { useMutation } from "@tanstack/react-query";
import { APP_NAME } from "../../../shared/config/app";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loginMode, setLoginMode] = useState<"otp" | "password">("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendCodeMutation = useMutation({
    mutationFn: (m: string) => sendCode(m),
  });

  const passwordLoginMutation = useMutation({
    mutationFn: ({ mobile, password }: { mobile: string; password: string }) =>
      loginWithPassword(mobile, password),
  });

  const handleModeChange = (mode: "otp" | "password") => {
    setLoginMode(mode);
    setError(null);
    if (mode === "otp") {
      setPassword(""); // Clear password when switching to OTP mode
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalized = normalizeIranMobile(mobile);

    if (import.meta.env?.MODE !== "production") {
      // eslint-disable-next-line no-console
      console.log(
        `[${APP_NAME} Login Submit] rawMobile:`,
        mobile,
        "normalized:",
        normalized,
        "mode:",
        loginMode
      );
    }

    if (!/^0?9\d{9}$/.test(normalized)) {
      setError("شماره موبایل معتبر نیست");
      return;
    }

    if (loginMode === "password" && !password.trim()) {
      setError("رمز عبور را وارد کنید");
      return;
    }

    try {
      setLoading(true);

      if (loginMode === "otp") {
        if (import.meta.env?.MODE !== "production") {
          // eslint-disable-next-line no-console
          console.log(`[${APP_NAME} OTP Login Request] payload:`, {
            mobile: normalized,
          });
        }
        await sendCodeMutation.mutateAsync(normalized);
        dispatch(setSession({ token: null, mobile: normalized }));
        navigate("/auth/otp", { state: { mobile: normalized } });
      } else {
        if (import.meta.env?.MODE !== "production") {
          // eslint-disable-next-line no-console
          console.log(`[${APP_NAME} Password Login Request] payload:`, {
            mobile: normalized,
            password,
          });
        }
        const result = await passwordLoginMutation.mutateAsync({
          mobile: normalized,
          password,
        });

        if (result?.token) {
          dispatch(setSession({ token: result.token, mobile: normalized }));
          navigate("/dashboard");
        } else if (result?.need_signup) {
          navigate("/auth/signup", { state: { mobile: normalized } });
        } else {
          setError("ورود ناموفق. لطفاً اطلاعات را بررسی کنید");
        }
      }
    } catch (err: any) {
      if (import.meta.env?.MODE !== "production") {
        // eslint-disable-next-line no-console
        console.error(`[${APP_NAME} Login Error]`, err);
      }

      if (loginMode === "otp") {
        const status = err?.response?.status;
        const redirect = err?.response?.data?.data?.redirect;
        if (status === 402 && redirect === "otp") {
          navigate("/auth/otp", { state: { mobile: normalized } });
          return;
        }
      }

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 dots-pattern opacity-20"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r 
            from-orange-400 to-orange-600 rounded-2xl mb-4 shadow-lg"
            >
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">{APP_NAME}</h1>
            <h2 className="text-xl font-semibold text-white/90 mb-2">
              ورود ادمین
            </h2>
            <p className="text-gray-300">
              {loginMode === "otp"
                ? "شماره موبایل خود را وارد کنید"
                : "شماره موبایل و رمز عبور خود را وارد کنید"}
            </p>
          </div>

          {/* Login Mode Toggle */}
          <div className="mb-6">
            <div className="flex bg-white/10 rounded-xl p-1">
              <button
                type="button"
                onClick={() => handleModeChange("otp")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loginMode === "otp"
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                ورود با کد تایید
              </button>
              <button
                type="button"
                onClick={() => handleModeChange("password")}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  loginMode === "password"
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                ورود با رمز عبور
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200 mb-2">
                شماره موبایل
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <input
                  dir="ltr"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="09XXXXXXXXX"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full pl-4 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Password Field - Only show in password mode */}
            {loginMode === "password" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  رمز عبور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                </div>
              </div>
            )}

            <FormError message={error} />

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {loading
                ? "در حال ورود..."
                : loginMode === "otp"
                ? "ارسال کد تایید"
                : "ورود به سیستم"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              با ورود به سایت،
              <a
                href="#"
                className="text-blue-400 hover:text-cyan-300 font-medium transition-colors duration-200"
              >
                قوانین و مقررات
              </a>{" "}
              را می‌پذیرید
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-300">
              {loginMode === "otp"
                ? "کد تایید به شماره موبایل شما ارسال خواهد شد"
                : "اطلاعات ورود شما امن نگهداری می‌شود"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
