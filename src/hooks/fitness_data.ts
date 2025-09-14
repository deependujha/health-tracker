import { useEffect, useState } from 'react';
import { DEFAULT, ls } from "@/components/utils"

// ---------------------- Hook: useFitnessData ----------------------
export function useFitnessData() {
    const [ data, setData ] = useState<FitnessData>( () => ls.get( 'deependu_fitness_v1', DEFAULT ) );

    useEffect( () => ls.set( 'deependu_fitness_v1', data ), [ data ] );

    // weights
    const setWeight = ( date: ISODate, kg: number ) => {
        setData( ( d ) => ( { ...d, weights: { ...d.weights, [ date ]: Number( kg ) } } ) );
    };

    // hydration
    const addHydration = ( date: ISODate, liters: number ) => {
        setData( ( d ) => ( { ...d, hydration: { ...d.hydration, [ date ]: ( d.hydration[ date ] || 0 ) + Number( liters ) } } ) );
    };
    const setHydration = ( date: ISODate, liters: number ) => {
        setData( ( d ) => ( { ...d, hydration: { ...d.hydration, [ date ]: Number( liters ) } } ) );
    };

    // workouts
    const upsertWorkout = ( date: ISODate, plan: Exercise[] ) => {
        setData( ( d ) => ( { ...d, workouts: { ...d.workouts, [ date ]: { plan, completed: d.workouts[ date ]?.completed || false } } } ) );
    };
    const toggleWorkoutDone = ( date: ISODate ) => {
        setData( ( d ) => ( { ...d, workouts: { ...d.workouts, [ date ]: { ...( d.workouts[ date ] || { plan: [] } ), completed: !d.workouts[ date ]?.completed } } } ) );
    };
    const deleteWorkout = ( date: ISODate ) => {
        setData( ( d ) => {
            const copy = { ...d.workouts };
            delete copy[ date ];
            return { ...d, workouts: copy };
        } );
    };

    // meals
    const upsertMeal = ( date: ISODate, meal: MealPlanDay ) => {
        setData( ( d ) => ( { ...d, meals: { ...d.meals, [ date ]: { ...( d.meals[ date ] || {} ), ...meal, completed: d.meals[ date ]?.completed || false } } } ) );
    };
    const toggleMealDone = ( date: ISODate ) => {
        setData( ( d ) => ( { ...d, meals: { ...d.meals, [ date ]: { ...( d.meals[ date ] || {} ), completed: !d.meals[ date ]?.completed } } } ) );
    };
    const deleteMeal = ( date: ISODate ) => {
        setData( ( d ) => {
            const copy = { ...d.meals };
            delete copy[ date ];
            return { ...d, meals: copy };
        } );
    };

    // settings
    const updateProfile = ( p: Partial<Profile> ) => setData( ( d ) => ( { ...d, profile: { ...d.profile, ...p } } ) );
    const updateTargets = ( t: Partial<Targets> ) => setData( ( d ) => ( { ...d, targets: { ...d.targets, ...t } } ) );

    // export/import
    const exportJSON = () => {
        const blob = new Blob( [ JSON.stringify( data, null, 2 ) ], { type: 'application/json' } );
        const url = URL.createObjectURL( blob );
        const a = document.createElement( 'a' );
        a.href = url;
        a.download = 'deependu_fitness_backup.json';
        a.click();
        URL.revokeObjectURL( url );
    };
    const importJSON = ( raw: string ) => {
        try {
            const parsed = JSON.parse( raw ) as Partial<FitnessData>;
            setData( ( d ) => ( { ...d, ...parsed } as FitnessData ) );
        } catch ( e ) {
            throw new Error( 'Invalid JSON' );
        }
    };

    return {
        data,
        setWeight,
        addHydration,
        setHydration,
        upsertWorkout,
        toggleWorkoutDone,
        deleteWorkout,
        upsertMeal,
        toggleMealDone,
        deleteMeal,
        updateProfile,
        updateTargets,
        exportJSON,
        importJSON,
    };
}

