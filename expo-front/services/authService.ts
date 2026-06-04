// services/authService.ts  (React Native — usa expo-secure-store)
// Instalación: npx expo install expo-secure-store
import { API_URL } from "@/constants/constants";
import * as SecureStore from "expo-secure-store";

const API_BASE = API_URL // 🔁 cambia esto
const TOKEN_KEY = "secreto";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AuthUserType = {
    id: string;
    email: string;
    name: string;
    role: "USER" | "GYM";
    subscriptionStatus: string;
    subscriptionEndDate: string | null;
    monthlyFee: number;
    gymId: string | null;
    gymName: string | null;
    serverNow: string;
    image: string | null;
};

export type LoginResult =
    | { success: true; user: AuthUserType; token: string }
    | { success: false; error: string };

// ─── Token (SecureStore = iOS Keychain / Android Keystore) ───────────────────

export async function saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<LoginResult> {
    try {
        const res = await fetch(`${API_BASE}/auth/mobile`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            return { success: false, error: data.error || "Error al iniciar sesión" };
        }
        console.log("Success!", res.status, data);
        await saveToken(data.token);
        return { success: true, user: data.user, token: data.token };
    } catch {
        return { success: false, error: "No se pudo conectar al servidor" };
    }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
    await deleteToken();
}

// ─── Cliente HTTP autenticado ────────────────────────────────────────────────

export async function apiFetch<T = any>(
    path: string,
    options: RequestInit = {}
): Promise<{ data: T | null; error: string | null; unauthorized: boolean }> {
    const token = await getToken();

    if (!token) {
        return { data: null, error: "No autenticado", unauthorized: true };
    }

    try {
        const res = await fetch(`${API_BASE}${path}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...(options.headers || {}),
            },
        });

        const data = await res.json();

        if (res.status === 401) {
            await logout();
            return { data: null, error: data.error, unauthorized: true };
        }

        if (!res.ok) {
            return { data: null, error: data.error || "Error del servidor", unauthorized: false };
        }

        else {

            return { data, error: null, unauthorized: false };
        }
    } catch {
        return { data: null, error: "Error de red", unauthorized: false };
    }
}