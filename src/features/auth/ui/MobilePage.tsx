import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../../shared/api/http';
import { sendCode } from '../api';
import TextInput from '../../../shared/ui/TextInput';
import Button from '../../../shared/ui/Button';
import FormError from '../../../shared/ui/FormError';
import { normalizeIranMobile } from '../../../shared/lib/phone';
import { useAppDispatch } from '../../../store/hooks';
import { setSession } from '../../../store/slices/sessionSlice';
import { APP_NAME } from '../../../shared/config/app';

export default function MobilePage() {
  const dispatch = useAppDispatch();
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalized = normalizeIranMobile(mobile);
    if (!/^0?9\d{9}$/.test(normalized)) {
      setError('شماره موبایل معتبر نیست');
      return;
    }

    try {
      setLoading(true);
      await sendCode(normalized);
      dispatch(setSession({ token: null, mobile: normalized }));
      navigate('/auth/otp', { state: { mobile: normalized } });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{APP_NAME}</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">ورود با شماره موبایل</h2>
        <p className="text-gray-600">شماره موبایل خود را وارد کنید</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="شماره موبایل"
          dirLtr
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="09XXXXXXXXX"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <FormError message={error} />
        <Button type="submit" loading={loading} className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">ارسال کد تایید</Button>
      </form>
    </div>
  );
}


