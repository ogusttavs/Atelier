import {useEffect, useState} from 'react';
import {getEasterCountdownState} from '../lib/easterCountdown';

interface EasterCountdownBarProps {
  variant?: 'default' | 'hero-overlay';
}

function CompactUnit({label, value}: {label: string; value: number}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#D16075]/18 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#A8576A] sm:px-2.5 sm:text-[11px]">
      <strong className="text-[#4A3338]">{String(value).padStart(2, '0')}</strong>
      <span>{label}</span>
    </span>
  );
}

export default function EasterCountdownBar({variant = 'default'}: EasterCountdownBarProps) {
  const [now, setNow] = useState(() => new Date());
  const countdown = getEasterCountdownState(now);
  const formattedTargetDate = countdown.targetDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  const wrapperClassName =
    variant === 'hero-overlay'
      ? 'border border-white/28 bg-[#FFF5F7]/34 text-[#4A3338] shadow-[0_12px_32px_rgba(74,51,56,0.12)] backdrop-blur-lg'
      : 'border border-[#E7CDD3] bg-[#FFF5F7] text-[#4A3338] shadow-[0_8px_24px_rgba(74,51,56,0.05)]';

  return (
    <div className={`rounded-2xl ${wrapperClassName}`}>
      <div className="flex min-h-[52px] flex-wrap items-center justify-center gap-2 px-4 py-2 text-center sm:min-h-[56px] sm:px-5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-[#D16075]" />
        {countdown.isEasterDay ? (
          <p className="text-xs font-semibold sm:text-sm">
            Hoje e Pascoa. Quem se planejou antes entrou nessa data com mais chance de vender.
          </p>
        ) : (
          <>
            <p className="text-xs font-semibold sm:text-sm">
              A Pascoa esta chegando. Ja se planejou para fazer dinheiro nessa data?
            </p>
            <CompactUnit label="dias" value={countdown.days} />
            <CompactUnit label="horas" value={countdown.hours} />
            <CompactUnit label="min" value={countdown.minutes} />
            <CompactUnit label="seg" value={countdown.seconds} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A8576A] sm:text-[11px]">
              planeje antes de {formattedTargetDate}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
