import { ClassButtons } from "@/components/juankui/clases/class-buttons";
import { ClassDetailModal } from "@/components/juankui/clases/class-detail-modal";
import { WeekScheduleCalendar } from "@/components/juankui/clases/classweek-calendar";
import { getWeekDays, toISODate } from "@/lib/utils";
import { apiFetch } from "@/services/authService";
import { ClassItem } from "@/types/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    Calendar
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    Text,
    View
} from "react-native";
import { ClassCard } from "../../components/juankui/clases/class-card";



/* ---------------- COMPONENT ---------------- */

export default function ClassesScreen() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);

    const [view, setView] = useState<"today" | "week">("today");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
    const [showClassModal, setShowClassModal] = useState(false);


    /* ---------------- FETCH ---------------- */

    const fetchClasses = useCallback(
        async (v: "today" | "week", date: Date) => {
            setLoadingList(true);
            try {
                const params = new URLSearchParams({
                    view: v,
                    date: toISODate(date),
                });
                const res = await apiFetch<ClassItem[]>(`/classes?${params.toString()}`);
                setClasses(res.data ?? []);
            } finally {
                setLoadingList(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchClasses(view, selectedDate);
    }, [view, selectedDate, fetchClasses]);


    /* ---------------- ACTIONS ---------------- */

    const handleBook = async (classId: string) => {
        setActionId(classId);
        try {
            await apiFetch("/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ classId }),
            });
            fetchClasses(view, selectedDate);
        } finally {
            setActionId(null);
        }
    };

    const handleCancel = async (bookingId: string) => {
        setActionId(bookingId);
        try {
            await apiFetch(`/classes?bookingId=${bookingId}`, { method: "DELETE" });
            fetchClasses(view, selectedDate);
        } finally {
            setActionId(null);
        }
    };

    /* ---------------- NAVIGATION DAY ---------------- */

    const changeDay = (offset: number) => {
        setSelectedDate((prev) => {
            const next = new Date(prev);
            next.setDate(next.getDate() + offset);
            return next;
        });
    };

    const handlePressClass = (item: ClassItem) => {
        // si ya tienes un modal/bottom sheet de detalle:
        setSelectedClass(item);
        setShowClassModal(true);
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
            {/* Cabecera */}
            <View style={{ padding: 20, paddingBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Calendar size={28} />
                    <Text style={{ fontSize: 28, fontWeight: "700" }}>Clases</Text>
                </View>
                <Text style={{ color: "#666", marginTop: 6 }}>
                    Reserva tu plaza con hasta 48h de antelación
                </Text>
            </View>

            {/* Botones today / week + flechas de día */}
            <View style={{ paddingHorizontal: 10, marginBottom: 10 }}>
                <ClassButtons
                    selectedDate={selectedDate}
                    view={view}
                    setView={setView}
                    changeDay={changeDay}
                />
            </View>

            {/* Selector de fecha arbitraria */}
            <Pressable
                onPress={() => setShowPicker(true)}
                style={{
                    padding: 12,
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 12,
                    marginBottom: 20,
                }}
            >
                <Text>Ir a otra fecha</Text>
            </Pressable>

            {showPicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    onChange={(_, date) => {
                        setShowPicker(false);
                        if (date) setSelectedDate(date);
                    }}
                />
            )}

            {/* Lista de clases */}
            <View style={{ flex: 1 }}>
                {loadingList ? (
                    <ActivityIndicator style={{ marginTop: 20 }} />
                ) : view === "week" ? (
                    <>
                        {/* Vista semanal: SectionList agrupado por día */}
                        <WeekScheduleCalendar
                            weekDays={getWeekDays(selectedDate).map(d => d.date)}
                            classes={classes}
                            activeDays={[0, 1, 2, 3, 4, 5]}
                            onPressClass={handlePressClass}
                        />
                        {selectedClass && (
                            <ClassDetailModal
                                item={selectedClass}
                                visible={showClassModal}
                                onClose={() => setShowClassModal(false)}
                                onBook={() => {
                                    handleBook(selectedClass.id);
                                    setShowClassModal(false);
                                }}
                                onCancel={() => {
                                    if (selectedClass.userBookingId) {
                                        handleCancel(selectedClass.userBookingId);
                                    }
                                    setShowClassModal(false);
                                }}
                            />
                        )}
                    </>
                ) : (
                    // Vista diaria: lista simple
                    <FlatList
                        data={classes}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingBottom: 120,
                        }}
                        ListEmptyComponent={
                            <Text
                                style={{
                                    color: "#999",
                                    textAlign: "center",
                                    marginTop: 40,
                                }}
                            >
                                No hay clases este día
                            </Text>
                        }
                        renderItem={({ item }) => (
                            <ClassCard
                                item={item}
                                onBook={handleBook}
                                onCancel={handleCancel}
                                actionId={actionId}
                            />
                        )}
                    />
                )}
            </View>

        </View>
    );
}