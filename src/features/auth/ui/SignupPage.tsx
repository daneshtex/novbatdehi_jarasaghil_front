import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signup as signupApi } from '../api';
import { getErrorMessage } from '../../../shared/api/http';
import TextInput from '../../../shared/ui/TextInput';
import Button from '../../../shared/ui/Button';
import FormError from '../../../shared/ui/FormError';

type LocationState = {
  mobile?: string;
};

export default function SignupPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { mobile } = (state || {}) as LocationState;

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || password.length < 6) {
      setError('نام را وارد کنید و رمز حداقل ۶ کاراکتر باشد');
      return;
    }
    try {
      setLoading(true);
      await signupApi({ mobile: mobile as string, name, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">تکمیل ثبت‌نام</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="نام"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div>
          <label className="block mb-1 text-sm">رمز عبور</label>
          <TextInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <FormError message={error} />
        <Button type="submit" loading={loading} className="bg-green-600">ثبت‌نام</Button>
      </form>
    </div>
  );
}


