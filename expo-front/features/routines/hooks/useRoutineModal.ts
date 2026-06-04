import { useState } from "react";
import { useAddExerciseMutation } from "../api/mutations/useAddExerciseMutation";
import { useExercisesQuery } from "../api/useExercisesQuery";


export function useRoutineModal(routineId: string) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<"picker" | "config">("picker");
    const [search, setSearch] = useState("");
    const [selectedExercise, setSelectedExercise] = useState<any>(null);
    const [sets, setSets] = useState(3);

    const { data: availableExercises = [] } = useExercisesQuery();
    const addMutation = useAddExerciseMutation(routineId);

    const openModal = () => setOpen(true);
    const closeModal = () => {
        setOpen(false);
        setStep("picker");
        setSelectedExercise(null);
        setSets(3);
    };

    const selectExercise = (ex: any) => {
        setSelectedExercise(ex);
        setStep("config");
    };

    const confirm = () => {
        if (!selectedExercise) return;

        addMutation.mutate({
            exerciseId: selectedExercise.id,
            sets,
        }, {
            onSuccess: closeModal,
        });
    };

    return {
        open,
        step,
        search,
        sets,
        selectedExercise,
        availableExercises,
        submitting: addMutation.isPending,

        openModal,
        closeModal,
        setStep,
        setSearch,
        setSets,
        selectExercise,
        confirm,
    };
}