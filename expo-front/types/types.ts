export type Exercise = {
    id: string;
    name: string;
    muscleGroup: string;
    equipment: string | null;
    imageUrl: string | null;
};
export type SetItem = {
    id: string;
    setNumber: number;
    prevData?: string;
    weight: number;
    reps: number;
    completed: boolean;
};
export type RoutineExercise = {
    id: string;
    exercise: Exercise;
    sets: SetItem[];
    reps: number;
    weight: number;
    order: number;
    exerciseId: string;
};

export type Routine = {
    id: string;
    name: string;
    createdAt: string;
    exercises: RoutineExercise[];
};

export interface ClassItem {
    id: string;
    name: string;
    instructor: string;
    capacity: number;
    startTime: string;
    endTime: string;
    spotsLeft: number;
    isOpen: boolean;
    isFull: boolean;
    opensAt: string | null;
    userBookingId: string | null;
    isBooked: boolean;
}