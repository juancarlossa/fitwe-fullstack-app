import { ModalCreateRoutine } from "@/components/juankui/create-routine-modal";
import { PlusButton } from "@/components/juankui/plus-button";
import { apiFetch } from "@/services/authService";
import { useRouter } from "expo-router";
import { Trash2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

type Routine = {
    id: string;
    name: string;
    createdAt: string;
    exercises?: {
        exercise: {
            name: string;
        };
    }[];
};

export default function RoutinesScreen() {
    const router = useRouter();

    const [routines, setRoutines] = useState<Routine[]>([]);
    const [loading, setLoading] = useState(true); // SOLO fetch inicial

    const [creating, setCreating] = useState(false); // POST rutina
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [name, setName] = useState("");
    const [error, setError] = useState("");

    const fetchRoutines = async () => {
        try {
            const res = await apiFetch<Routine[]>("/routines", {});

            if (res.data) {
                setRoutines(res.data);
            }
        } catch (e) {
            console.log("Error loading routines", e);
        } finally {
            setLoading(false);
        }
    };

    const createRoutine = async () => {
        if (!name.trim()) return;

        try {
            setCreating(true);
            setError("");

            const res = await apiFetch<Routine>("/routines", {
                method: "POST",
                body: JSON.stringify({ name }),
            });

            if (res.error || res.unauthorized) {
                throw new Error(res.error || "No autorizado");
            }


            setName("");
            setIsModalOpen(false);

            await fetchRoutines();

        } catch (e: any) {
            setError(e.message);
        } finally {
            setCreating(false);
        }
    };

    useEffect(() => {
        fetchRoutines();
    }, []);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator color="white" />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black px-4 pt-6">

            <Text className="text-white text-2xl font-bold">
                Mis Rutinas
            </Text>

            <Text className="text-neutral-400 mt-1 mb-6">
                Gestiona tus planes de entrenamiento
            </Text>

            <PlusButton onPress={() => {
                console.log("PLUS PRESSED");
                setIsModalOpen(true);
            }} />
            <ModalCreateRoutine
                visible={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={createRoutine}
                name={name}
                setName={setName}
                loading={creating}   // 👈 IMPORTANTE
                error={error}
            />

            <FlatList
                data={routines}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() =>
                            router.push(`/entrenamientos/${item.id}` as any)
                        }
                        className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-4 active:opacity-70"
                    >
                        <Text className="text-white text-lg font-bold">
                            {item.name}
                        </Text>

                        <Text className="text-neutral-400 text-sm mt-2">
                            {item.exercises?.length
                                ? item.exercises
                                    .map((e) => e.exercise.name)
                                    .join(", ")
                                : "Sin ejercicios"}
                        </Text>

                        {/* DELETE BUTTON SIMPLE */}
                        <Pressable
                            onPress={async () => {
                                await apiFetch(`/routines/${item.id}`, {
                                    method: "DELETE",
                                });
                                fetchRoutines();
                            }}
                            className=" bg-red-500/10 border border-red-500/30 py-2 rounded-xl self-end w-10 flex-1 items-center"
                        >
                            <Trash2 size={20} color="#ef4444" />
                        </Pressable>
                    </Pressable>
                )}
            />
        </View>
    );
}