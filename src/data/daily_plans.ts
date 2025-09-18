export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
export type Exercise = {
    name: string;
    sets: number;
    reps: string | number;
    gif: string;
}

export type WorkoutPlan = {
    day: WeekDay;
    exercises: Exercise[];
};

const MondayPlan: WorkoutPlan[] = [
    {
        day: "Monday",
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
                name: "Push Ups",
                sets: 3,
                reps: "8-12",
                gif: "/exercise/PUSH_UP.gif"
            },
            {
                name: "Dumbell Bench Press",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/chest/DB_BP.gif"
            },
            {
                name: "Dumbell Fly",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/chest/DB_INC_FLY.gif"
            },
            {
                name: "Overhead Dumbbell Press",
                sets: 3,
                reps: "8-12",
                gif: "/exercise/shoulder/DB_SHD_PRESS.gif"
            },
            {
                name: "Dumbbell Overhead Tricep Extension",
                sets: 3,
                reps: "10-15",
                gif: "/exercise/triceps/DB_TRI_EXT.gif"
            }
        ]
    },
]

const TuesdayPlan: WorkoutPlan[] = [
    {
        day: "Tuesday",
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
                name: "DeadLift",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/back/DB_RM_DL.gif"
            },
            {
                name: "Bent Over Rows",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/back/DB_LOW.gif"
            },
            {
                name: "Dumbell Reverse Fly",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/back/dumbell_reverse_fly.gif"
            },
            {
                name: "Dumbell Shrugs",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/back/DB_SHRUG.gif"
            },
        ]
    },
]

const WednesdayPlan: WorkoutPlan[] = [
    {
        day: "Wednesday",
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
                name: "Biceps Curl",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/biceps/DB_BC_CURL.gif"
            },
            {
                name: "Hammer Curl",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/biceps/DB_HAM_CURL.gif"
            },
            {
                name: "Reverse Curl",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/biceps/dumbbell-reverse-grip-curl-exercise.gif"
            },
            {
                name: "Concentration Curl",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/biceps/Concentration-Curl.gif"
            },
            {
                name: "Wrist Curl",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/biceps/REV_DB_WRIST_CURL.gif"
            },
        ]
    },
]

const ThursdayPlan: WorkoutPlan[] = [
    {
        day: "Thursday",
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
                name: "Tricep Bench Dips",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/triceps/BENCH_DIPS.gif"
            },
            {
                name: "Close grip push-ups",
                sets: 3,
                reps: "6-10",
                gif: "/exercise/triceps/CG_PUSH_UP.gif"
            },
            {
                name: "Overhead Extension",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/triceps/DB_TRI_EXT.gif"
            },
            {
                name: "Skull Crushers",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/triceps/Dumbbell-Skull-Crusher.gif"
            },
            {
                name: "Bent-over Kickbacks",
                sets: 3,
                reps: "12-15",
                gif: "/exercise/triceps/Bent_over_kickback.gif"
            },
        ]
    },
]

const FridayPlan: WorkoutPlan[] = [
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


export const dailyPlans: WorkoutPlan[] = [ ...MondayPlan, ...TuesdayPlan, ...WednesdayPlan, ...ThursdayPlan, ...FridayPlan ]
