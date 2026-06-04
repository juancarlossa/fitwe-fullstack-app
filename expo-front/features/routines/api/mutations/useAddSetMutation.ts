import { apiFetch } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAddSetMutation(
    routineId: string,
    routineExerciseId: string
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            const res = await apiFetch(
                `/routines/${routineId}/exercises/${routineExerciseId}/sets`,
                {
                    method: "POST",
                }
            );

            return res.data;
        },

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ["routine", routineId] });

            const previous = queryClient.getQueryData(["routine", routineId]);

            queryClient.setQueryData(["routine", routineId], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    exercises: old.exercises.map((ex: any) => {
                        if (ex.id !== routineExerciseId) return ex;

                        const newSet = {
                            id: `temp-${Date.now()}`,
                            setNumber: ex.sets.length + 1,
                            weight: 0,
                            reps: 0,
                            completed: false,
                        };

                        return {
                            ...ex,
                            sets: [...ex.sets, newSet],
                        };
                    }),
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