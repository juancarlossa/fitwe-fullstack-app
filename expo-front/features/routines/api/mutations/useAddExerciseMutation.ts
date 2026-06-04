import { apiFetch } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddExerciseMutation(routineId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            exerciseId: string;
            sets: number;
        }) => {
            await apiFetch(`/routines/${routineId}/exercises`, {
                method: "POST",
                body: JSON.stringify({
                    ...payload,
                    reps: 0,
                    weight: 0,
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