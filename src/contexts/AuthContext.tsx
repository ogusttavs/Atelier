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
    requestAccess: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
    setupPassword: (email: string, token: string, password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
}

const API_TIMEOUT_MS = 5000;

async function tryApiLogin(email: string, password: string): Promise<User | null> {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });

        if (!res.ok) return null;
        const data = await res.json() as { user: User };
        return data.user;
    } catch {
        return null;
    }
}

async function tryApiVerify(): Promise<User | null> {
    try {
        const res = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}',
            credentials: 'include',
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });

        if (!res.ok) return null;
        const data = await res.json() as { valid: boolean; user: User };
        return data.valid ? data.user : null;
    } catch {
        return null;
    }
}

async function tryApiRequestAccess(email: string): Promise<{ error?: string; message?: string; ok: boolean }> {
    try {
        const res = await fetch('/api/auth/request-access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            credentials: 'include',
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });

        const data = await res.json() as { error?: string; message?: string; ok?: boolean };
        if (!res.ok) {
            return { ok: false, error: data.error || 'Nao foi possivel reenviar o acesso.' };
        }

        return { ok: true, message: data.message };
    } catch {
        return { ok: false, error: 'Nao foi possivel reenviar o acesso agora.' };
    }
}

async function tryApiSetupPassword(email: string, token: string, password: string): Promise<{ user?: User; error?: string }> {
    try {
        const res = await fetch('/api/auth/setup-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token, password }),
            credentials: 'include',
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });

        const data = await res.json() as { error?: string; user?: User };
        if (!res.ok) {
            return { error: data.error || 'Nao foi possivel definir sua senha.' };
        }

        return { user: data.user };
    } catch {
        return { error: 'Nao foi possivel concluir a ativacao agora.' };
    }
}

async function tryApiLogout(): Promise<void> {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });
    } catch {
        // O estado local ja e limpo mesmo se a requisicao falhar.
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const restore = async () => {
            const verified = await tryApiVerify();
            setUser(verified);
            setIsLoading(false);
        };

        restore();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        const emailNorm = email.toLowerCase().trim();
        const apiUser = await tryApiLogin(emailNorm, password);

        if (apiUser) {
            setUser(apiUser);
            return true;
        }

        return false;
    };

    const requestAccess = async (email: string) => {
        const result = await tryApiRequestAccess(email.toLowerCase().trim());
        return {
            success: result.ok,
            error: result.error,
            message: result.message,
        };
    };

    const setupPassword = async (email: string, token: string, password: string) => {
        const result = await tryApiSetupPassword(email.toLowerCase().trim(), token, password);

        if (result.user) {
            setUser(result.user);
            return { success: true };
        }

        return { success: false, error: result.error };
    };

    const logout = () => {
        void tryApiLogout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, login, logout, requestAccess, setupPassword }}>
            {children}
        </AuthContext.Provider>
    );
}
