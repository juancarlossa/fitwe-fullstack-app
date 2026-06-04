import { logout } from "@/services/authService";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Logout() {
    const handleLogout = async () => {
        await logout();

        router.replace("/login" as any);
    };
    return (
        <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
            <Pressable
                onPress={handleLogout}
                style={{
                    backgroundColor: "#ef4444",
                    padding: 14,
                    borderRadius: 12,
                }}
            >
                <Text
                    style={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                    }}
                >
                    Cerrar sesión
                </Text>
            </Pressable>
        </View>
    );
};
