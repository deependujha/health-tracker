type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
type Exercise = {
    name: string;
    sets: number;
    reps: string | number;
    gif: string;
}

type WorkoutPlan = {
    day: WeekDay;
    exercises: Exercise[];
};

export const dailyPlans: WorkoutPlan[] = [
    {
        day: "Friday",
        exercises: [
            {
                name: "Jumping Jacks",
                sets: 2,
                reps: "30 seconds",
                gif: "/exercise/JUMPING_JACK.gif"
            },
            {
                name: "Stretches",
                sets: 3,
                reps: "10-15",
                gif: "/exercise/STRETCHES.gif"
            },
            {
                name: "Push-ups",
                sets: 3,
                reps: "6-10",
                gif: "/exercise/PUSH_UP.gif"
            },
            {
                name: "Shoulder Overhead Press",
                sets: 3,
                reps: "8-12",
                gif: "/exercise/shoulder/SHOULDER_OVERHEAD_PRESS.gif"
            },
            {
                name: "Front Raises",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/shoulder/FRONT_RAISES.gif"
            },
            {
                name: "Lateral Raises",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/shoulder/LATERAL_RAISES.gif"
            },
            {
                name: "Bent-over Lateral Raises",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/shoulder/BENT_OVER_LATERAL_RAISES.gif"
            },
            {
                name: "Arnold Press (Seated)",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/shoulder/ARNOLD_PRESS.gif"
            },
            {
                name: "Shrugs",
                sets: 3,
                reps: "12-20",
                gif: "/exercise/shoulder/SHRUGS.gif"
            }
        ]
    },
]