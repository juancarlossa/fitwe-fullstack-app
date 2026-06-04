// WeekScheduleCalendar.tsx
import { ClassItem } from "@/types/types";
import React, { useEffect, useMemo, useRef } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const SLOT_H = 64;   // altura por franja horaria
const TIME_W = 44;

const DAYS_ES = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];


type Props = {
    weekDays: Date[];
    classes: ClassItem[];
    onPressClass: (item: ClassItem) => void;
    activeDays?: number[];
};

function pillColors(item: ClassItem) {
    if (item.isBooked) return { bg: "#185FA5", text: "#E6F1FB" };
    if (!item.isOpen) return { bg: "#D3D1C7", text: "#5F5E5A" };
    if (item.isFull) return { bg: "#5F5E5A", text: "#D3D1C7" };
    return { bg: "#0F6E56", text: "#E1F5EE" };
}

function toTimeLabel(iso: string) {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Clave canónica de franja: "HH:MM" extraída del ISO
function slotKey(iso: string) {
    return toTimeLabel(iso);
}

export function WeekScheduleCalendar({ weekDays, classes, onPressClass, activeDays }: Props) {
    const scrollRef = useRef<ScrollView>(null);
    const today = new Date();

    // Filtra días activos antes de renderizar
    const visibleDays = useMemo(() => {
        if (!activeDays) return weekDays.map((d, i) => ({ d, i }));
        return weekDays
            .map((d, i) => ({ d, i }))       // conserva el índice original (0=lun)
            .filter(({ i }) => activeDays.includes(i));
    }, [weekDays, activeDays]);

    // ── Franjas únicas ordenadas ─────────────────────────────────────────────
    const slots: string[] = useMemo(() => {
        const keys = new Set(classes.map(c => slotKey(c.startTime)));
        return Array.from(keys).sort();
    }, [classes]);

    // Índice de franja → posición top
    const slotIndex = useMemo(() => {
        const map: Record<string, number> = {};
        slots.forEach((s, i) => { map[s] = i; });
        return map;
    }, [slots]);

    // ── Clases agrupadas por día (0 = lunes) ─────────────────────────────────
    const classesByDay = useMemo(() => {
        const map: Record<number, ClassItem[]> = {};
        for (const c of classes) {
            const d = new Date(c.startTime);
            const dow = (d.getDay() + 6) % 7;
            if (!map[dow]) map[dow] = [];
            map[dow].push(c);
        }
        return map;
    }, [classes]);

    // Scroll a la franja más cercana a la hora actual
    useEffect(() => {
        if (slots.length === 0) return;
        const nowKey = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;
        // encuentra la primera franja >= ahora
        const idx = slots.findIndex(s => s >= nowKey);
        const target = (idx === -1 ? slots.length - 1 : Math.max(0, idx - 1)) * SLOT_H;
        setTimeout(() => scrollRef.current?.scrollTo({ y: target, animated: false }), 150);
    }, [slots]);

    const totalH = slots.length * SLOT_H;

    return (
        <View style={{ flex: 1 }}>
            {/* ── Cabecera días ── */}
            <View style={{
                flexDirection: "row",
                paddingBottom: 8,
                borderBottomWidth: 0.5,
                borderBottomColor: "#ddd",
            }}>
                <View style={{ width: TIME_W }} />
                {visibleDays.map(({ d, i }) => {
                    const isToday = d.toDateString() === today.toDateString();
                    return (
                        <View key={i} style={{ flex: 1, alignItems: "center" }}>
                            <Text style={{
                                fontSize: 10, color: "#999",
                                textTransform: "uppercase", letterSpacing: 0.5,
                            }}>
                                {DAYS_ES[i]}
                            </Text>
                            <View style={isToday ? {
                                width: 26, height: 26, borderRadius: 13,
                                backgroundColor: "#111",
                                alignItems: "center", justifyContent: "center", marginTop: 2,
                            } : { marginTop: 2 }}>
                                <Text style={{
                                    fontSize: 15, fontWeight: "500",
                                    color: isToday ? "#fff" : "#111",
                                }}>
                                    {d.getDate()}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* ── Grid scrollable ── */}
            <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: "row" }}>

                    {/* Eje Y: solo franjas con clases */}
                    <View style={{ width: TIME_W }}>
                        {slots.map((slot, i) => (
                            <View key={slot} style={{
                                height: SLOT_H,
                                justifyContent: "center",
                                alignItems: "flex-end",
                                paddingRight: 8,
                                borderTopWidth: i === 0 ? 0 : 0.5,
                                borderTopColor: "#eee",
                            }}>
                                <Text style={{ fontSize: 11, color: "#aaa", fontVariant: ["tabular-nums"] }}>
                                    {slot}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Columnas de días */}
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        {visibleDays.map(({ d, i }) => (
                            <View key={i} style={{
                                flex: 1,
                                height: totalH,
                                borderLeftWidth: 0.5,
                                borderLeftColor: "#eee",
                            }}>
                                {/* Líneas horizontales por franja */}
                                {slots.map((_, i) => (
                                    <View key={i} style={{
                                        position: "absolute",
                                        top: i * SLOT_H,
                                        left: 0, right: 0,
                                        height: 0.5,
                                        backgroundColor: "#eee",
                                    }} />
                                ))}

                                {/* Pastillas de clases */}
                                {(classesByDay[i] ?? []).map(item => {
                                    const key = slotKey(item.startTime);
                                    const rowIdx = slotIndex[key] ?? 0;
                                    const { bg, text } = pillColors(item);

                                    return (
                                        <Pressable
                                            key={item.id}
                                            onPress={() => onPressClass(item)}
                                            style={{
                                                position: "absolute",
                                                top: rowIdx * SLOT_H + 4,
                                                left: 2, right: 2,
                                                height: SLOT_H - 10,
                                                backgroundColor: bg,
                                                borderRadius: 6,
                                                padding: 5,
                                                overflow: "hidden",
                                            }}
                                        >
                                            <Text numberOfLines={1} style={{
                                                fontSize: 9, fontWeight: "600", color: text,
                                            }}>
                                                {item.name}
                                            </Text>
                                            <Text numberOfLines={1} style={{
                                                fontSize: 9, color: text, opacity: 0.75, marginTop: 1,
                                            }}>
                                                {item.instructor}
                                            </Text>
                                            <Text style={{
                                                fontSize: 8, color: text, opacity: 0.6, marginTop: 2,
                                            }}>
                                                {toTimeLabel(item.startTime)}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}