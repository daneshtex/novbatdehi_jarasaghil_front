import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { authRoutes } from './features/auth/routes';
import { dashboardRoutes } from './features/dashboard/routes';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div style={{minHeight:'100vh'}} className="flex items-center justify-center bg-gray-50 text-gray-600">
          <div className="animate-pulse">در حال بارگذاری…</div>
        </div>
      }>
        <Routes>

          {authRoutes.map((r, i) => (
            <Route key={`auth-${i}`} path={r.path} element={r.element} />
          ))}

          {dashboardRoutes.map((r, i) => (
            <Route key={`dash-${i}`} path={r.path} element={r.element}>
              {r.children?.map((c, j) => (
                <Route key={`dash-child-${j}`} index={c.index} path={c.path} element={c.element} />
              ))}
            </Route>
          ))}

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
