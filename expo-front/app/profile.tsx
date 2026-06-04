import { API_URL } from "@/constants/constants";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { apiFetch, AuthUserType } from "../services/authService";

export default function MeProfile() {
    const [user, setUser] = useState<AuthUserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadMe();
    }, []);

    const loadMe = async () => {
        setLoading(true);

        try {
            const path = "/me";
            const url = API_URL + path;

            const res = await apiFetch<AuthUserType>(path, {
                method: "GET",
            });

            if (res.unauthorized) {
                console.log("No autorizado");
                setError("No autorizado");
                setLoading(false);
                return;
            }

            if (res.error) {
                console.log("Error:", res.error);
                setError(res.error);
                setLoading(false);
                return;
            }

            setUser(res.data);
        } catch (e) {
            console.log("Error inesperado:", e);
            setError("Error inesperado");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-red-500">{error}</Text>
            </View>
        );
    }

    if (!user) return null;

    return (
        <View className="flex-1 bg-black p-6">
            <Image
                source={{
                    uri: user.image ?? "https://via.placeholder.com/100",
                }}
                className="w-20 h-20 rounded-full mb-4"
            />

            <Text className="text-white text-xl font-bold">
                {user.name}
            </Text>

            <Text className="text-gray-400">{user.email}</Text>

            <Text className="text-gray-400 mt-2">
                Rol: {user.role}
            </Text>
            <Text className="text-gray-400 mt-2">
                Fecha de caducidad: {user.subscriptionEndDate}
            </Text>
            <Text className="text-gray-400 mt-2">
                Status: {user.subscriptionStatus}
            </Text>
        </View>
    );
}