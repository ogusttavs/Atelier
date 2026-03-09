import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SalesPage from './components/SalesPage';
import LoginPage from './components/LoginPage';
import MemberArea from './components/MemberArea';

const KIWIFY_CHECKOUT_URL = import.meta.env.VITE_KIWIFY_CHECKOUT_URL || 'https://pay.kiwify.com.br/avY1khc';

type View = 'sales' | 'login' | 'member';

function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function getViewFromPath(pathname: string): View {
  const normalized = normalizePath(pathname);

  if (normalized === '/login') return 'login';
  if (normalized === '/member' || normalized === '/members' || normalized === '/area-de-membros') return 'member';
  return 'sales';
}

function getPathForView(view: View): string {
  if (view === 'login') return '/login';
  if (view === 'member') return '/member';
  return '/';
}

function AppContent() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [view, setView] = useState<View>(() => getViewFromPath(window.location.pathname));

  const navigateTo = (nextView: View, replace = false) => {
    const nextPath = getPathForView(nextView);
    setView(nextView);

    if (normalizePath(window.location.pathname) === nextPath) return;

    if (replace) {
      window.history.replaceState({}, '', nextPath);
    } else {
      window.history.pushState({}, '', nextPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setView(getViewFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const requestedView = getViewFromPath(window.location.pathname);
    const resolvedView =
      requestedView === 'member' && !isAuthenticated
        ? 'login'
        : requestedView === 'login' && isAuthenticated
          ? 'member'
          : requestedView;

    setView(resolvedView);

    const resolvedPath = getPathForView(resolvedView);
    if (normalizePath(window.location.pathname) !== resolvedPath) {
      window.history.replaceState({}, '', resolvedPath);
    }
  }, [isAuthenticated, isLoading]);

  const goToLogin = () => navigateTo('login');

  const handleBuy = () => {
    if (KIWIFY_CHECKOUT_URL.startsWith('http')) {
      window.open(KIWIFY_CHECKOUT_URL, '_blank');
    } else {
      navigateTo('login');
    }
  };

  const handleLogout = () => {
    logout();
    navigateTo('sales', true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#D16075]/30 border-t-[#D16075] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#4A3338] font-sans selection:bg-[#E295A3] selection:text-white">
      {view === 'sales' && (
        <SalesPage
          onBuy={handleBuy}
          onAccessMember={goToLogin}
        />
      )}
      {view === 'login' && (
        <LoginPage
          onSuccess={() => navigateTo('member', true)}
          onGoToSales={() => navigateTo('sales')}
          checkoutUrl={KIWIFY_CHECKOUT_URL}
        />
      )}
      {view === 'member' && (
        isAuthenticated ? (
          <MemberArea onLogout={handleLogout} />
        ) : (
          <LoginPage
            onSuccess={() => navigateTo('member', true)}
            onGoToSales={() => navigateTo('sales')}
            checkoutUrl={KIWIFY_CHECKOUT_URL}
          />
        )
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
