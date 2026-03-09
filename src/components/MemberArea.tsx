import { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calculator, TrendingUp, LogOut, Heart } from 'lucide-react';
import EasterGuide from './EasterGuide';
import PricingCalculator from './PricingCalculator';
import SalesStrategies from './SalesStrategies';

interface MemberAreaProps {
  onLogout: () => void;
}

export default function MemberArea({ onLogout }: MemberAreaProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'calculator' | 'strategies'>('guide');

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col md:flex-row pb-20 md:pb-0">
      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 bg-[#4A3338] text-[#FFF5F7] flex-col shadow-xl z-10 sticky top-0 h-screen">
        <div className="p-6 border-b border-[#5E4249]">
          <h1 className="text-xl font-bold text-[#E295A3] flex items-center gap-2">
            <Heart size={18} className="text-[#D16075]" /> Atelier 21
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Operação Páscoa Lucrativa</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab('guide')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
              activeTab === 'guide' 
                ? 'bg-[#D16075] text-white font-semibold shadow-md' 
                : 'hover:bg-[#5E4249] text-gray-300'
            }`}
          >
            <BookOpen size={20} />
            <span>O que vender?</span>
          </button>
          
          <button
            onClick={() => setActiveTab('calculator')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
              activeTab === 'calculator' 
                ? 'bg-[#D16075] text-white font-semibold shadow-md' 
                : 'hover:bg-[#5E4249] text-gray-300'
            }`}
          >
            <Calculator size={20} />
            <span>Precificação</span>
          </button>
          
          <button
            onClick={() => setActiveTab('strategies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
              activeTab === 'strategies' 
                ? 'bg-[#D16075] text-white font-semibold shadow-md' 
                : 'hover:bg-[#5E4249] text-gray-300'
            }`}
          >
            <TrendingUp size={20} />
            <span>20 Estratégias</span>
          </button>
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

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#4A3338] text-white flex justify-around items-center p-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] pb-safe">
        <button 
          onClick={() => setActiveTab('guide')} 
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'guide' ? 'text-[#E295A3]' : 'text-gray-400'}`}
        >
          <BookOpen size={22} />
          <span className="text-[10px] mt-1 font-medium">Cardápio</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('calculator')} 
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'calculator' ? 'text-[#E295A3]' : 'text-gray-400'}`}
        >
          <Calculator size={22} />
          <span className="text-[10px] mt-1 font-medium">Preços</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('strategies')} 
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'strategies' ? 'text-[#E295A3]' : 'text-gray-400'}`}
        >
          <TrendingUp size={22} />
          <span className="text-[10px] mt-1 font-medium">Vendas</span>
        </button>

        <button 
          onClick={onLogout} 
          className="flex flex-col items-center p-2 text-gray-400 hover:text-white transition-colors"
        >
          <LogOut size={22} />
          <span className="text-[10px] mt-1 font-medium">Sair</span>
        </button>
      </nav>

      {/* Mobile Header (Hidden on Desktop) */}
      <header className="md:hidden bg-[#4A3338] text-white p-4 flex flex-col items-center justify-center shadow-md sticky top-0 z-40">
        <h1 className="text-lg font-bold text-[#E295A3] flex items-center gap-2">
          <Heart size={16} className="text-[#D16075]" /> Atelier 21
        </h1>
        <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">Operação Páscoa Lucrativa</p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          {activeTab === 'guide' && <EasterGuide />}
          {activeTab === 'calculator' && <PricingCalculator />}
          {activeTab === 'strategies' && <SalesStrategies />}
        </motion.div>
      </main>
    </div>
  );
}
