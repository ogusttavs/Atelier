import {Suspense, startTransition, useEffect, useState} from 'react';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import SalesPage from './components/SalesPage';
import {lazyWithPreload} from './utils/lazyWithPreload';

const KIWIFY_CHECKOUT_URL = import.meta.env.VITE_KIWIFY_CHECKOUT_URL || 'https://pay.kiwify.com.br/avY1khc';
const LoginPage = lazyWithPreload(() => import('./components/LoginPage'));
const MemberArea = lazyWithPreload(() => import('./components/MemberArea'));
const ThankYouPage = lazyWithPreload(() => import('./components/ThankYouPage'));

type View = 'member' | 'sales' | 'thankyou' | 'login';

function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function getViewFromPath(pathname: string): View {
  const normalized = normalizePath(pathname);

  if (normalized === '/login') return 'login';
  if (normalized === '/obrigado' || normalized === '/thank-you' || normalized === '/obrigado-operacao-pascoa') return 'thankyou';
  if (normalized === '/member' || normalized === '/members' || normalized === '/area-de-membros') return 'member';
  return 'sales';
}

function getPathForView(view: View): string {
  if (view === 'login') return '/login';
  if (view === 'member') return '/member';
  if (view === 'thankyou') return '/obrigado';
  return '/';
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-[#D16075]/30 border-t-[#D16075] rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const {isAuthenticated, isLoading, logout} = useAuth();
  const [view, setView] = useState<View>(() => getViewFromPath(window.location.pathname));

  const navigateTo = (nextView: View, replace = false) => {
    const nextPath = getPathForView(nextView);
    startTransition(() => {
      setView(nextView);
    });

    if (normalizePath(window.location.pathname) === nextPath) return;

    if (replace) {
      window.history.replaceState({}, '', nextPath);
    } else {
      window.history.pushState({}, '', nextPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      startTransition(() => {
        setView(getViewFromPath(window.location.pathname));
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const preloadSecondaryRoutes = () => {
      LoginPage.preload();
      ThankYouPage.preload();

      if (isAuthenticated) {
        MemberArea.preload();
      }
    };

    const requestIdle = window.requestIdleCallback?.bind(window);
    const cancelIdle = window.cancelIdleCallback?.bind(window);

    if (requestIdle && cancelIdle) {
      const idleId = requestIdle(preloadSecondaryRoutes, {timeout: 1200});
      return () => cancelIdle(idleId);
    }

    const timeoutId = window.setTimeout(preloadSecondaryRoutes, 600);
    return () => window.clearTimeout(timeoutId);
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLoading) return;

    const requestedView = getViewFromPath(window.location.pathname);
    const resolvedView =
      requestedView === 'member' && !isAuthenticated
        ? 'login'
        : requestedView === 'login' && isAuthenticated
          ? 'member'
          : requestedView;

    startTransition(() => {
      setView(resolvedView);
    });

    const resolvedPath = getPathForView(resolvedView);
    if (normalizePath(window.location.pathname) !== resolvedPath) {
      window.history.replaceState({}, '', resolvedPath);
    }
  }, [isAuthenticated, isLoading]);

  const goToLogin = () => navigateTo('login');
  const preloadLogin = () => {
    LoginPage.preload();
  };

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

  if (isLoading && view !== 'sales' && view !== 'thankyou') {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#4A3338] font-sans selection:bg-[#E295A3] selection:text-white">
      {view === 'sales' && (
        <SalesPage
          onBuy={handleBuy}
          onAccessMember={goToLogin}
          onPreloadLogin={preloadLogin}
        />
      )}
      {view === 'thankyou' && (
        <Suspense fallback={<PageLoader />}>
          <ThankYouPage
            onGoToLogin={goToLogin}
            onGoToSales={() => navigateTo('sales')}
          />
        </Suspense>
      )}
      {view === 'login' && (
        <Suspense fallback={<PageLoader />}>
          <LoginPage
            onSuccess={() => navigateTo('member', true)}
            onGoToSales={() => navigateTo('sales')}
            checkoutUrl={KIWIFY_CHECKOUT_URL}
          />
        </Suspense>
      )}
      {view === 'member' && (
        isAuthenticated ? (
          <Suspense fallback={<PageLoader />}>
            <MemberArea onLogout={handleLogout} />
          </Suspense>
        ) : (
          <Suspense fallback={<PageLoader />}>
            <LoginPage
              onSuccess={() => navigateTo('member', true)}
              onGoToSales={() => navigateTo('sales')}
              checkoutUrl={KIWIFY_CHECKOUT_URL}
            />
          </Suspense>
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
