import {useEffect, useState, type FormEvent} from 'react';
import {ArrowRight, ExternalLink, Eye, EyeOff, LifeBuoy, Lock, Mail, ShieldCheck} from 'lucide-react';
import {useAuth} from '../contexts/AuthContext';
import {readSavedCheckoutEmail, saveCheckoutEmail} from '../lib/checkoutEmail';
import {SUPPORT_EMAIL} from '../lib/supportEmail';
import BrandMark from './BrandMark';

interface LoginPageProps {
    onSuccess: () => void;
    onGoToSales: () => void;
    checkoutUrl: string;
}

const MIN_PASSWORD_LENGTH = 10;

function readSetupParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        email: params.get('email') || '',
        setupToken: params.get('setup') || '',
    };
}

export default function LoginPage({ onSuccess, onGoToSales, checkoutUrl }: LoginPageProps) {
    const { login, requestAccess, setupPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [emailHint, setEmailHint] = useState<'query' | 'saved' | null>(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryMessage, setRecoveryMessage] = useState('');
    const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
    const [isRecoverySubmitting, setIsRecoverySubmitting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [setupToken, setSetupToken] = useState('');

    useEffect(() => {
        const params = readSetupParams();
        const knownEmail = params.email || readSavedCheckoutEmail();

        if (knownEmail) {
            setEmail(knownEmail);
            setRecoveryEmail(knownEmail);
            setEmailHint(params.email ? 'query' : 'saved');
        }

        if (params.email) {
            saveCheckoutEmail(params.email);
        }
        if (params.setupToken) setSetupToken(params.setupToken);
    }, []);

    const isSetupMode = setupToken.length > 0;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setRecoveryMessage('');
        setIsSubmitting(true);

        if (!email || !password) {
            setError('Preencha todos os campos.');
            setIsSubmitting(false);
            return;
        }

        if (isSetupMode) {
            if (password.length < MIN_PASSWORD_LENGTH) {
                setError(`A senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`);
                setIsSubmitting(false);
                return;
            }

            if (password !== confirmPassword) {
                setError('As senhas nao conferem.');
                setIsSubmitting(false);
                return;
            }

            const result = await setupPassword(email, setupToken, password);
            if (result.success) {
                saveCheckoutEmail(email);
                window.history.replaceState({}, '', '/member');
                onSuccess();
            } else {
                setError(result.error || 'Nao foi possivel ativar sua conta.');
            }

            setIsSubmitting(false);
            return;
        }

        const success = await login(email, password);
        if (success) {
            saveCheckoutEmail(email);
            onSuccess();
        } else {
            setError('Email ou senha incorretos.');
        }

        setIsSubmitting(false);
    };

    const handleRequestAccess = async (e: FormEvent) => {
        e.preventDefault();
        setRecoveryMessage('');
        setError('');

        if (!recoveryEmail) {
            setError('Digite o mesmo email usado na compra.');
            return;
        }

        setIsRecoverySubmitting(true);
        saveCheckoutEmail(recoveryEmail);
        const result = await requestAccess(recoveryEmail);

        if (result.success) {
            setRecoveryMessage(result.message || 'Se encontramos uma compra ativa neste email, enviamos um novo link de acesso.');
        } else {
            setError(result.error || 'Nao foi possivel reenviar o acesso.');
        }

        setIsRecoverySubmitting(false);
    };

    return (
        <main className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-4 py-12" role="main">
            <div className="w-full max-w-md reveal-up">
                <div className="text-center mb-8">
                    <BrandMark
                        iconClassName="h-12 w-12"
                        wrapperClassName="mx-auto mb-4 rounded-[16px] p-2 shadow-lg shadow-[#4A3338]/10 ring-1 ring-[#E295A3]/30"
                    />
                    <h1 className="text-2xl font-bold text-[#4A3338]">Atelier 21</h1>
                    <p className="text-sm text-[#A8576A] mt-1">Operacao Pascoa Lucrativa</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#E295A3]/20">
                    <h2 className="text-xl font-bold text-[#4A3338] mb-2">
                        {isSetupMode ? 'Defina sua senha' : 'Area de Membros'}
                    </h2>
                    <p className="text-sm text-[#70545A] mb-6">
                        {isSetupMode
                            ? 'Proteja sua conta criando uma senha forte no primeiro acesso.'
                            : 'Acesse com o email da compra e a senha que voce criou no link de ativacao.'}
                    </p>

                    <div className="mb-5 rounded-2xl border border-[#E9D5DA] bg-[#FFF8F9] px-4 py-3 text-sm text-[#70545A]">
                        <p className="font-semibold text-[#4A3338]">Suporte oficial</p>
                        <p className="mt-1">
                            Se voce precisar de ajuda com acesso, fale com a gente em{' '}
                            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#D16075] hover:underline">
                                {SUPPORT_EMAIL}
                            </a>.
                        </p>
                    </div>

                    {isSetupMode && (
                        <div className="mb-5 rounded-2xl border border-[#E295A3]/30 bg-[#FFF5F7] px-4 py-3 text-sm text-[#70545A]">
                            <div className="flex items-center gap-2 font-semibold text-[#4A3338]">
                                <ShieldCheck size={16} />
                                Ativacao segura
                            </div>
                            <p className="mt-2">Esse link e de uso unico e expira automaticamente.</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#4A3338] mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8576A]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailHint(null);
                                        if (!recoveryEmail) setRecoveryEmail(e.target.value);
                                    }}
                                    placeholder="seu@email.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none bg-[#FFF5F7]/50 disabled:opacity-70"
                                    autoComplete="email"
                                    autoCapitalize="none"
                                    inputMode="email"
                                    disabled={isSetupMode}
                                />
                            </div>
                            {emailHint === 'saved' && (
                                <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#F0CCD4] bg-[#FFF8F9] px-3 py-1 text-xs font-semibold text-[#A8576A]">
                                    <ShieldCheck size={14} />
                                    Email lembrado com seguranca neste navegador
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[#4A3338] mb-1.5">
                                {isSetupMode ? 'Nova senha' : 'Senha'}
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8576A]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none bg-[#FFF5F7]/50"
                                    autoComplete={isSetupMode ? 'new-password' : 'current-password'}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8576A] hover:text-[#D16075]"
                                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {isSetupMode && (
                            <div>
                                <label className="block text-sm font-medium text-[#4A3338] mb-1.5">Confirmar senha</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8576A]" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none bg-[#FFF5F7]/50"
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 fade-in">
                                {error}
                            </div>
                        )}

                        {recoveryMessage && (
                            <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-xl border border-emerald-100 fade-in">
                                {recoveryMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-[#D16075] hover:bg-[#B84D61] text-white rounded-xl font-bold text-base shadow-lg shadow-[#D16075]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isSetupMode ? 'Ativar conta' : 'Entrar'} <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {!isSetupMode && (
                        <div className="mt-6 border-t border-[#E9D5DA] pt-5">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsRecoveryOpen(!isRecoveryOpen);
                                    if (!recoveryEmail && email) setRecoveryEmail(email);
                                }}
                                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#A8576A] hover:text-[#D16075]"
                            >
                                <LifeBuoy size={16} />
                                Nao recebi meu acesso ou esqueci minha senha
                            </button>

                            {isRecoveryOpen && (
                                <form onSubmit={handleRequestAccess} className="mt-4 space-y-3">
                                    <p className="text-sm text-[#70545A]">
                                        Digite o mesmo email usado na compra para receber um novo link de acesso.
                                    </p>
                                    <p className="text-xs text-[#A8576A]">
                                        Se preferir atendimento humano, escreva para {SUPPORT_EMAIL}.
                                    </p>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8576A]" />
                                        <input
                                            type="email"
                                            value={recoveryEmail}
                                            onChange={(e) => setRecoveryEmail(e.target.value)}
                                            placeholder="seu@email.com"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none bg-[#FFF5F7]/50"
                                            autoComplete="email"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isRecoverySubmitting}
                                        className="w-full py-3 bg-[#FFF5F7] hover:bg-[#FFE9EE] text-[#A8576A] rounded-xl font-bold text-sm border border-[#E295A3]/30 transition-all disabled:opacity-60"
                                    >
                                        {isRecoverySubmitting ? 'Enviando...' : 'Reenviar meu acesso'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center space-y-3">
                    {!isSetupMode && (
                        <a
                            href={checkoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-[#D16075] font-semibold hover:underline"
                        >
                            Ainda nao tem acesso? Compre aqui <ExternalLink size={14} />
                        </a>
                    )}
                    <div className="text-xs text-[#70545A]">
                        Suporte oficial: <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-[#D16075] hover:underline">{SUPPORT_EMAIL}</a>
                    </div>
                    <div>
                        <button
                            onClick={onGoToSales}
                            className="text-sm text-[#A8576A] hover:text-[#D16075] transition-colors"
                        >
                            ← Voltar para a Pagina de Vendas
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
