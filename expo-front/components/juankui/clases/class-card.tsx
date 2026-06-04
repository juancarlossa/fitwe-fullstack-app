import { Pressable, Text, View } from "react-native";

interface ClassItem {
    id: string;
    name: string;
    instructor: string;
    capacity: number;
    startTime: string;
    endTime: string;
    spotsLeft: number;
    isOpen: boolean;
    isFull: boolean;
    opensAt: string | null;
    userBookingId: string | null;
    isBooked: boolean;
}

export function ClassCard({
    item,
    onBook,
    onCancel,
    actionId,
}: {
    item: ClassItem;
    onBook: (id: string) => void;
    onCancel: (id: string) => void;
    actionId: string | null;
}) {
    const start = new Date(item.startTime).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const end = new Date(item.endTime).toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
    });

    function timeUntil(dateStr: string) {
        const diff = new Date(dateStr).getTime() - Date.now();

        if (diff <= 0) return "Ahora";

        const hours = Math.floor(diff / 3600000);
        const mins = Math.floor((diff % 3600000) / 60000);

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }

        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    }

    return (
        <View
            style={{
                padding: 16,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#ddd",
                marginBottom: 12,
            }}
        >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>
                {item.name}
            </Text>

            <View style={{ marginTop: 8, gap: 6 }}>
                <Text>🕒 {start} - {end}</Text>
                <Text>👤 {item.instructor}</Text>
                <Text>👥 {item.spotsLeft} plazas libres</Text>
            </View>

            <View style={{ marginTop: 16 }}>
                {item.isBooked ? (
                    <Pressable onPress={() => onCancel(item.userBookingId!)}>
                        <Text style={{ color: "red", fontWeight: "600" }}>
                            Cancelar reserva
                        </Text>
                    </Pressable>
                ) : !item.isOpen ? (
                    <Text>🔒 Abre en {timeUntil(item.opensAt!)}</Text>
                ) : item.isFull ? (
                    <Text style={{ color: "red", fontWeight: "700" }}>
                        Completa
                    </Text>
                ) : (
                    <Pressable onPress={() => onBook(item.id)}>
                        <Text style={{ color: "#007AFF", fontWeight: "700" }}>
                            {actionId === item.id ? "Reservando..." : "Reservar"}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}