import { ClassItem } from "@/types/types";
import { Modal, Pressable, Text, View } from "react-native";


export function ClassDetailModal({ item, visible, onClose, onBook, onCancel }: {
    item: ClassItem;
    visible: boolean;
    onClose: () => void;
    onBook: () => void;
    onCancel: () => void;
}) {
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.1)" }} onPress={onClose} />
            <View style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 24,
                gap: 8,
            }}>
                <Text style={{ fontSize: 20, fontWeight: "700" }}>{item.name}</Text>
                <Text style={{ color: "#666" }}>{item.instructor}</Text>
                <Text style={{ color: "#666" }}>
                    {new Date(item.startTime).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                    {" – "}
                    {new Date(item.endTime).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Text style={{ color: item.isFull ? "#E24B4A" : "#0F6E56", marginTop: 4 }}>
                    {item.isFull ? "Clase completa" : `${item.spotsLeft} plazas disponibles`}
                </Text>

                <View style={{ marginTop: 16, gap: 10 }}>
                    {item.isBooked ? (
                        <Pressable onPress={onCancel} style={{
                            padding: 14, borderRadius: 12,
                            backgroundColor: "#E24B4A", alignItems: "center",
                        }}>
                            <Text style={{ color: "#fff", fontWeight: "600" }}>Cancelar reserva</Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            onPress={onBook}
                            disabled={item.isFull || !item.isOpen}
                            style={{
                                padding: 14, borderRadius: 12, alignItems: "center",
                                backgroundColor: item.isFull || !item.isOpen ? "#eee" : "#111",
                            }}
                        >
                            <Text style={{
                                fontWeight: "600",
                                color: item.isFull || !item.isOpen ? "#aaa" : "#fff",
                            }}>
                                {!item.isOpen ? "No disponible aún" : item.isFull ? "Sin plazas" : "Reservar plaza"}
                            </Text>
                        </Pressable>
                    )}

                    <Pressable onPress={onClose} style={{ alignItems: "center", padding: 10 }}>
                        <Text style={{ color: "#999" }}>Cerrar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}