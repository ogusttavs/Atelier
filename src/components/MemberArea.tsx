import {Suspense, startTransition, useEffect, useState} from 'react';
import {BookOpen, Calculator, LogOut, TrendingUp} from 'lucide-react';
import {lazyWithPreload} from '../utils/lazyWithPreload';
import BrandMark from './BrandMark';

interface MemberAreaProps {
  onLogout: () => void;
}

type TabId = 'guide' | 'calculator' | 'strategies';

const EasterGuide = lazyWithPreload(() => import('./EasterGuide'));
const PricingCalculator = lazyWithPreload(() => import('./PricingCalculator'));
const SalesStrategies = lazyWithPreload(() => import('./SalesStrategies'));

const TAB_COMPONENTS = {
  guide: EasterGuide,
  calculator: PricingCalculator,
  strategies: SalesStrategies,
} satisfies Record<TabId, typeof EasterGuide>;

const TAB_ITEMS = [
  {id: 'guide', label: 'O que vender', mobileLabel: 'Cardápio', icon: BookOpen},
  {id: 'calculator', label: 'Quanto cobrar', mobileLabel: 'Preço', icon: Calculator},
  {id: 'strategies', label: 'Como vender', mobileLabel: 'Vendas', icon: TrendingUp},
] satisfies Array<{
  icon: typeof BookOpen;
  id: TabId;
  label: string;
  mobileLabel: string;
}>;

function ContentLoader() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-[#E295A3]/20 min-h-[18rem] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#D16075]/30 border-t-[#D16075] rounded-full animate-spin" />
      </div>
    </div>
  );
}

export default function MemberArea({onLogout}: MemberAreaProps) {
  const [activeTab, setActiveTab] = useState<TabId>('guide');
  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  useEffect(() => {
    const preloadExtraTabs = () => {
      PricingCalculator.preload();
      SalesStrategies.preload();
    };

    const requestIdle = window.requestIdleCallback?.bind(window);
    const cancelIdle = window.cancelIdleCallback?.bind(window);

    if (requestIdle && cancelIdle) {
      const idleId = requestIdle(preloadExtraTabs, {timeout: 1500});
      return () => cancelIdle(idleId);
    }

    const timeoutId = window.setTimeout(preloadExtraTabs, 800);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleTabChange = (nextTab: TabId) => {
    TAB_COMPONENTS[nextTab].preload();
    startTransition(() => {
      setActiveTab(nextTab);
    });
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col md:flex-row pb-20 md:pb-0">
      <aside className="hidden md:flex w-64 bg-[#4A3338] text-[#FFF5F7] flex-col shadow-xl z-10 sticky top-0 h-screen">
        <div className="p-6 border-b border-[#5E4249]">
          <h1 className="text-xl font-bold text-[#E295A3] flex items-center gap-2">
            <BrandMark className="h-[18px] w-[18px]" decorative /> Atelier 21
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Operação Páscoa Lucrativa</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {TAB_ITEMS.map(({id, icon: Icon, label}) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              onMouseEnter={() => TAB_COMPONENTS[id].preload()}
              onFocus={() => TAB_COMPONENTS[id].preload()}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                activeTab === id
                  ? 'bg-[#D16075] text-white font-semibold shadow-md'
                  : 'hover:bg-[#5E4249] text-gray-300'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#5E4249]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#5E4249] text-gray-300 transition-all text-left"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#4A3338] text-white flex justify-around items-center p-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] pb-safe">
        {TAB_ITEMS.map(({id, icon: Icon, mobileLabel}) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`flex flex-col items-center p-2 transition-colors ${
              activeTab === id ? 'text-[#E295A3]' : 'text-gray-400'
            }`}
          >
            <Icon size={22} />
            <span className="text-[10px] mt-1 font-medium">{mobileLabel}</span>
          </button>
        ))}

        <button
          onClick={onLogout}
          className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={22} />
          <span className="text-[10px] mt-1 font-medium">Sair</span>
        </button>
      </nav>

      <header className="md:hidden bg-[#4A3338] text-white p-4 flex flex-col items-center justify-center shadow-md sticky top-0 z-40">
        <h1 className="text-lg font-bold text-[#E295A3] flex items-center gap-2">
          <BrandMark className="h-4 w-4" decorative /> Atelier 21
        </h1>
        <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Operação Páscoa Lucrativa</p>
      </header>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12">
        <div className="reveal-up">
          <Suspense fallback={<ContentLoader />}>
            <ActiveTabComponent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
