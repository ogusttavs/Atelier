import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface Strategy {
    icon: ReactNode;
    title: string;
    desc: string;
    steps: string[];
}

interface StrategyCardProps {
    strategy: Strategy;
    index: number;
    variant: 'easter' | 'bonus';
}

export default function StrategyCard({ strategy, index, variant }: StrategyCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const bgClass = variant === 'easter'
        ? 'bg-[#FFF5F7] border-[#E295A3]/30'
        : 'bg-gray-50 border-gray-200';

    const iconBgClass = variant === 'easter'
        ? 'bg-[#D16075]/10 text-[#D16075]'
        : 'bg-[#A8576A]/10 text-[#A8576A]';

    const stepColor = variant === 'easter'
        ? 'bg-[#D16075] text-white'
        : 'bg-[#A8576A] text-white';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.03 }}
            className={`rounded-2xl border transition-all overflow-hidden ${bgClass} ${isExpanded ? 'shadow-lg' : 'hover:shadow-md hover:-translate-y-0.5'}`}
        >
            {/* Card Header - always visible */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full text-left p-5 sm:p-6 flex items-start gap-4"
            >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
                    {strategy.icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-[#4A3338] mb-1">{strategy.title}</h3>
                    <p className="text-xs sm:text-sm text-[#70545A] leading-relaxed">{strategy.desc}</p>
                    {!isExpanded && (
                        <p className="text-xs text-[#D16075] font-medium mt-2 flex items-center gap-1">
                            Clique para ver o passo a passo <ChevronDown size={14} />
                        </p>
                    )}
                </div>
                <ChevronDown
                    size={20}
                    className={`text-[#A8576A] shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Expanded: Step-by-step */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
                            <div className="border-t border-[#E295A3]/20 pt-4">
                                <h4 className="text-sm font-bold text-[#4A3338] mb-4 flex items-center gap-2">
                                    📋 Como Executar — Passo a Passo
                                </h4>
                                <div className="space-y-3">
                                    {strategy.steps.map((step, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${stepColor}`}>
                                                {i + 1}
                                            </span>
                                            <p className="text-sm text-[#4A3338] leading-relaxed pt-0.5">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
