import {useEffect, useState, type FormEvent} from 'react';
import {ArrowRight, CheckCircle2, HeartHandshake, LockKeyhole, MailCheck, PartyPopper} from 'lucide-react';
import {useAuth} from '../contexts/AuthContext';
import {readSavedCheckoutEmail, saveCheckoutEmail} from '../lib/checkoutEmail';
import {SUPPORT_EMAIL} from '../lib/supportEmail';

interface ThankYouPageProps {
  onGoToLogin: () => void;
  onGoToSales: () => void;
}

function getEmailFromQuery(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('email') || params.get('customer_email') || params.get('buyer_email') || '';
}

const STEPS = [
  {
    description: 'Use exatamente o mesmo email informado no checkout para receber o acesso.',
    icon: MailCheck,
    title: '1. Confira o email da compra',
  },
  {
    description: 'No nosso email, clique em "Definir minha senha" para criar seu primeiro acesso.',
    icon: LockKeyhole,
    title: '2. Crie sua senha',
  },
  {
    description: 'Depois disso, entre na area de membros e comece pelo primeiro modulo.',
    icon: CheckCircle2,
    title: '3. Entre na plataforma',
  },
] as const;

export default function ThankYouPage({ onGoToLogin, onGoToSales }: ThankYouPageProps) {
  const { requestAccess } = useAuth();
  const [email, setEmail] = useState('');
  const [detectedEmail, setDetectedEmail] = useState('');
  const [emailSource, setEmailSource] = useState<'query' | 'saved' | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const emailFromQuery = getEmailFromQuery();
    if (emailFromQuery) {
      const normalized = saveCheckoutEmail(emailFromQuery);
      setEmail(normalized);
      setDetectedEmail(normalized);
      setEmailSource('query');
      return;
    }

    const savedEmail = readSavedCheckoutEmail();
    if (savedEmail) {
      setEmail(savedEmail);
      setDetectedEmail(savedEmail);
      setEmailSource('saved');
    }
  }, []);

  const handleResend = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Digite o mesmo email usado na compra.');
      return;
    }

    const normalized = saveCheckoutEmail(email);
    setEmail(normalized);
    setDetectedEmail(normalized);
    if (!emailSource) setEmailSource('saved');

    setIsSubmitting(true);
    const result = await requestAccess(normalized);

    if (result.success) {
      setMessage(result.message || 'Se encontramos uma compra ativa neste email, enviamos um novo link de acesso.');
    } else {
      setError(result.error || 'Nao foi possivel reenviar o acesso agora.');
    }

    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#FFF0F3_0%,#FFF7F8_40%,#F8ECEF_100%)] px-4 py-12 text-[#4A3338]" role="main">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-[0_30px_90px_-40px_rgba(122,66,77,0.45)] backdrop-blur md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E9C5CD] bg-[#FFF5F7] px-4 py-2 text-sm font-semibold text-[#A8576A]">
              <PartyPopper size={16} />
              Compra aprovada
            </div>

            <h1 className="mt-5 max-w-2xl text-4xl font-black leading-tight md:text-5xl">
              Obrigada pela confianca.
              <span className="block text-[#D16075]">Seu acesso esta quase pronto.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#70545A]">
              Agora o proximo passo e simples: receber o nosso email, criar sua senha e entrar na area de membros.
              Se voce nao encontrar o email em ate 1 minuto, pode reenviar o acesso aqui mesmo.
            </p>

            <div className="mt-6 rounded-[24px] border border-[#F2D6DC] bg-[#FFF8F9] p-5">
              <p className="text-sm font-bold text-[#4A3338]">O que deve acontecer agora</p>
              <p className="mt-2 text-sm leading-relaxed text-[#70545A]">
                1. A compra aprovada libera seu acesso. 2. Nosso email chega com o link para criar sua senha. 3. Depois
                disso, voce entra normalmente na plataforma.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {STEPS.map(({ title, description, icon: Icon }) => (
                <article
                  key={title}
                  className="rounded-[24px] border border-[#F2D6DC] bg-[#FFF9FA] p-5 shadow-[0_18px_40px_-35px_rgba(122,66,77,0.55)]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D16075] text-white shadow-lg shadow-[#D16075]/25">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-base font-bold text-[#4A3338]">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#70545A]">{description}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-[#E9C5CD] bg-[#4A3338] p-6 text-white shadow-[0_24px_60px_-36px_rgba(74,51,56,0.8)]">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                  <HeartHandshake size={22} />
                </div>
                <div>
                  <p className="text-lg font-bold">Nosso email vai com o passo a passo</p>
                  <p className="text-sm text-white/80">Procure por uma mensagem do Atelier 21 e, se nao achar, confira spam e promocoes.</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/85">
                Se ainda assim nao chegar, fale com a gente em <strong>{SUPPORT_EMAIL}</strong>.
              </p>
            </div>
          </section>

          <aside className="rounded-[32px] border border-[#F2D6DC] bg-white/90 p-8 shadow-[0_30px_90px_-40px_rgba(122,66,77,0.45)] backdrop-blur md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A8576A]">Acesso imediato</p>
            <h2 className="mt-3 text-2xl font-black text-[#4A3338]">Reenviar meu acesso</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#70545A]">
              Se a compra ja foi aprovada e voce nao recebeu o email, use o mesmo email informado no checkout.
            </p>

            <div className="mt-5 rounded-[24px] border border-[#E9D5DA] bg-[#FFF8F9] p-5">
              <p className="text-sm font-bold text-[#4A3338]">
                {emailSource === 'query'
                  ? 'Email detectado da compra'
                  : emailSource === 'saved'
                    ? 'Email lembrado neste navegador'
                    : 'Email da compra nao detectado'}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#70545A]">
                {emailSource === 'query' && detectedEmail
                  ? `Identificamos ${detectedEmail}. Se foi esse o email usado no checkout, basta reenviar o acesso ou abrir o login.`
                  : emailSource === 'saved' && detectedEmail
                    ? `Preenchemos ${detectedEmail} com base no ultimo email usado neste navegador. Se precisar, voce pode trocar abaixo.`
                    : 'A Kiwify nem sempre envia o email do comprador na URL de redirecionamento. Se isso acontecer, digite abaixo o mesmo email usado no pagamento.'}
              </p>
              {emailSource === 'saved' && detectedEmail && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#F0CCD4] bg-white px-3 py-1.5 text-xs font-semibold text-[#A8576A]">
                  <CheckCircle2 size={14} />
                  Email lembrado com seguranca neste navegador
                </div>
              )}
            </div>

            <form onSubmit={handleResend} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#4A3338]">Email da compra</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="seu@email.com"
                  className="w-full rounded-2xl border border-[#E4D5D9] bg-[#FFF7F8] px-4 py-3 text-sm outline-none transition focus:border-[#D16075] focus:ring-2 focus:ring-[#D16075]/20"
                  autoComplete="email"
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {message && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D16075] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#D16075]/25 transition hover:bg-[#B84D61] disabled:opacity-60"
              >
                {isSubmitting ? 'Enviando...' : 'Reenviar email de acesso'}
                {!isSubmitting && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8 space-y-3 rounded-[28px] border border-[#E9D5DA] bg-[#FFF8F9] p-5">
              <p className="text-sm font-bold text-[#4A3338]">Antes de reenviar, confira isto</p>
              <ul className="space-y-2 text-sm leading-relaxed text-[#70545A]">
                <li>Veja se o email caiu em spam, lixo eletronico ou promocoes.</li>
                <li>Procure por mensagens enviadas por Atelier 21 em ate 1 minuto apos a compra.</li>
                <li>Confirme se voce digitou exatamente o mesmo email usado no checkout.</li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={onGoToLogin}
                className="rounded-2xl border border-[#D16075]/20 bg-white px-5 py-3 text-base font-bold text-[#A8576A] transition hover:border-[#D16075]/35 hover:bg-[#FFF5F7]"
              >
                Abrir pagina de login
              </button>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="rounded-2xl border border-[#D16075]/15 bg-[#FFF7F8] px-5 py-3 text-center text-sm font-semibold text-[#70545A] transition hover:border-[#D16075]/30 hover:text-[#D16075]"
              >
                Falar com o suporte
              </a>
              <button
                type="button"
                onClick={onGoToSales}
                className="rounded-2xl px-5 py-3 text-sm font-semibold text-[#70545A] transition hover:text-[#D16075]"
              >
                Voltar para a pagina principal
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
