import { useAuth } from "@/context/auth-context";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function LogoutButton() {
    const { signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
        router.replace("/auth/login" as any);
    };
    return (
        <View>
            <Pressable
                onPress={handleLogout}
                className="bg-red-500/10 border border-red-500/30 py-3 rounded-xl active:opacity-70"
            >
                <Text className="text-red-500 font-semibold text-center">
                    Cerrar sesión
                </Text>
            </Pressable>
        </View>
    );
};
