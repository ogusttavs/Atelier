import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    email: string;
    name: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

// ─── Modo demo (ativo enquanto o backend não estiver rodando) ─────────────────
const DEMO_USERS = [
    { email: 'demo@atelier21.com', password: 'pascoa2026', name: 'Cliente Demo' },
];

async function tryApiLogin(email: string, password: string): Promise<{ token: string; user: User } | null> {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            signal: AbortSignal.timeout(4000),
        });

        if (!res.ok) return null;
        return await res.json() as { token: string; user: User };
    } catch {
        return null; // Backend offline → cai no modo demo
    }
}

async function tryApiVerify(token: string): Promise<User | null> {
    try {
        const res = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
            signal: AbortSignal.timeout(4000),
        });

        if (!res.ok) return null;
        const data = await res.json() as { valid: boolean; user: User };
        return data.valid ? data.user : null;
    } catch {
        return null;
    }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restore = async () => {
            const savedToken = localStorage.getItem('atelier21_token');
            const savedUser = localStorage.getItem('atelier21_user');

            if (savedToken && savedUser) {
                // Tenta validar o token no backend
                const verified = await tryApiVerify(savedToken);

                if (verified) {
                    setUser(verified);
                } else {
                    // Token inválido ou backend offline → tenta usar sessão salva localmente
                    try {
                        setUser(JSON.parse(savedUser) as User);
                    } catch {
                        localStorage.removeItem('atelier21_user');
                        localStorage.removeItem('atelier21_token');
                    }
                }
            }

            setIsLoading(false);
        };

        restore();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const emailNorm = email.toLowerCase().trim();

        // 1. Tenta API real
        const apiResult = await tryApiLogin(emailNorm, password);
        if (apiResult) {
            localStorage.setItem('atelier21_token', apiResult.token);
            localStorage.setItem('atelier21_user', JSON.stringify(apiResult.user));
            setUser(apiResult.user);
            return true;
        }

        // 2. Fallback: modo demo (útil durante desenvolvimento)
        const demo = DEMO_USERS.find(u => u.email === emailNorm && u.password === password);
        if (demo) {
            const userData: User = { email: demo.email, name: demo.name };
            const fakeToken = btoa(JSON.stringify({ email: demo.email, exp: Date.now() + 86400000 }));
            localStorage.setItem('atelier21_token', fakeToken);
            localStorage.setItem('atelier21_user', JSON.stringify(userData));
            setUser(userData);
            return true;
        }

        return false;
    };

    const logout = () => {
        localStorage.removeItem('atelier21_user');
        localStorage.removeItem('atelier21_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
