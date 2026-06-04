import { useDeleteExerciseMutation } from "@/features/routines/api/mutations/useDeleteExerciseMutation";
import { useReorderExercisesMutation } from "@/features/routines/api/mutations/useReorderExercisesMutation";
import { useUpdateSetsMutation } from "@/features/routines/api/mutations/useUpdateSetsMutation";
import { useRoutineQuery } from "@/features/routines/api/useRoutineQuery";
import ExerciseItem from "@/features/routines/components/ExerciseItem";
import ModalChooseExercise from "@/features/routines/components/ModalChooseExercise";
import { useRoutineModal } from "@/features/routines/hooks/useRoutineModal";
import { RoutineExercise } from "@/types/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ArrowLeft,
    MoreHorizontal,
    Plus
} from "lucide-react-native";
import React from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    View
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RoutineDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const { data: routine, isLoading } = useRoutineQuery(id);

    const deleteMutation = useDeleteExerciseMutation(id);
    const updateSetsMutation = useUpdateSetsMutation(id);
    const reorderMutation = useReorderExercisesMutation(id);

    const modal = useRoutineModal(id);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00a8cc" />
            </View>
        );
    }

    if (!routine) return null;

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">

                {/* HEADER */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.iconBtn}>
                        <ArrowLeft size={24} color="#fff" />
                    </Pressable>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>{routine.name}</Text>
                        <Text style={styles.headerDate}>
                            {new Date(routine.createdAt).toLocaleDateString()}
                        </Text>
                    </View>

                    <Pressable style={styles.iconBtn}>
                        <MoreHorizontal size={24} color="#fff" />
                    </Pressable>
                </View>

                {/* LIST */}
                <View style={styles.container}>
                    <DraggableFlatList<RoutineExercise>
                        data={routine.exercises}
                        keyExtractor={(item) => item.id}
                        onDragEnd={({ data }) => {
                            reorderMutation.mutate(
                                data.map((x, i) => ({
                                    id: x.id,
                                    order: i,
                                }))
                            );
                        }}
                        ListHeaderComponent={() => (
                            <Pressable
                                onPress={modal.openModal}
                                style={styles.addBtn}
                            >
                                <Plus size={24} color="#00a8cc" />
                                <Text style={styles.addText}>AÑADIR EJERCICIO</Text>
                            </Pressable>
                        )}
                        renderItem={({ item, drag, isActive }) => (
                            <ExerciseItem
                                routineId={routine.id}
                                item={item}
                                onAddSet={
                                    //(exerciseId) => addSetMutation.mutate(exerciseId)
                                    () => { console.log("addSet"); }
                                }
                                onUpdateSet={
                                    //(exerciseId, setId, data) =>
                                    //updateSetMutation.mutate({ exerciseId, setId, data })
                                    () => { console.log("updateSet"); }
                                }
                            />
                        )}
                    />
                </View>
            </KeyboardAvoidingView>

            <ModalChooseExercise
                visible={modal.open}
                step={modal.step}
                setStep={modal.setStep}
                availableExercises={modal.availableExercises}
                search={modal.search}
                setSearch={modal.setSearch}
                selectedExercise={modal.selectedExercise}
                onSelectExercise={modal.selectExercise} // 👈 aquí el fix
                sets={modal.sets}
                setSets={modal.setSets}
                submitting={modal.submitting}
                onConfirm={modal.confirm}
                onClose={modal.closeModal}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#0a0e14",
    },

    loadingContainer: {
        flex: 1,
        backgroundColor: "#0a0e14",
        justifyContent: "center",
        alignItems: "center",
    },

    header: {
        height: 64,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#181c22",
    },

    headerTitleContainer: {
        flex: 1,
        alignItems: "center",
    },

    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
    },

    headerDate: {
        fontSize: 12,
        color: "#4b5563",
        marginTop: 2,
    },

    iconBtn: {
        padding: 8,
    },

    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },

    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        backgroundColor: "#10141a",
        borderWidth: 2,
        borderStyle: "dashed",
        borderColor: "#181c22",
        borderRadius: 20,
        paddingVertical: 18,
        marginBottom: 20,
    },

    addText: {
        color: "#00a8cc",
        fontSize: 16,
        fontWeight: "bold",
    },

    card: {
        backgroundColor: "#10141a",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#181c22",
        padding: 16,
        marginBottom: 16,
    },

    cardActive: {
        borderColor: "#00a8cc",
        backgroundColor: "#181c22",
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },

    drag: {
        paddingRight: 4,
    },

    img: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#181c22",
    },

    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },

    sub: {
        fontSize: 10,
        color: "#00a8cc",
        marginTop: 2,
    },

    delete: {
        padding: 8,
        backgroundColor: "rgba(255,107,107,0.1)",
        borderRadius: 10,
    },

    sets: {
        borderTopWidth: 1,
        borderTopColor: "#181c22",
        paddingTop: 12,
    },

    setsLabel: {
        fontSize: 10,
        color: "#4b5563",
        marginBottom: 10,
        fontWeight: "bold",
    },

    setsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    btn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#181c22",
        justifyContent: "center",
        alignItems: "center",
    },

    btnText: {
        color: "#fff",
        fontSize: 20,
    },

    setsValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        flex: 1,
        textAlign: "center",
    },
});