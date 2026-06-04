import { Exercise, SetItem } from "@/types/types";
import { Check, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useAddSetMutation } from "../api/mutations/useAddSetMutation";
import { useDeleteExerciseMutation } from "../api/mutations/useDeleteExerciseMutation";
import { useUpdateSetMutation } from "../api/mutations/useUpdateSetMutation";



type Props = {
    item: {
        id: string;
        sets: SetItem[];
        exercise: Exercise
    };
    routineId: string;
    onAddSet: (exerciseId: string) => void;
    onUpdateSet: (
        exerciseId: string,
        setId: string,
        data: Partial<SetItem>
    ) => void;
};

export default function ExerciseItem({ item, routineId }: Props) {
    const safeSets = Array.isArray(item.sets) ? item.sets : [];

    const addSetMutation = useAddSetMutation(routineId, item.id);
    const updateSetMutation = useUpdateSetMutation(routineId);
    const [draftSets, setDraftSets] = useState<Record<string, any>>({});
    const deleteMutation = useDeleteExerciseMutation(routineId);

    useEffect(() => {
        const initial: Record<string, any> = {};

        safeSets.forEach((set) => {
            initial[set.id] = {
                weight: set.weight?.toString() ?? "",
                reps: set.reps?.toString() ?? "",
            };
        });

        setDraftSets(initial);
    }, []); // 👈 SOLO UNA VEZ

    const handleChange = (setId: string, field: string, value: string) => {
        setDraftSets((prev) => ({
            ...prev,
            [setId]: {
                ...prev[setId],
                [field]: value,
            },
        }));
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{item.exercise.name}</Text>

            {/* SET LIST */}
            {safeSets.map((set) => (
                <View key={set.id} style={styles.row}>
                    <Text style={styles.setNum}>#{set.setNumber}</Text>

                    {/* WEIGHT */}
                    <TextInput
                        value={draftSets[set.id]?.weight ?? ""}
                        keyboardType="numeric"
                        style={styles.input}
                        onChangeText={(v) => handleChange(set.id, "weight", v)}
                        onBlur={() => {
                            updateSetMutation.mutate({
                                setId: set.id,
                                weight: Number(draftSets[set.id]?.weight || 0),
                                reps: Number(draftSets[set.id]?.reps || 0),
                            });
                        }}
                    />

                    {/* REPS */}
                    <TextInput
                        value={draftSets[set.id]?.reps ?? ""}
                        keyboardType="numeric"
                        style={styles.input}
                        onChangeText={(v) => handleChange(set.id, "reps", v)}
                        onBlur={() => {
                            updateSetMutation.mutate({
                                setId: set.id,
                                weight: Number(draftSets[set.id]?.weight || 0),
                                reps: Number(draftSets[set.id]?.reps || 0),
                            });
                        }}
                    />

                    {/* COMPLETE */}
                    <Pressable
                        onPress={() =>
                            updateSetMutation.mutate({
                                setId: set.id,
                                completed: !set.completed,
                            })
                        }
                        style={[
                            styles.checkButton,
                            set.completed && styles.checkActive,
                        ]}
                    >
                        <Check size={16} color="#fff" />
                    </Pressable>

                    <Pressable
                        onPress={() => deleteMutation.mutate(item.id)}
                    >
                        <Trash2 size={24} color="#ff6b6b" />
                    </Pressable>
                </View>
            ))}

            {/* ADD SET */}
            <Pressable
                onPress={() => addSetMutation.mutate()}
                style={styles.addBtn}
            >
                <Text style={styles.addText}>+ Añadir serie</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#10141a",
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    title: {
        color: "#fff",
        fontWeight: "bold",
        marginBottom: 12,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 8,
    },
    setNum: {
        color: "#4b5563",
        width: 20,
    },
    prev: {
        color: "#4b5563",
        flex: 1,
    },
    input: {
        backgroundColor: "#181c22",
        color: "#fff",
        padding: 6,
        width: 60,
        borderRadius: 8,
        textAlign: "center",
    },
    checkButton: {
        padding: 6,
        backgroundColor: "#181c22",
        borderRadius: 8,
    },
    checkActive: {
        backgroundColor: "#00a8cc",
    },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        gap: 6,
    },
    addText: {
        color: "#00a8cc",
        fontWeight: "600",
    },
});