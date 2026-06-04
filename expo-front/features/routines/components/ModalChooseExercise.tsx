import { Exercise } from "@/types/types";
import { Dumbbell, Search, X } from "lucide-react-native";
import React from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type Step = "picker" | "config";

type Props = {
    visible: boolean;
    step: Step;
    setStep: (step: Step) => void;

    availableExercises: Exercise[];

    search: string;
    setSearch: (v: string) => void;

    selectedExercise: Exercise | null;
    onSelectExercise: (exercise: Exercise) => void;

    sets: number;
    setSets: (n: number) => void;

    submitting: boolean;
    onConfirm: () => void;

    onClose: () => void;
};

export default function ModalChooseExercise({
    visible,
    step,
    setStep,

    availableExercises,

    search,
    setSearch,

    selectedExercise,
    onSelectExercise,

    sets,
    setSets,

    submitting,
    onConfirm,

    onClose,
}: Props) {
    const filteredExercises = availableExercises.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.container}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {step === "picker" ? "Elegir ejercicio" : "Configurar"}
                    </Text>

                    <Pressable onPress={onClose} style={styles.closeBtn}>
                        <X size={24} color="#fff" />
                    </Pressable>
                </View>

                {/* STEP 1 - PICKER */}
                {step === "picker" ? (
                    <View style={{ flex: 1 }}>
                        <View style={styles.searchContainer}>
                            <Search size={18} color="#4b5563" />
                            <TextInput
                                value={search}
                                onChangeText={setSearch}
                                placeholder="Buscar ejercicio..."
                                placeholderTextColor="#4b5563"
                                style={styles.searchInput}
                            />
                        </View>

                        <FlatList
                            data={filteredExercises}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => {
                                        onSelectExercise(item);
                                        setStep("config");
                                    }}
                                    style={styles.item}
                                >
                                    <View style={styles.iconBox}>
                                        <Dumbbell size={20} color="#00a8cc" />
                                    </View>

                                    <View>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <Text style={styles.muscle}>{item.muscleGroup}</Text>
                                    </View>
                                </Pressable>
                            )}
                        />
                    </View>
                ) : (
                    /* STEP 2 - CONFIG */
                    <View style={styles.config}>
                        <View style={styles.selectedBox}>
                            <Text style={styles.label}>EJERCICIO SELECCIONADO</Text>
                            <Text style={styles.value}>{selectedExercise?.name}</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>SERIES INICIALES</Text>

                            <TextInput
                                value={String(sets)}
                                onChangeText={(v) => setSets(Number(v))}
                                keyboardType="numeric"
                                style={styles.input}
                            />
                        </View>

                        <Pressable
                            onPress={onConfirm}
                            disabled={submitting}
                            style={[styles.primaryBtn, submitting && { opacity: 0.7 }]}
                        >
                            <Text style={styles.primaryText}>
                                {submitting ? "Añadiendo..." : "Confirmar y Añadir"}
                            </Text>
                        </Pressable>

                        <Pressable onPress={() => setStep("picker")} style={styles.backBtn}>
                            <Text style={styles.backText}>Volver a la lista</Text>
                        </Pressable>
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0a0e14",
        paddingTop: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 20,
        alignItems: "center",
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },

    closeBtn: {
        padding: 8,
        backgroundColor: "#181c22",
        borderRadius: 20,
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#181c22",
        marginHorizontal: 20,
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#353940",
    },

    searchInput: {
        flex: 1,
        marginLeft: 12,
        color: "#fff",
        fontSize: 16,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        marginHorizontal: 20,
        backgroundColor: "#10141a",
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#181c22",
    },

    iconBox: {
        width: 44,
        height: 44,
        backgroundColor: "#181c22",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },

    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },

    muscle: {
        fontSize: 12,
        color: "#4b5563",
        marginTop: 2,
    },

    config: {
        paddingHorizontal: 20,
    },

    selectedBox: {
        backgroundColor: "#181c22",
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#353940",
    },

    label: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#00a8cc",
        letterSpacing: 1,
        marginBottom: 8,
    },

    value: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },

    inputGroup: {
        marginBottom: 32,
    },

    input: {
        backgroundColor: "#181c22",
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
        borderWidth: 1,
        borderColor: "#353940",
    },

    primaryBtn: {
        backgroundColor: "#00a8cc",
        height: 56,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
    },

    primaryText: {
        color: "#0a0e14",
        fontSize: 16,
        fontWeight: "bold",
    },

    backBtn: {
        marginTop: 20,
        alignItems: "center",
    },

    backText: {
        color: "#4b5563",
        fontSize: 14,
    },
});