import { Modal, Pressable, Text, TextInput, View } from "react-native";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    name: string;
    setName: (v: string) => void;
    loading: boolean;
    error?: string;
};

export function ModalCreateRoutine({
    visible,
    onClose,
    onSubmit,
    name,
    setName,
    loading,
    error,
}: Props) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View className="flex-1 bg-black/70 justify-end">

                <View className="bg-neutral-900 p-5 rounded-t-3xl">

                    <Text className="text-white text-xl font-bold mb-4">
                        Nueva rutina
                    </Text>

                    <TextInput
                        value={name}
                        onChangeText={setName}
                        placeholder="Nombre de la rutina"
                        placeholderTextColor="#666"
                        className="bg-neutral-800 text-white px-4 py-3 rounded-xl mb-3"
                    />

                    {error ? (
                        <Text className="text-red-400 mb-2">
                            {error}
                        </Text>
                    ) : null}

                    <View className="flex-row gap-3">

                        <Pressable
                            onPress={onClose}
                            className="flex-1 bg-neutral-800 py-3 rounded-xl"
                        >
                            <Text className="text-white text-center">
                                Cancelar
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={onSubmit}
                            disabled={loading}
                            className="flex-1 bg-cyan-500 py-3 rounded-xl"
                        >
                            <Text className="text-black text-center font-bold">
                                {loading ? "Creando..." : "Crear"}
                            </Text>
                        </Pressable>

                    </View>

                </View>
            </View>
        </Modal>
    );
}