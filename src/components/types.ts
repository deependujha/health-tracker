// ---------------------- Types ----------------------
type ISODate = string; // 'YYYY-MM-DD'

interface Profile {
    name: string;
    heightCm: number;
}

interface Targets {
    startWeight: number;
    goalWeight: number;
    dailyCalories: number;
    proteinTarget: number;
    waterTargetL: number;
}

interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    weightKg?: number;
}

interface WorkoutData {
    plan: Exercise[];
    completed?: boolean;
}

interface MealPlanDay {
    breakfast?: string;
    lunch?: string;
    snack?: string;
    dinner?: string;
    completed?: boolean;
}

interface FitnessData {
    profile: Profile;
    targets: Targets;
    weights: Record<ISODate, number>;
    hydration: Record<ISODate, number>;
    workouts: Record<ISODate, WorkoutData>;
    meals: Record<ISODate, MealPlanDay>;
}

interface ExerciseDraftType {
    name: string;
    sets: number;
    reps: number;
    weightKg?: number;

}