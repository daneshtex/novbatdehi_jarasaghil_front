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
      <h1 className="text-2xl font-bold mb-6 text-center">ورود با شماره موبایل</h1>
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
        <Button type="submit" loading={loading}>ارسال کد تایید</Button>
      </form>
    </div>
  );
}


