import { capitalize } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

type Props = {
    selectedDate: Date;
    view: "today" | "week";
    setView: (v: "today" | "week") => void;
    changeDay: (delta: number) => void;
};

export function ClassButtons({
    selectedDate,
    view,
    setView,
    changeDay,
}: Props) {
    const formatDate = capitalize(
        selectedDate.toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
            month: "2-digit",
        })
    );

    const Tab = ({
        label,
        active,
        onPress,
    }: {
        label: string;
        active: boolean;
        onPress: () => void;
    }) => (
        <Pressable
            onPress={onPress}
            style={{
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 10,
                backgroundColor: active ? "#007AFF" : "#eee",
            }}
        >
            <Text style={{ color: active ? "#fff" : "#000", fontWeight: "600" }}>
                {label}
            </Text>
        </Pressable>
    );

    const IconButton = ({
        children,
        onPress,
    }: {
        children: React.ReactNode;
        onPress: () => void;
    }) => (
        <Pressable
            onPress={onPress}
            style={{
                padding: 10,
                borderRadius: 10,
                backgroundColor: "#eee",
            }}
        >
            {children}
        </Pressable>
    );

    return (
        <View style={{ gap: 12, marginBottom: 16 }}>
            {/* TOP ROW: SWITCH + NAV */}
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                {/* SWITCH */}
                <View style={{ flexDirection: "row", gap: 8 }}>
                    <Tab
                        label="Hoy"
                        active={view === "today"}
                        onPress={() => setView("today")}
                    />
                    <Tab
                        label="Semana"
                        active={view === "week"}
                        onPress={() => setView("week")}
                    />
                </View>

                {/* NAV */}
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <IconButton onPress={() => changeDay(-1)}>
                        <ChevronLeft size={18} />
                    </IconButton>

                    <Text style={{ fontWeight: "700", fontSize: 13 }}>
                        {formatDate}
                    </Text>

                    <IconButton onPress={() => changeDay(1)}>
                        <ChevronRight size={18} />
                    </IconButton>
                </View>
            </View>
        </View>
    );
}