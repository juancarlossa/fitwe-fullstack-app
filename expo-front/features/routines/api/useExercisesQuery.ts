import { apiFetch } from "@/services/authService";
import { useQuery } from "@tanstack/react-query";

export function useExercisesQuery() {
    return useQuery({
        queryKey: ["exercises"],
        queryFn: async () => {
            const res = await apiFetch("/exercises");
            return res.data;
        },
    });
}