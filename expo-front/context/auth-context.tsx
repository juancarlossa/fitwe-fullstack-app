import { apiFetch, AuthUserType, deleteToken } from "@/services/authService";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user: AuthUserType | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    signOut: () => Promise<void>;
    signIn: (userData: AuthUserType) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUserType | null>(null);
    const [loading, setLoading] = useState(true);

    const loadMe = async () => {
        try {
            const res = await apiFetch<AuthUserType>("/me");

            if (res.data) {
                setUser(res.data);
            } else {
                setUser(null);
            }
        } catch (e) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMe();
    }, []);

    async function signOut() {
        setLoading(true);
        await deleteToken();
        setUser(null);
        setLoading(false);
    };

    async function signIn(userData: AuthUserType) {
        setUser(userData);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshUser: loadMe,
                signOut,
                signIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};

