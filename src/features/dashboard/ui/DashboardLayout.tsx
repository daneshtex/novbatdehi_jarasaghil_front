import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../store/hooks';
import { clearSession } from '../../../store/slices/sessionSlice';
import { APP_NAME } from '../../../shared/config/app';

type SidebarItem = {
  label: string;
  to: string;
  icon?: ReactNode;
};

const items: SidebarItem[] = [
  { label: 'نمای کلی', to: '/dashboard', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3M9 21h6"/></svg>) },
  { label: 'کاربران', to: '/dashboard/users', icon: (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-6a4 4 0 11-8 0 4 4 0 018 0m10 4a4 4 0 11-8 0 4 4 0 018 0"/></svg>) },
  { label: 'سفارش‌ها', to: '/dashboard/orders', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H6.4M7 13L5.4 5M7 13l-2 9m12-9l2 9M9 22a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"/>
    </svg>
  ) },
];

export default function DashboardLayout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!userMenuRef.current) return;
      const target = e.target as Node;
      if (!userMenuRef.current.contains(target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (isMobile()) {
      document.body.style.overflow = open ? 'hidden' : '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleToggleSidebar = () => {
    setOpen((v) => !v);
  };

  const handleNavClick = () => {
    if (isMobile()) setOpen(false);
  };

  const handleLogout = () => {
    console.log(`${APP_NAME}: Logout button clicked - clearing session`);
    dispatch(clearSession());
    navigate('/');
    setUserMenuOpen(false);
    console.log(`${APP_NAME}: Logout completed - redirected to home`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800" dir="rtl">
      <header className="h-14 bg-gradient-to-r from-blue-600 to-blue-800 text-white flex items-center justify-between px-4 sticky top-0 z-50 shadow-lg">
        {/* Navbar Toggle Button - Left Side */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
            aria-label="toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <Link to="/dashboard" className="font-bold tracking-tight text-white hover:text-white/80 transition-colors">{APP_NAME}</Link>
        </div>

        {/* Profile Component - Right Side */}
        <div ref={userMenuRef} className="relative z-50">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-3 focus:outline-none hover:bg-white/10 rounded-lg px-2 py-1 transition-all duration-200"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              A
            </div>
            <div className="hidden md:block">
              <div className="text-sm font-medium text-white">احمد محمدی</div>
              <div className="text-xs text-white/80">مدیر سیستم</div>
            </div>
            <svg className="w-4 h-4 text-white/70 transition-transform duration-200" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* Beautiful Profile Dropdown */}
          {userMenuOpen && (
            <div
              dir="rtl"
              className="absolute left-0 top-14 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl py-4 text-right overflow-hidden backdrop-blur-sm bg-white/95 z-50"
            >
              {/* Profile Header */}
              <div className="px-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    A
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">احمد محمدی</h3>
                    <p className="text-sm text-gray-600">مدیر سیستم</p>
                    <p className="text-xs text-gray-500 mt-1">ahmad@example.com</p>
                  </div>
                </div>
              </div>
              
              {/* Profile Actions */}
              <div className="px-2 py-2">
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-right text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">مشاهده پروفایل</span>
                </button>
                
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-right text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">تنظیمات</span>
                </button>
              </div>
              
              {/* Logout Button */}
              <div className="px-2 pt-2 border-t border-gray-100">
                <button 
                  className="w-full flex items-center gap-3 px-4 py-3 text-right text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
                  </svg>
                  <span className="font-medium">خروج از سیستم</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex relative">
        {open && (
          <div
            className="fixed inset-0 top-14 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}

        <aside
          dir="rtl"
          className={
            `bg-gradient-to-b from-blue-700 to-blue-900 text-white z-40
            md:sticky md:top-14 md:min-h-[calc(100vh-56px)]
            md:translate-x-0 md:shadow-xl
            fixed top-14 left-0 h-[calc(100vh-56px)] shadow-2xl
            transition-transform duration-200 ease-in-out
            ${open ? 'translate-x-0' : '-translate-x-full'}
            ${open ? 'w-64' : 'md:w-16'}
            `
          }
        > 
          <nav className="py-3">
            {open && (
              <div className="px-3 pb-2 mb-2 border-b border-white/10">
                <div className="text-sm opacity-80">ناوبری</div>
              </div>
            )}
            {items.map((it) => (
              <NavLink
                key={it.to}
                to={it.to}
                end={it.to === '/dashboard'}
                className={({ isActive }) => (
                  `flex items-center gap-3 justify-start text-right px-3 py-2 mx-2 my-1 rounded-lg text-sm 
                   hover:bg-white/10 transition-colors ${isActive ? 'bg-white/20 ring-1 ring-white/20 text-white' : 'text-white/90'}`
                )}
                title={it.label}
                onClick={handleNavClick}
              >
                <span className="inline-flex w-6 justify-center text-white">{it.icon}</span>
                {open && <span className="truncate">{it.label}</span>}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6" dir="rtl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


