import { Suspense, lazy } from 'react'
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthUser from './components/common/authUser';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy-loaded route components — split into separate bundles
const Login = lazy(() => import('./components/Auth/Login'));
const Signup = lazy(() => import('./components/Auth/Signup'));
const Main = lazy(() => import('./components/Cards/Main'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const Logout = lazy(() => import('./components/Signout'));
const AppwriteHealth = lazy(() => import('./components/AppwriteHealth'));
const ApiStatus = lazy(() => import('./components/ApiStatus'));

// Loading fallback for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-xl themeBg flex items-center justify-center pulse-ring">
        <i className="fa-solid fa-spinner text-white animate-spin"></i>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <>
      <ToastContainer />
      <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route index element={<AuthUser authentication={false}><Login /></AuthUser>} />
          <Route path='/signup' element={<AuthUser authentication={false}><Signup /></AuthUser>} />
          <Route path='/card' element={<AuthUser authentication={true}><Main /></AuthUser>} />
          <Route path='/dashboard' element={<AuthUser><Dashboard /></AuthUser>} />
          <Route path='/logout' element={<AuthUser authentication={true}><Logout /></AuthUser>} />
          <Route path='/health' element={<AppwriteHealth />} />
          <Route path='/api/status' element={<ApiStatus />} />
          <Route path="*" element={<AuthUser authentication={false}><Login /></AuthUser>} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
