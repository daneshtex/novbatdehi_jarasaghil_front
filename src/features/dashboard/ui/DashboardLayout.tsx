import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="h-14 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white flex items-center justify-between px-4 sticky top-0 z-40 shadow-lg">
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen((v) => !v)}
            className="flex items-center gap-3 focus:outline-none"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
          >
            <div className="hidden md:block text-sm text-white">خوش آمدید</div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">A</div>
          </button>
          {userMenuOpen && (
            <div
              dir="rtl"
              className="absolute right-2 md:right-auto md:left-4 top-12 w-[90vw] max-w-[90vw] md:w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-right overflow-auto max-h-[60vh]"
            >
              <button className="w-full flex flex-row-reverse items-center gap-2 justify-end text-right pr-3 pl-3 py-3 md:py-2 text-base md:text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                <span>مشاهده پروفایل</span>
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
              <button className="w-full flex flex-row-reverse items-center gap-2 justify-end text-right pr-3 pl-3 py-3 md:py-2 text-base md:text-sm text-red-600 hover:bg-red-50" onClick={() => setUserMenuOpen(false)}>
                <span>خروج</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"/></svg>
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 justify-end text-right">
          <Link to="/dashboard" className="font-bold tracking-tight">پنل مدیریت</Link>
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
            aria-label="toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </header>

      <div className="flex flex-row-reverse relative">
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
            `bg-gradient-to-b from-blue-700 via-blue-600 to-cyan-600 text-white z-40
            md:sticky md:top-14 md:min-h-[calc(100vh-56px)]
            md:translate-x-0 md:shadow-xl
            fixed top-14 right-0 h-[calc(100vh-56px)] shadow-2xl
            transition-transform duration-200 ease-in-out
            ${open ? 'translate-x-0' : 'translate-x-full'}
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
                  `flex flex-row-reverse items-center gap-3 justify-end text-right px-3 py-2 mx-2 my-1 rounded-lg text-sm 
                   hover:bg سفید/10 transition-colors ${isActive ? 'bg-white/20 ring-1 ring-white/20 text-white' : 'text-white/90'}`
                )}
                title={it.label}
                onClick={handleNavClick}
              >
                {open && <span className="truncate">{it.label}</span>}
                <span className="inline-flex w-6 justify-center text-white">{it.icon}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


