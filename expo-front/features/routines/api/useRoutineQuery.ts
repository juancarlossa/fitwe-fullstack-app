// features/routines/queries/useRoutineQuery.ts

import { apiFetch } from "@/services/authService";
import { useQuery } from "@tanstack/react-query";

export function useRoutineQuery(id: string) {
    return useQuery({
        queryKey: ["routine", id],
        queryFn: async () => {
            const res = await apiFetch(`/routines/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}