"use client"
import { Section } from "@/components/ui/helpers";
import { ExerciseCard } from "@/components/exercise_card";
import { dailyPlans } from "@/data/daily_plans";
import { useState, useEffect } from "react";
import Image from "next/image";

const weekDays = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];

export default function WorkoutsPage( ) {
    const [ selectedDay, setSelectedDay ] = useState<string>( "Monday" );

    useEffect( () => {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
        const dayName = today.toLocaleDateString( 'en-US', options );
        setSelectedDay( dayName );
    }, [] );

    return ( <div className="space-y-4">
        <div className="sticky top-20 self-start z-5000 bg-black/90 backdrop-blur py-4">
            <Section title={ `Workouts 🏋🏻‍♀️` }>
                <div>
                    {
                        weekDays.map( day => (
                            <span key={ day } className={ `px-3 py-1 rounded-full mr-2 select-none ${day === selectedDay ? "bg-primary text-white font-bold bg-gray-800" : "bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"}` }>
                                <button onClick={ () => setSelectedDay( day ) } className="cursor-pointer">
                                    { day }
                                </button>
                            </span>
                        ) )
                    }
                </div>
            </Section>
        </div>
        <div>
            {
                dailyPlans.filter( plan => plan.day === selectedDay ).map( plan => (
                    <div key={ plan.day } className="space-y-4">
                        { plan.exercises.map( ( exercise ) => (
                            <div key={ exercise.name }>
                                <ExerciseCard
                                    key={ exercise.name }
                                    exerciseName={ exercise.name }
                                    sets={ exercise.sets }
                                    reps={ typeof exercise.reps === "number" ? exercise.reps : exercise.reps }
                                    gifUrl={ exercise.gif }
                                    className="hover:scale-[1.02]"
                                />
                            </div>
                        ) ) }
                    </div>
                ) )
            }
            {/* if no workout plan exists for the selected day */ }
            { dailyPlans.filter( plan => plan.day === selectedDay ).length === 0 && (
                <div className="flex flex-col items-center justify-center space-y-4 mt-10">
                    <Image
                        className="rounded-2xl"
                        src="/exercise/chill.gif"
                        alt="No workout plan"
                        width={ 600 }
                        height={ 600 }
                    />
                    <div className="text-muted">Relax & enjoy your { selectedDay }.</div>
                </div>
            ) }
        </div>
    </div >
    )
}

