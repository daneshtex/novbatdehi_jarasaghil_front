import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyCode as verifyCodeApi, sendCode as resendCodeApi } from '../api';
import { getErrorMessage } from '../../../shared/api/http';
import { useMutation } from '@tanstack/react-query';
import Button from '../../../shared/ui/Button';
import FormError from '../../../shared/ui/FormError';
import { useAppDispatch } from '../../../store/hooks';
import { setSession } from '../../../store/slices/sessionSlice';

type LocationState = { mobile?: string };

export default function OtpPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { mobile } = (state || {}) as LocationState;

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mobile) navigate('/auth/phone', { replace: true });
  }, [mobile, navigate]);

  const verifyMutation = useMutation({
    mutationFn: ({ m, c }: { m: string; c: string }) => verifyCodeApi(m, c),
  });

  const resendMutation = useMutation({
    mutationFn: (m: string) => resendCodeApi(m),
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\d{4,6}$/.test(code)) {
      setError('کد تایید معتبر نیست');
      return;
    }
    try {
      setLoading(true);
      const result = await verifyMutation.mutateAsync({ m: mobile as string, c: code });
      if (result && (result as any).token) {
        dispatch(setSession({ token: (result as any).token, mobile: mobile as string }));
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!mobile) return;
    setError(null);
    try {
      await resendMutation.mutateAsync(mobile as string);
    } catch (err) {
      setError(getErrorMessage(err));
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm8 0a8 8 0 11-16 0 8 8 0 0116 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">تایید کد</h1>
            <p className="text-gray-300">کد ارسال شده به {mobile}</p>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200 mb-2">کد تایید</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105-.895-2-2-2s-2 .895-2 2 .895 2 2 2 2-.895 2-2z" />
                  </svg>
                </div>
                <input
                  dir="ltr"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="1234"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full pl-4 pr-10 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>
            </div>

            <FormError message={error} />

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              تایید
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button onClick={handleResend} className="text-blue-400 hover:text-cyan-300 font-medium transition-colors duration-200">
              ارسال مجدد کد
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 11-2 0V7zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-gray-300">اگر کد را دریافت نکردید، روی «ارسال مجدد کد» کلیک کنید</p>
          </div>
        </div>
      </div>
    </div>
  );
}


