// src/lib/auth.tsx
import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

import { useNavigate } from "react-router-dom";

// small types
type User = { id: number; name: string; email: string } | null;

type AuthContextValue = {
    user: User;
    token: string | null;
    login: (
        email: string,
        password: string,
        remember?: boolean
    ) => Promise<void>;
    logout: () => Promise<void>;
    setTokenInMemory: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "app:token"; // persistence key (if you accept storage risks)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [token, setToken] = useState<string | null>(() => {
        // Option A (persist): read from localStorage (risky if your app is vulnerable to XSS)
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch {
            return null;
        }
        // Option B (safer): return null (keep in memory only) and implement refresh with HttpOnly cookie
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            setUser(null);
            return;
        }

        // fetch /me to get current user; use the authFetch helper below or a direct fetch
        (async () => {
            const resp = await fetch("/api/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (resp.ok) setUser(await resp.json());
            else {
                setUser(null);
                setToken(null);
                localStorage.removeItem(TOKEN_KEY);
            }
        })();
    }, [token]);

    async function login(email: string, password: string, remember = false) {
        const resp = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, device_name: "react-web" }),
        });

        if (!resp.ok) {
            const err = await resp
                .json()
                .catch(() => ({ message: "Login failed" }));
            throw new Error(err.message || "Login failed");
        }

        const data = await resp.json();
        const newToken = data.token as string;
        setToken(newToken);
        setUser(data.user);
        if (remember) {
            // Persistent: explicit tradeoff (XSS risk)
            localStorage.setItem(TOKEN_KEY, newToken);
        }
    }

    async function logout() {
        // call server to revoke current token
        await fetch("/api/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });

        // clear client state
        setToken(null);
        setUser(null);
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch {}
        navigate("/login");
    }

    // helper for manual in-memory token replacement (useful for refresh)
    function setTokenInMemory(t: string | null) {
        setToken(t);
    }

    return (
        <AuthContext.Provider
            value={{ user, token, login, logout, setTokenInMemory }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}
