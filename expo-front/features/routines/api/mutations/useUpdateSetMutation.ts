import { apiFetch } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateSetMutation(routineId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            setId: string;
            weight?: number;
            reps?: number;
            completed?: boolean;
        }) => {
            const res = await apiFetch(`/sets/${data.setId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            return res.data;
        },

        onMutate: async (updated) => {
            await queryClient.cancelQueries({ queryKey: ["routine", routineId] });

            const previous = queryClient.getQueryData(["routine", routineId]);

            queryClient.setQueryData(["routine", routineId], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    exercises: old.exercises.map((ex: any) => ({
                        ...ex,
                        sets: ex.sets.map((s: any) =>
                            s.id === updated.setId ? { ...s, ...updated } : s
                        ),
                    })),
                };
            });

            return { previous };
        },

        onError: (_err, _vars, ctx) => {
            queryClient.setQueryData(["routine", routineId], ctx?.previous);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["routine", routineId] });
        },
    });
}