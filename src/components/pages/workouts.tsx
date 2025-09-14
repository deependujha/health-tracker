import { Section, Small } from "@/components/ui/helpers";

type WorkoutsPageProps = {
    data: FitnessData;
    store: {
        upsertWorkout: ( date: string, plan: { id: string; name: string; sets: number; reps: number; weightKg?: number; }[] ) => void;
        toggleWorkoutDone: ( date: string ) => void;
        deleteWorkout: ( date: string ) => void;
    };
    selectedDate: string;
    setSelectedDate: ( date: string ) => void;

}

export default function WorkoutsPage( { data, store, selectedDate, setSelectedDate }: WorkoutsPageProps ) {
    return ( <div className="space-y-4">
        <Section title={ `Workouts — ${selectedDate}` }>
            <div className="mb-2 flex gap-2 items-center">
                <input type="date" value={ selectedDate } onChange={ ( e ) => setSelectedDate( e.target.value ) } className="bg-black/40 border border-white/10 rounded px-2 py-1 text-white" />
                <button onClick={ () => store.toggleWorkoutDone( selectedDate ) } className="px-3 py-2 rounded bg-white/6">Toggle done</button>
                <button onClick={ () => store.deleteWorkout( selectedDate ) } className="px-3 py-2 rounded bg-black/60">Delete</button>
            </div>

            <div className="space-y-2">
                { ( data.workouts[ selectedDate ]?.plan || [] ).map( ( ex ) => (
                    <div key={ ex.id } className="p-2 border border-white/6 rounded flex justify-between items-center">
                        <div>
                            <div className="font-medium">{ ex.name }</div>
                            <Small>{ ex.sets }x{ ex.reps } { ex.weightKg ? `• ${ex.weightKg}kg` : '' }</Small>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={ () => {
                                // remove exercise
                                const newPlan = ( data.workouts[ selectedDate ]?.plan || [] ).filter( p => p.id !== ex.id );
                                store.upsertWorkout( selectedDate, newPlan );
                            } } className="px-2 py-1 rounded bg-black/60">Remove</button>
                        </div>
                    </div>
                ) ) }
            </div>
        </Section>

        <Section title={ 'Preset 5-day plan' }>
            <ol className="list-decimal list-inside text-sm space-y-2">
                <li><strong>Day 1 (Push):</strong> Floor press, overhead press, side raises, wall push-ups, plank</li>
                <li><strong>Day 2 (Pull):</strong> Bent-over rows, shrugs, hammer curls, reverse fly, bird dog</li>
                <li><strong>Day 3 (Legs+Core):</strong> Goblet squats, Romanian DL, lunges, calf raises, Russian twists</li>
                <li><strong>Day 4 (Circuit):</strong> 4 rounds: goblet squat, row, OHP, DL, plank</li>
                <li><strong>Day 5 (Active):</strong> Brisk walk or mobility</li>
            </ol>
        </Section>
    </div>
    )
}