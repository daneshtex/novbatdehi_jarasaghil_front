import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signup as signupApi } from '../api';
import { getErrorMessage } from '../../../shared/api/http';
import TextInput from '../../../shared/ui/TextInput';
import Button from '../../../shared/ui/Button';
import FormError from '../../../shared/ui/FormError';
import { APP_NAME } from '../../../shared/config/app';

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
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{APP_NAME}</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">تکمیل ثبت‌نام</h2>
        <p className="text-gray-600">اطلاعات خود را تکمیل کنید</p>
      </div>
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
        <Button type="submit" loading={loading} className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">ثبت‌نام</Button>
      </form>
    </div>
  );
}


