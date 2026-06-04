import { apiFetch } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useReorderExercisesMutation(routineId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: { id: string; order: number }[]) => {
            await apiFetch(`/routines/${routineId}/reorder`, {
                method: "PATCH",
                body: JSON.stringify({
                    orderUpdates: data,
                }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["routine", routineId],
            });
        },
    });
}