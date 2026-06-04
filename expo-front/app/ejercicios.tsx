import { API_URL, NEXT_URL } from "@/constants/constants";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";


type Exercise = {
    id: string;
    name: string;
    muscleGroup: string;
    equipment?: string;
    imageUrl?: string | null;
};

export default function ExerciseCatalog() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterMuscle, setFilterMuscle] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetchExercises();
    }, []);

    const fetchExercises = async () => {
        try {
            const res = await fetch(`${API_URL}/exercises`);
            const data = await res.json();

            setExercises(data);
        } catch (e) {
            console.log("Error loading exercises:", e);
        } finally {
            setLoading(false);
        }
    };

    const filteredExercises = useMemo(() => {
        return exercises.filter((ex) => {
            const matchesSearch = ex.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchesMuscle = filterMuscle
                ? ex.muscleGroup === filterMuscle
                : true;

            return matchesSearch && matchesMuscle;
        });
    }, [exercises, search, filterMuscle]);



    return (
        <View style={{ flex: 1, padding: 16, backgroundColor: "#0f0f0f" }}>
            {/* HEADER */}
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "white" }}>
                Catálogo de Ejercicios
            </Text>

            <Text style={{ color: "#aaa", marginBottom: 12 }}>
                Explora ejercicios disponibles: {exercises.length}
            </Text>


            {/* SEARCH */}
            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar ejercicio..."
                placeholderTextColor="#666"
                style={{
                    backgroundColor: "#1f1f1f",
                    padding: 12,
                    borderRadius: 12,
                    color: "white",
                    marginBottom: 10,
                }}
            />

            {/* FILTER SIMPLE */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ height: 60 }}
                contentContainerStyle={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    gap: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 4,
                }}
            >
                {["", "Pecho", "Espalda", "Pierna", "Brazo", "Hombro"].map((g) => (
                    <Pressable
                        key={g}
                        onPress={() => setFilterMuscle(g)}
                        style={{
                            paddingVertical: 6,
                            paddingHorizontal: 14,
                            borderRadius: 20,
                            backgroundColor: filterMuscle === g ? "#00a8cc" : "#1f1f1f",
                        }}
                    >
                        <Text style={{ color: "white", fontSize: 13 }}>
                            {g === "" ? "Todos" : g}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* GRID */}
            <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {
                            Haptics.selectionAsync();
                            router.push(`/ejercicios/${item.id}` as any);
                        }}
                        style={{
                            flex: 1,
                            backgroundColor: "#1a1a1a",
                            borderRadius: 16,
                            padding: 12,
                            marginBottom: 12,
                        }}
                    >
                        {/* IMAGE */}
                        <View
                            style={{
                                width: "100%",
                                height: 100,
                                borderRadius: 12,
                                overflow: "hidden",
                                backgroundColor: "#333",
                                marginBottom: 10,
                            }}
                        >
                            {item.imageUrl ? (
                                <Image
                                    source={{ uri: `${NEXT_URL}${item.imageUrl}` }}
                                    style={{ width: "100%", height: "100%" }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ color: "#777" }}>Sin imagen</Text>
                                </View>
                            )}
                        </View>

                        {/* INFO */}
                        <Text style={{ color: "white", fontWeight: "bold" }} numberOfLines={1}>
                            {item.name}
                        </Text>

                        <Text style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>
                            {item.muscleGroup}
                            {item.equipment ? ` • ${item.equipment}` : ""}
                        </Text>
                    </Pressable>
                )}
            />
        </View>
    );
}