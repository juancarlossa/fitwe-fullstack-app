import { apiFetch } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateSetsMutation(routineId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: async (payload: {
            exerciseId: string;
            sets: number;
        }) => {
            const res = await apiFetch(
                `/routines/${routineId}/exercises/${payload.exerciseId}`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ sets: payload.sets }),
                }
            );

            return res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["routine", routineId] });
        },
    });
}