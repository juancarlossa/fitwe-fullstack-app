import { apiFetch } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteExerciseMutation(routineId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (setId: string) => {
            const res = await apiFetch(
                `/sets/${setId}`,
                {
                    method: "DELETE",
                }
            );


            return res.data;
        },

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ["routine", routineId] });

            const previous = queryClient.getQueryData(["routine", routineId]);

            queryClient.setQueryData(["routine", routineId], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    exercises: old.exercises.filter((ex: any) => ex.id !== id),
                };
            });

            return { previous };
        },

        onError: (_err, _id, ctx) => {
            queryClient.setQueryData(["routine", routineId], ctx?.previous);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["routine", routineId] });
        },
    });
}