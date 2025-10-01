import { useAppSelector } from '../../store/hooks';
import { Navigate, useLocation } from 'react-router-dom';

type Props = { children: React.ReactNode };

export default function RequireAuth({ children }: Props) {
  const token = useAppSelector((s) => s.session.token);
  const location = useLocation();
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}


