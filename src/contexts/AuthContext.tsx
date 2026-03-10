import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';

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

const API_TIMEOUT_MS = 3000;

function getSavedSession() {
    if (typeof window === 'undefined') {
        return { savedToken: null, savedUser: null };
    }

    return {
        savedToken: localStorage.getItem('atelier21_token'),
        savedUser: localStorage.getItem('atelier21_user'),
    };
}

async function tryApiLogin(email: string, password: string): Promise<{ token: string; user: User } | null> {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
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
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
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
    const [isLoading, setIsLoading] = useState(() => {
        const { savedToken, savedUser } = getSavedSession();
        return Boolean(savedToken && savedUser);
    });

    useEffect(() => {
        const restore = async () => {
            const { savedToken, savedUser } = getSavedSession();

            if (!savedToken || !savedUser) {
                setIsLoading(false);
                return;
            }

            // Tenta validar o token no backend
            const verified = await tryApiVerify(savedToken);

            if (verified) {
                setUser(verified);
            } else {
                localStorage.removeItem('atelier21_user');
                localStorage.removeItem('atelier21_token');
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
