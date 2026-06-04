
import LoginScreen from "@/components/juankui/login-screen";
import { router } from "expo-router";

export default function Login() {
    return (
        <LoginScreen onLoginSuccess={(user) => {
            // guarda el user en tu estado global (Context, Zustand, etc.)
            router.replace("/");
        }} />
    );
}