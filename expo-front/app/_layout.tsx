import { DownMenu } from "@/components/juankui/down-menu";
import { AuthProvider } from "@/context/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { SidebarMenuLayout } from "../components/juankui/sidebar-menu";
import "./styles/globals.css";

export default function RootLayout() {
    const queryClient = new QueryClient();
    useEffect(() => {
        NavigationBar.setButtonStyleAsync("dark"); // "light" o "dark"
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    backgroundColor: '#10141a',
                }}
            >
                <QueryClientProvider client={queryClient}>
                    <GestureHandlerRootView style={{ flex: 1 }}>
                        <AuthProvider>
                            <StatusBar style="light" backgroundColor="black" />
                            <SidebarMenuLayout>
                                <Stack screenOptions={{ headerShown: false }} />
                                <DownMenu />
                            </SidebarMenuLayout>
                        </AuthProvider>
                    </GestureHandlerRootView>
                </QueryClientProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}