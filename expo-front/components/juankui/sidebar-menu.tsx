import { menuItems, MenuItemType } from "@/constants/menu-items";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import {
    Bell,
    LogIn,
    Menu,
    X
} from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogoutButton } from "./logout-button";

const { width } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.8;
const ANIM_DURATION_OPEN = 220;
const ANIM_DURATION_CLOSE = 180;



// Item del menú memoizado: no re-renderiza si sus props no cambian
const MenuItem = React.memo(({
    item,
    onPress,

}: {
    item: MenuItemType;
    onPress: () => void;
}) => (
    <Pressable
        onPress={onPress}
        android_ripple={{ color: "rgba(0, 168, 204, 0.2)", borderless: false }}
        style={({ pressed }) => [
            item.active && styles.menuItemActive,
            Platform.OS === "ios" && pressed && { opacity: 0.6 },
        ]}
    >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12, paddingHorizontal: 16 }}>
            {React.createElement(item.icon, {
                size: 22,
                color: item.active ? "#00a8cc" : "#9ca3af"
            })}
            <Text style={[styles.menuLabel, item.active && styles.menuLabelActive]}>
                {item.label}
            </Text>
        </View>
    </Pressable>
));

export function SidebarMenuLayout({ children }: { children: React.ReactNode }) {
    // visibleState controla si el overlay recibe eventos de toque.
    // El sidebar NUNCA se desmonta: siempre está en el árbol, fuera de pantalla.
    const [overlayVisible, setOverlayVisible] = useState(false);
    const router = useRouter(); // ✅ aquí sí es válido
    const { user, loading } = useAuth();

    const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
    // Valor animado para el backdrop: evita re-renders al cambiar opacidad
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    const openMenu = useCallback(() => {
        setOverlayVisible(true);
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: 0,
                duration: ANIM_DURATION_OPEN,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: ANIM_DURATION_OPEN,
                useNativeDriver: true,
            }),
        ]).start();
    }, [translateX, backdropOpacity]);

    const closeMenu = useCallback((onDone?: () => void) => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: -SIDEBAR_WIDTH,
                duration: ANIM_DURATION_CLOSE,
                useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: ANIM_DURATION_CLOSE,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setOverlayVisible(false);
        });
    }, [translateX, backdropOpacity]);

    return (
        <View style={styles.root}>
            {/* Top App Bar */}
            <View style={styles.header}>
                <TouchableOpacity onPress={openMenu} style={styles.headerButton}>
                    <Menu size={24} color="#ffffff" />
                </TouchableOpacity>

                <Text style={styles.logoText}>FitWe</Text>

                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.headerButton}>
                        <Bell size={24} color="#ffffff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileAvatar}>
                        <Image
                            source={{
                                uri: user?.image ?? "https://via.placeholder.com/100",
                            }}
                            style={styles.avatarImg}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Contenido principal */}
            {children}

            {/*
              Overlay: siempre en el árbol, pero pointerEvents lo activa/desactiva.
              Así evitamos montar/desmontar en cada apertura.
            */}
            <View
                style={StyleSheet.absoluteFill}
                pointerEvents={overlayVisible ? "auto" : "none"}
            >
                {/* Backdrop animado — sin re-render del componente padre */}
                <Animated.View
                    style={[styles.backdrop, { opacity: backdropOpacity }]}
                >
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => closeMenu()} />
                </Animated.View>

                {/* Sidebar: siempre montado, solo se traslada fuera de pantalla */}
                <Animated.View
                    style={[styles.sidebar, { transform: [{ translateX }] }]}
                >
                    <SafeAreaView style={styles.sidebarInner}>
                        {/* Header */}
                        <View style={styles.sidebarHeader}>
                            <View>
                                <Image
                                    source={{
                                        uri: user?.image ?? "https://via.placeholder.com/100",
                                    }}
                                    style={styles.sidebarAvatar}
                                />
                                <Text style={styles.sidebarName}>{user?.name || ""}</Text>
                                <Text style={styles.sidebarEmail}>{user?.email || ""}</Text>
                            </View>
                            <TouchableOpacity onPress={() => closeMenu()} hitSlop={8}>
                                <X size={24} color="#9ca3af" />
                            </TouchableOpacity>
                        </View>

                        {/* Menú */}
                        <ScrollView
                            style={styles.menuScroll}
                            // Desactiva el scroll del backdrop cuando el sidebar está cerrado
                            scrollEnabled={overlayVisible}
                        >
                            {menuItems.map((item) => (
                                <MenuItem
                                    key={item.href}
                                    item={item}
                                    onPress={() => { closeMenu(); router.push(item.href as any) }}
                                />
                            ))}

                        </ScrollView>

                        {/* Footer */}
                        <View className="border-t border-neutral-800 px-4 py-4 gap-3">
                            {user ? (
                                <LogoutButton />
                            ) : (
                                <MenuItem
                                    key="/auth/login"
                                    item={{ href: "/auth/login", active: false, label: "Login", icon: LogIn }}
                                    onPress={() => { closeMenu(); router.push("/auth/login" as any) }}
                                />
                            )}
                            <Text style={styles.version}>V 0.4.0 • FITWE PRO</Text>
                        </View>
                    </SafeAreaView>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#0b0f14",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "#10141a",
        borderBottomWidth: 1,
        borderBottomColor: "#1e2530",
    },
    headerButton: {
        padding: 8,
    },
    logoText: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "800",
        letterSpacing: 0.5,
    },
    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    profileAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        overflow: "hidden",
        marginLeft: 4,
    },
    avatarImg: {
        width: "100%",
        height: "100%",
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    sidebar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: "#10141a",
    },
    sidebarInner: {
        flex: 1,
    },
    sidebarHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 24,
        backgroundColor: "#1c2230",
        borderBottomWidth: 1,
        borderBottomColor: "#2a3340",
    },
    sidebarAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
    },
    sidebarName: {
        color: "#ffffff",
        fontSize: 18,
        fontWeight: "700",
        marginTop: 12,
    },
    sidebarEmail: {
        color: "#9ca3af",
        fontSize: 13,
        marginTop: 2,
    },
    menuScroll: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 8,
        backgroundColor: "#0f1520",
    },
    menuItem: {
        flexDirection: "row",    // 👈 esto
        alignItems: "center",    // 👈 y esto
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 12,
    },
    menuItemActive: {
        backgroundColor: "rgba(0,168,204,0.12)",
    },
    menuLabel: {
        fontSize: 15,
        color: "#9ca3af",
        fontWeight: "500",
    },
    menuLabelActive: {
        color: "#00a8cc",
        fontWeight: "600",
    },
    sidebarFooter: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: "#2a3340",
        backgroundColor: "#0f1520",
        gap: 16,
    },
    logoutBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        padding: 14,
        backgroundColor: "#1a1f2a",
        borderRadius: 12,
    },
    logoutText: {
        color: "#ff6b6b",
        fontWeight: "700",
        fontSize: 15,
    },
    version: {
        fontSize: 11,
        color: "#4b5563",
        textAlign: "center",
    },
});