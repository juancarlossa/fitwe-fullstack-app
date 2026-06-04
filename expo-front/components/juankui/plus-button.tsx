import * as Haptics from "expo-haptics";
import { Plus } from "lucide-react-native";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

export function PlusButton({ onPress }: { onPress: () => void }) {
    const scale = useRef(new Animated.Value(1)).current;
    const pressIn = () => {
        Animated.spring(scale, {
            toValue: 0.92,
            useNativeDriver: true,
        }).start();
    };

    const pressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={[styles.fab, { transform: [{ scale }] }, { zIndex: 999, elevation: 999 }]}>
            <Pressable
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onPress();
                }}
                onPressIn={pressIn}
                onPressOut={pressOut}

            >
                <Plus size={32} color="#000" />
            </Pressable>
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#00a8cc',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#00a8cc',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});