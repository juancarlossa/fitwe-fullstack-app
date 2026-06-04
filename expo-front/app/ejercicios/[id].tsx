import { NEXT_URL } from "@/constants/constants";
import { apiFetch } from "@/services/authService";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";


type Exercise = {
    id: string;
    name: string;
    description: string;
    muscleGroup: string;
    equipment: string;
    imageUrl: string;
};

export default function ExerciseDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [data, setData] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchExercise = async () => {
            try {

                const res = await apiFetch<Exercise>(`/exercises/${id}`);

                if (res.unauthorized) {
                    setError("No autorizado");
                    return;
                }

                if (res.error || !res.data) {
                    throw new Error(res.error || "Error");
                }

                setData(res.data);
            } catch (e) {
                setError("No se pudo cargar el ejercicio");
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [id]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: "red" }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#000", padding: 16 }}>
            <Image
                source={{ uri: `${NEXT_URL}${data.imageUrl}` }}
                style={{ width: "100%", height: 220, borderRadius: 16 }}
                resizeMode="cover"
            />

            <Text style={{ color: "white", fontSize: 24, fontWeight: "bold", marginTop: 16 }}>
                {data.name}
            </Text>

            <Text style={{ color: "#aaa", marginTop: 8 }}>
                {data.muscleGroup} • {data.equipment}
            </Text>

            <Text style={{ color: "#ccc", marginTop: 16, lineHeight: 20 }}>
                {data.description}
            </Text>
        </View>
    );
}