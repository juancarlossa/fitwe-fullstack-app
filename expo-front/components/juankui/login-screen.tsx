// screens/LoginScreen.tsx
import { useAuth } from "@/context/auth-context";
import { AuthUserType, login } from "@/services/authService";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ─── Props ────────────────────────────────────────────────────────────────────
// Ajusta según tu stack de navegación (React Navigation, Expo Router, etc.)
type Props = {
    onLoginSuccess: (user: AuthUserType) => void;
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function LoginScreen({ onLoginSuccess }: Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const { refreshUser, signIn } = useAuth();

    // ── Validación local ────────────────────────────────────────────────────────
    function validate(): boolean {
        const newErrors: typeof errors = {};

        if (!email.trim()) {
            newErrors.email = "El email es obligatorio";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Email no válido";
        }

        if (!password) {
            newErrors.password = "La contraseña es obligatoria";
        } else if (password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    // ── Submit ──────────────────────────────────────────────────────────────────
    async function handleLogin() {
        if (!validate()) return;

        setLoading(true);
        setErrors({});

        const result = await login(email.trim().toLowerCase(), password);

        setLoading(false);

        if (!result.success) {
            if (result.error.toLowerCase().includes("contraseña")) {
                setErrors({ password: result.error });
            } else if (result.error.toLowerCase().includes("usuario")) {
                setErrors({ email: result.error });
            } else {
                Alert.alert("Error", result.error);
            }
            return;
        }

        // 1. guardas token ya dentro de login()
        // 2. actualizas contexto inmediatamente
        signIn(result.user);

        // 3. opcional: sync con backend (recomendado)
        await refreshUser();

        // 4. navegas
        router.replace("/");
    }

    // ── UI ──────────────────────────────────────────────────────────────────────
    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <StatusBar barStyle="light-content" />
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>G</Text>
                    </View>
                    <Text style={styles.title}>Bienvenido</Text>
                    <Text style={styles.subtitle}>Inicia sesión en tu cuenta</Text>
                </View>

                {/* Formulario */}
                <View style={styles.form}>
                    {/* Email */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={[styles.input, errors.email ? styles.inputError : null]}
                            placeholder="tu@email.com"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={(v) => {
                                setEmail(v);
                                if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            editable={!loading}
                        />
                        {errors.email ? (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        ) : null}
                    </View>

                    {/* Contraseña */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.passwordWrapper}>
                            <TextInput
                                style={[
                                    styles.input,
                                    styles.passwordInput,
                                    errors.password ? styles.inputError : null,
                                ]}
                                placeholder="••••••••"
                                placeholderTextColor="#9CA3AF"
                                value={password}
                                onChangeText={(v) => {
                                    setPassword(v);
                                    if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                                }}
                                secureTextEntry={!showPassword}  // 👈 SIEMPRE TRUE
                                autoCapitalize="none"     // 👈 FIX ANDROID
                                autoCorrect={false}
                                returnKeyType="done"
                                onSubmitEditing={handleLogin}
                                editable={!loading}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword((v) => !v)}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                                <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
                            </TouchableOpacity>
                        </View>
                        {errors.password ? (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        ) : null}
                    </View>

                    {/* Botón */}
                    <TouchableOpacity
                        style={[styles.button, loading ? styles.buttonDisabled : null]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.buttonText}>Iniciar sesión</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const PRIMARY = "#2563EB";
const ERROR = "#EF4444";
const BG = "#F9FAFB";
const CARD = "#FFFFFF";
const BORDER = "#E5E7EB";
const TEXT = "#111827";
const MUTED = "#6B7280";

const styles = StyleSheet.create({
    flex: {
        flex: 1,
        backgroundColor: BG,
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 48,
    },

    // Header
    header: {
        alignItems: "center",
        marginBottom: 36,
    },
    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: PRIMARY,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    logoText: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "800",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: TEXT,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        color: MUTED,
        marginTop: 6,
    },

    // Formulario
    form: {
        backgroundColor: CARD,
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
        gap: 20,
    },
    fieldGroup: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: TEXT,
    },
    input: {
        height: 50,
        borderWidth: 1.5,
        borderColor: BORDER,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: TEXT,
        backgroundColor: "#FAFAFA",
    },
    inputError: {
        borderColor: ERROR,
        backgroundColor: "#FFF5F5",
    },
    passwordWrapper: {
        position: "relative",
    },
    passwordInput: {
        paddingRight: 50,
    },
    eyeButton: {
        position: "absolute",
        right: 14,
        top: 0,
        bottom: 0,
        justifyContent: "center",
    },
    eyeIcon: {
        fontSize: 18,
    },
    errorText: {
        fontSize: 12,
        color: ERROR,
        fontWeight: "500",
    },

    // Botón
    button: {
        height: 52,
        backgroundColor: PRIMARY,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 6,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});