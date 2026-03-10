import {useState, type FormEvent} from 'react';
import {ArrowRight, ExternalLink, Eye, EyeOff, Heart, Lock, Mail} from 'lucide-react';
import {useAuth} from '../contexts/AuthContext';

interface LoginPageProps {
    onSuccess: () => void;
    onGoToSales: () => void;
    checkoutUrl: string;
}

export default function LoginPage({ onSuccess, onGoToSales, checkoutUrl }: LoginPageProps) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!email || !password) {
            setError('Preencha todos os campos.');
            setIsSubmitting(false);
            return;
        }

        const success = await login(email, password);
        if (success) {
            onSuccess();
        } else {
            setError('Email ou senha incorretos.');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md reveal-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#D16075] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D16075]/20">
                        <Heart size={28} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#4A3338]">Atelier 21</h1>
                    <p className="text-sm text-[#A8576A] mt-1">Operação Páscoa Lucrativa</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#E295A3]/20">
                    <h2 className="text-xl font-bold text-[#4A3338] mb-2">Área de Membros</h2>
                    <p className="text-sm text-[#70545A] mb-6">
                        Acesse com o email e senha enviados após a compra.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-[#4A3338] mb-1.5">Email</label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8576A]" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none bg-[#FFF5F7]/50"
                                    autoComplete="email"
                                    autoCapitalize="none"
                                    inputMode="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-[#4A3338] mb-1.5">Senha</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8576A]" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#D16075] focus:border-transparent outline-none bg-[#FFF5F7]/50"
                                    autoComplete="current-password"
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

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100 fade-in">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 bg-[#D16075] hover:bg-[#B84D61] text-white rounded-xl font-bold text-base shadow-lg shadow-[#D16075]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Entrar <ArrowRight size={18} /></>
                            )}
                        </button>
                    </form>

                </div>

                {/* Bottom links */}
                <div className="mt-6 text-center space-y-3">
                    <a
                        href={checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-[#D16075] font-semibold hover:underline"
                    >
                        Ainda não tem acesso? Compre aqui <ExternalLink size={14} />
                    </a>
                    <div>
                        <button
                            onClick={onGoToSales}
                            className="text-sm text-[#A8576A] hover:text-[#D16075] transition-colors"
                        >
                            ← Voltar para a Página de Vendas
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
