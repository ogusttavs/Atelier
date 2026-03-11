import {Suspense, startTransition, useEffect, useState} from 'react';
import {AuthProvider, useAuth} from './contexts/AuthContext';
import EasterCountdownBar from './components/EasterCountdownBar';
import SalesPage from './components/SalesPage';
import {trackMetaPageView} from './lib/metaPixel';
import {lazyWithPreload} from './utils/lazyWithPreload';

const KIWIFY_CHECKOUT_URL = import.meta.env.VITE_KIWIFY_CHECKOUT_URL || 'https://pay.kiwify.com.br/avY1khc';
const AdminDashboardPage = lazyWithPreload(() => import('./components/AdminDashboardPage'));
const LoginPage = lazyWithPreload(() => import('./components/LoginPage'));
const MemberArea = lazyWithPreload(() => import('./components/MemberArea'));
const ThankYouPage = lazyWithPreload(() => import('./components/ThankYouPage'));

type View = 'admin' | 'member' | 'sales' | 'thankyou' | 'login';

function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

function getViewFromPath(pathname: string): View {
  const normalized = normalizePath(pathname);

  if (normalized === '/admin' || normalized === '/painel' || normalized === '/painel-clientes') return 'admin';
  if (normalized === '/login') return 'login';
  if (normalized === '/obrigado' || normalized === '/thank-you' || normalized === '/obrigado-operacao-pascoa') return 'thankyou';
  if (normalized === '/member' || normalized === '/members' || normalized === '/area-de-membros') return 'member';
  return 'sales';
}

function getPathForView(view: View): string {
  if (view === 'admin') return '/admin';
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
  const showCountdown = view !== 'admin';

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
    if (!isAuthenticated) return;
    MemberArea.preload();
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

  useEffect(() => {
    trackMetaPageView();
  }, [view]);

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

  if (isLoading && view !== 'sales' && view !== 'thankyou' && view !== 'admin') {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#FFF5F7] text-[#4A3338] font-sans selection:bg-[#E295A3] selection:text-white">
      {showCountdown && <EasterCountdownBar />}
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
      {view === 'admin' && (
        <Suspense fallback={<PageLoader />}>
          <AdminDashboardPage onGoToSales={() => navigateTo('sales')} />
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
