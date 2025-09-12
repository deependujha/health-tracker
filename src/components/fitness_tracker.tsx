/*
Deependu Fitness Tracker — Next.js 15 (App Router compatible)
Single-file prototype (TypeScript + React) intended to be used as app/page.tsx or pages/index.tsx.

Features implemented in this single-file prototype:
- Local-only (localStorage) via a custom useFitnessData hook
- Dashboard, Weight, Workouts, Hydration, Meals, Progress, Settings "pages" via internal tab router
- CRUD for workouts & meals (per-date), mark completed, delete
- GitHub-style contribution grid (90 days) for combined workout+meal completion
- Weight logging + Recharts line chart
- Hydration quick-add and history
- Export / Import JSON
- Strict black & white theme (no colors) and Tailwind utility classes used
- Framer Motion subtle reveal animations

Notes before using:
- This is a single-file working prototype. For production / real Next.js app split into multiple files and components.
- Requires: tailwindcss, recharts, framer-motion. Install via:
  npm i recharts framer-motion
- Drop this file into app/page.tsx (or pages/index.tsx) and ensure Tailwind is configured.
- Because the user wanted black/white-only, this UI uses only shades of gray and white, no colored accents.

Assumptions & creative choices made for Deependu:
- 3L water target default, calorie/protein defaults included
- 90-day contribution grid for long-term view
- Minimal mobile-first layout, good for local dev and quick iteration

*/
"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

// ---------------------- Utilities ----------------------
const ls = {
  get: <T,>( key: string, fallback: T ): T => {
    if ( typeof window === 'undefined' ) return fallback;
    try {
      const raw = localStorage.getItem( key );
      return raw ? JSON.parse( raw ) : fallback;
    } catch ( e ) {
      console.warn( 'ls.get parse err', e );
      return fallback;
    }
  },
  set: ( key: string, value: any ) => {
    if ( typeof window === 'undefined' ) return;
    try {
      localStorage.setItem( key, JSON.stringify( value ) );
    } catch ( e ) {
      console.warn( 'ls.set err', e );
    }
  },
};

const todayISO = (): ISODate => new Date().toISOString().slice( 0, 10 );
const uid = ( p = '' ) => p + Math.random().toString( 36 ).slice( 2, 9 );

// date range helper
function rangeDays( n: number ): ISODate[] {
  const arr: ISODate[] = [];
  for ( let i = n - 1; i >= 0; i-- ) {
    const d = new Date();
    d.setDate( d.getDate() - i );
    arr.push( d.toISOString().slice( 0, 10 ) );
  }
  return arr;
}

// ---------------------- Default Data ----------------------
const DEFAULT: FitnessData = {
  profile: { name: 'Deependu', heightCm: 175 },
  targets: {
    startWeight: 82,
    goalWeight: 75,
    dailyCalories: 1850,
    proteinTarget: 140,
    waterTargetL: 3,
  },
  weights: { [ todayISO() ]: 82 },
  hydration: { [ todayISO() ]: 0 },
  workouts: {},
  meals: {},
};

// ---------------------- Hook: useFitnessData ----------------------
function useFitnessData() {
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

// ---------------------- Small UI primitives ----------------------
function Section( { title, children }: { title: string; children: React.ReactNode } ) {
  return (
    <motion.div initial={ { opacity: 0, y: 6 } } animate={ { opacity: 1, y: 0 } } className="bg-white/4 border border-white/6 rounded-xl p-4">
      <h3 className="text-base font-semibold text-white mb-2">{ title }</h3>
      <div className="text-sm text-white/80">{ children }</div>
    </motion.div>
  );
}

function Small( { children }: { children: React.ReactNode } ) {
  return <div className="text-xs text-white/70">{ children }</div>;
}

// ---------------------- Contribution grid (github-like) ----------------------
function ContributionGrid( { data, onSelectDate }: { data: { date: ISODate; score: number; workout: boolean; meals: boolean }[]; onSelectDate: ( d: ISODate ) => void } ) {
  // Render as rows of 7 (weeks). We'll show most recent on right.
  const cols = Math.ceil( data.length / 7 );
  const weeks = [] as { date: ISODate; score: number; workout: boolean; meals: boolean }[][];
  for ( let c = 0; c < cols; c++ ) {
    weeks.push( [] );
  }
  data.forEach( ( d, i ) => {
    const col = Math.floor( i / 7 );
    weeks[ col ].push( d );
  } );

  return (
    <div className="overflow-x-auto py-2">
      <div className="flex gap-1 items-start">
        { weeks.map( ( week, i ) => (
          <div key={ i } className="flex flex-col gap-1">
            { week.map( ( cell ) => {
              const bg = cell.score === 2 ? 'bg-white' : cell.score === 1 ? 'bg-white/70' : 'bg-white/20';
              return (
                <div key={ cell.date } title={ `${cell.date} - workout:${cell.workout ? '✔' : '✘'} meals:${cell.meals ? '✔' : '✘'}` } onClick={ () => onSelectDate( cell.date ) } className={ `w-3 h-3 rounded-sm cursor-pointer ${bg} border border-white/10` } />
              );
            } ) }
          </div>
        ) ) }
      </div>
    </div>
  );
}

// ---------------------- Main App Component ----------------------
export function FitnessTracker() {
  const store = useFitnessData();
  const { data } = store;

  // simple router
  const [ route, setRoute ] = useState<'dashboard' | 'weight' | 'workouts' | 'hydration' | 'meals' | 'progress' | 'settings'>( 'dashboard' );
  const [ selectedDate, setSelectedDate ] = useState<ISODate>( todayISO() );

  // contribution data last 90 days
  const days = useMemo( () => rangeDays( 90 ), [] );
  const contributionData = useMemo( () => days.map( ( d ) => ( { date: d, score: ( data.workouts[ d ]?.completed ? 1 : 0 ) + ( data.meals[ d ]?.completed ? 1 : 0 ), workout: !!data.workouts[ d ]?.completed, meals: !!data.meals[ d ]?.completed } ) ), [ days, data ] );

  // chart data for weights (sorted)
  const weightChart = useMemo( () => {
    const entries = Object.entries( data.weights ).map( ( [ date, kg ] ) => ( { date, kg } ) );
    entries.sort( ( a, b ) => a.date.localeCompare( b.date ) );
    return entries.map( ( e ) => ( { ...e, label: e.date.slice( 5 ) } ) );
  }, [ data.weights ] );

  // ETA calc (simple linear)
  const eta = useMemo( () => {
    const dates = Object.entries( data.weights ).map( ( [ date, kg ] ) => ( { date: new Date( date ), kg } ) );
    if ( dates.length < 2 ) return null;
    dates.sort( ( a, b ) => a.date.getTime() - b.date.getTime() );
    const first = dates[ 0 ];
    const last = dates[ dates.length - 1 ];
    const daysDiff = ( last.date.getTime() - first.date.getTime() ) / ( 1000 * 60 * 60 * 24 ) || 1;
    const kgDiff = first.kg - last.kg;
    const rate = kgDiff / daysDiff; // kg per day lost (positive)
    if ( rate <= 0 ) return null;
    const remaining = last.kg - data.targets.goalWeight;
    const daysLeft = remaining / rate;
    const etaDate = new Date( last.date.getTime() + daysLeft * 24 * 60 * 60 * 1000 );
    return { rate, etaDate: etaDate.toISOString().slice( 0, 10 ), daysLeft: Math.round( daysLeft ) };
  }, [ data.weights, data.targets.goalWeight ] );

  // local editors
  const [ exerciseDraft, setExerciseDraft ] = useState<{ name: string; sets: number; reps: number; weightKg?: number }>( { name: 'Goblet Squat', sets: 3, reps: 12, weightKg: 10 } );
  const [ mealDraft, setMealDraft ] = useState<MealPlanDay>( {} );
  const [ weightInput, setWeightInput ] = useState<string>( '' );

  useEffect( () => {
    setMealDraft( data.meals[ selectedDate ] || {} );
  }, [ selectedDate, data.meals ] );

  // helpers for days
  const selectDateFromGrid = ( d: ISODate ) => {
    setSelectedDate( d );
    setRoute( 'workouts' );
  };

  // add exercise to selectedDate
  const addExercise = () => {
    const currentPlan = data.workouts[ selectedDate ]?.plan || [];
    const ex: Exercise = { id: uid( 'ex_' ), name: exerciseDraft.name, sets: exerciseDraft.sets, reps: exerciseDraft.reps, weightKg: exerciseDraft.weightKg };
    store.upsertWorkout( selectedDate, [ ...currentPlan, ex ] );
  };

  const saveMeals = () => {
    store.upsertMeal( selectedDate, mealDraft );
  };

  const addWeight = () => {
    if ( !weightInput ) return;
    store.setWeight( selectedDate, Number( weightInput ) );
    setWeightInput( '' );
  };

  // export/import handlers
  const handleImportFile = ( file: File | null ) => {
    if ( !file ) return;
    const reader = new FileReader();
    reader.onload = ( e ) => {
      try {
        store.importJSON( String( e.target?.result ) );
        alert( 'Imported' );
      } catch ( err ) {
        alert( 'Invalid JSON' );
      }
    };
    reader.readAsText( file );
  };

  // UI: top nav
  const NavButton = ( { id, label }: { id: typeof route; label: string } ) => (
    <button onClick={ () => setRoute( id ) } className={ `px-3 py-2 rounded-md text-sm ${route === id ? 'bg-white text-black' : 'text-white/80 hover:text-white'}` }>
      { label }
    </button>
  );

  // --- Render
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-7xl mx-auto p-4">
        <header className="flex items-center justify-between py-4  sticky top-0 z-50 pb-8">
          <div>
            <h1 className="text-2xl font-bold">Fitness Tracker</h1>
            <Small>Local-only • Private • No servers</Small>
          </div>

          <nav className="flex gap-2 items-center">
            <NavButton id={ 'dashboard' } label={ 'Dashboard' } />
            <NavButton id={ 'weight' } label={ 'Weight' } />
            <NavButton id={ 'workouts' } label={ 'Workouts' } />
            <NavButton id={ 'meals' } label={ 'Meals' } />
            <NavButton id={ 'hydration' } label={ 'Hydration' } />
            <NavButton id={ 'progress' } label={ 'Progress' } />
            <NavButton id={ 'settings' } label={ 'Settings' } />
            <div className="ml-3 flex gap-2">
              <button onClick={ () => store.exportJSON() } className="px-3 py-2 rounded bg-white/6 text-white text-sm">Export</button>
              <label className="px-3 py-2 rounded bg-white/6 text-white text-sm cursor-pointer">
                Import
                <input type="file" accept="application/json" className="hidden" onChange={ ( e ) => handleImportFile( e.target.files?.[ 0 ] ?? null ) } />
              </label>
            </div>
          </nav>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column: small dashboard */ }
          <div className="lg:col-span-1 space-y-4">
            <Section title={ `Hello, ${data.profile.name}` }>
              <div className="space-y-2">
                <div className="text-sm">Target: <strong>{ data.targets.goalWeight } kg</strong></div>
                <div className="text-sm">Daily: <strong>{ data.targets.dailyCalories } kcal</strong> • <strong>{ data.targets.proteinTarget } g protein</strong></div>
                <div className="mt-2 text-xs text-white/70">Quick actions:</div>
                <div className="flex gap-2 mt-2">
                  <button onClick={ () => { setSelectedDate( todayISO() ); setRoute( 'workouts' ); } } className="px-3 py-2 rounded bg-white/6 text-sm">Today workout</button>
                  <button onClick={ () => { setSelectedDate( todayISO() ); setRoute( 'meals' ); } } className="px-3 py-2 rounded bg-white/6 text-sm">Today meals</button>
                </div>
              </div>
            </Section>

            <Section title={ 'Weight (quick log)' }>
              <div className="flex gap-2">
                <input value={ weightInput } onChange={ ( e ) => setWeightInput( e.target.value ) } placeholder="kg" className="w-full bg-black/40 border border-white/10 rounded px-2 py-2 text-white" />
                <button onClick={ addWeight } className="px-3 py-2 rounded bg-white/6">Add</button>
              </div>
              <div className="mt-2 text-xs text-white/70">Tip: weigh in the morning after bathroom for consistency.</div>
            </Section>

            <Section title={ 'Hydration (today)' }>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="w-full bg-white/6 rounded h-3 overflow-hidden mb-2">
                    <div style={ { width: `${Math.min( 100, ( data.hydration[ todayISO() ] || 0 ) / data.targets.waterTargetL * 100 )}%` } } className="h-3 bg-white" />
                  </div>
                  <div className="text-xs">{ ( data.hydration[ todayISO() ] || 0 ).toFixed( 2 ) } L of { data.targets.waterTargetL } L</div>
                </div>
                <div className="grid gap-1">
                  <button onClick={ () => store.addHydration( todayISO(), 0.25 ) } className="px-2 py-1 rounded bg-white/6 text-xs">+0.25</button>
                  <button onClick={ () => store.addHydration( todayISO(), 0.5 ) } className="px-2 py-1 rounded bg-white/6 text-xs">+0.5</button>
                  <button onClick={ () => store.addHydration( todayISO(), 1 ) } className="px-2 py-1 rounded bg-white/6 text-xs">+1</button>
                </div>
              </div>
            </Section>

            <Section title={ 'Progress snapshot' }>
              <div className="text-sm">Last measured: <strong>{ Object.keys( data.weights ).length ? Object.entries( data.weights ).sort()[ Object.keys( data.weights ).length - 1 ]?.[ 1 ] : '—' } kg</strong></div>
              <div className="mt-2 text-xs text-white/70">ETA: { eta ? `${eta.etaDate} (~${eta.daysLeft} days)` : 'Insufficient data' }</div>
            </Section>
          </div>

          {/* Middle columns: main content (span 2) */ }
          <div className="lg:col-span-2 space-y-4">
            { route === 'dashboard' && (
              <div className="space-y-4">
                <Section title={ 'Weight chart' }>
                  <div style={ { height: 220 } }>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ weightChart }>
                        <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                        <XAxis dataKey="label" stroke="#ddd" />
                        <YAxis stroke="#ddd" />
                        <Tooltip />
                        <Line type="monotone" dataKey="kg" stroke="#fff" strokeWidth={ 2 } dot={ { r: 3 } } />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Section>

                <Section title={ 'Contribution grid' }>
                  <ContributionGrid data={ contributionData } onSelectDate={ selectDateFromGrid } />
                </Section>

                <Section title={ 'Today plan summary' }>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="p-2 border border-white/6 rounded">Workout: { ( data.workouts[ todayISO() ]?.plan?.length || 0 ) ? data.workouts[ todayISO() ]?.plan?.map( e => e.name ).join( ', ' ) : 'No plan' }</div>
                    <div className="p-2 border border-white/6 rounded">Meals: { Object.values( data.meals[ todayISO() ] || {} ).filter( Boolean ).join( ' • ' ) || 'No plan' }</div>
                  </div>
                </Section>
              </div>
            ) }

            { route === 'weight' && (
              <div className="space-y-4">
                <Section title={ 'Weight history & stats' }>
                  <div style={ { height: 300 } }>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ weightChart }>
                        <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                        <XAxis dataKey="label" stroke="#ddd" />
                        <YAxis stroke="#ddd" />
                        <Tooltip />
                        <Line type="monotone" dataKey="kg" stroke="#fff" strokeWidth={ 2 } dot={ { r: 3 } } />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Section>

                <Section title={ 'Entries' }>
                  <div className="space-y-1">
                    { Object.entries( data.weights ).sort( ( a, b ) => b[ 0 ].localeCompare( a[ 0 ] ) ).map( ( [ date, kg ] ) => (
                      <div key={ date } className="flex justify-between p-2 border border-white/6 rounded">
                        <div>{ date }</div>
                        <div>{ kg } kg</div>
                      </div>
                    ) ) }
                  </div>
                </Section>
              </div>
            ) }

            { route === 'workouts' && (
              <div className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <input value={ exerciseDraft.name } onChange={ ( e ) => setExerciseDraft( { ...exerciseDraft, name: e.target.value } ) } className="bg-black/40 border border-white/10 rounded px-2 py-1" />
                      <input type="number" value={ exerciseDraft.sets } onChange={ ( e ) => setExerciseDraft( { ...exerciseDraft, sets: Number( e.target.value ) } ) } className="bg-black/40 border border-white/10 rounded px-2 py-1" />
                      <input type="number" value={ exerciseDraft.reps } onChange={ ( e ) => setExerciseDraft( { ...exerciseDraft, reps: Number( e.target.value ) } ) } className="bg-black/40 border border-white/10 rounded px-2 py-1" />
                      <input type="number" value={ exerciseDraft.weightKg } onChange={ ( e ) => setExerciseDraft( { ...exerciseDraft, weightKg: Number( e.target.value ) } ) } className="bg-black/40 border border-white/10 rounded px-2 py-1" />
                      <button onClick={ addExercise } className="col-span-2 px-3 py-2 rounded bg-white/6">Add exercise</button>
                    </div>
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
            ) }

            { route === 'meals' && (
              <div className="space-y-4">
                <Section title={ `Meals — ${selectedDate}` }>
                  <div className="mb-2 flex gap-2 items-center">
                    <input type="date" value={ selectedDate } onChange={ ( e ) => setSelectedDate( e.target.value ) } className="bg-black/40 border border-white/10 rounded px-2 py-1 text-white" />
                    <button onClick={ () => store.toggleMealDone( selectedDate ) } className="px-3 py-2 rounded bg-white/6">Toggle done</button>
                    <button onClick={ () => store.deleteMeal( selectedDate ) } className="px-3 py-2 rounded bg-black/60">Delete</button>
                  </div>

                  <div className="space-y-2">
                    <input placeholder="Breakfast" value={ mealDraft.breakfast || '' } onChange={ ( e ) => setMealDraft( { ...mealDraft, breakfast: e.target.value } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    <input placeholder="Lunch" value={ mealDraft.lunch || '' } onChange={ ( e ) => setMealDraft( { ...mealDraft, lunch: e.target.value } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    <input placeholder="Snack" value={ mealDraft.snack || '' } onChange={ ( e ) => setMealDraft( { ...mealDraft, snack: e.target.value } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    <input placeholder="Dinner" value={ mealDraft.dinner || '' } onChange={ ( e ) => setMealDraft( { ...mealDraft, dinner: e.target.value } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    <div className="flex gap-2 mt-2">
                      <button onClick={ saveMeals } className="px-3 py-2 rounded bg-white/6">Save meals</button>
                    </div>
                  </div>
                </Section>

                <Section title={ 'Default plan (editable)' }>
                  <Small>~1850 kcal, 140g protein — Indian-friendly options</Small>
                  <ul className="list-disc list-inside mt-2 text-sm">
                    <li>Breakfast: 3 eggs + 1 roti or curd + nuts + fruit</li>
                    <li>Lunch: 150g chicken or 200g paneer + 2 rotis + veg + dal</li>
                    <li>Snack: Whey shake or 200g curd or boiled chickpeas</li>
                    <li>Dinner: Paneer bhurji or omelet + roti + salad</li>
                  </ul>
                </Section>
              </div>
            ) }

            { route === 'hydration' && (
              <div className="space-y-4">
                <Section title={ 'Hydration history & quick-add' }>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="p-2 border border-white/6 rounded">Today: { ( data.hydration[ todayISO() ] || 0 ).toFixed( 2 ) } L</div>
                    <div className="p-2 border border-white/6 rounded">Target: { data.targets.waterTargetL } L</div>
                    <div className="p-2 border border-white/6 rounded">Streak: TBD</div>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <button onClick={ () => store.addHydration( todayISO(), 0.25 ) } className="px-3 py-2 rounded bg-white/6">+0.25 L</button>
                    <button onClick={ () => store.addHydration( todayISO(), 0.5 ) } className="px-3 py-2 rounded bg-white/6">+0.5 L</button>
                    <button onClick={ () => store.addHydration( todayISO(), 1 ) } className="px-3 py-2 rounded bg-white/6">+1 L</button>
                  </div>

                  <div className="mt-4 text-sm">
                    Recent days:
                    <div className="mt-2 space-y-1">
                      { Object.entries( data.hydration ).sort( ( a, b ) => b[ 0 ].localeCompare( a[ 0 ] ) ).slice( 0, 10 ).map( ( [ date, l ] ) => (
                        <div key={ date } className="flex justify-between p-2 border border-white/6 rounded"> <div>{ date }</div> <div>{ l.toFixed( 2 ) } L</div></div>
                      ) ) }
                    </div>
                  </div>
                </Section>
              </div>
            ) }

            { route === 'progress' && (
              <div className="space-y-4">
                <Section title={ 'Progress overview' }>
                  <div style={ { height: 240 } }>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ weightChart }>
                        <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                        <XAxis dataKey="label" stroke="#ddd" />
                        <YAxis stroke="#ddd" />
                        <Tooltip />
                        <Line type="monotone" dataKey="kg" stroke="#fff" strokeWidth={ 2 } dot={ { r: 3 } } />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2">Consistency (last 90 days)</div>
                    <ContributionGrid data={ contributionData } onSelectDate={ selectDateFromGrid } />
                  </div>
                </Section>
              </div>
            ) }

            { route === 'settings' && (
              <div className="space-y-4">
                <Section title={ 'Profile & Targets' }>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs">Name</label>
                      <input value={ data.profile.name } onChange={ ( e ) => store.updateProfile( { name: e.target.value } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="text-xs">Height (cm)</label>
                      <input type="number" value={ data.profile.heightCm } onChange={ ( e ) => store.updateProfile( { heightCm: Number( e.target.value ) } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="text-xs">Start weight</label>
                      <input type="number" value={ data.targets.startWeight } onChange={ ( e ) => store.updateTargets( { startWeight: Number( e.target.value ) } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="text-xs">Goal weight</label>
                      <input type="number" value={ data.targets.goalWeight } onChange={ ( e ) => store.updateTargets( { goalWeight: Number( e.target.value ) } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="text-xs">Daily calories</label>
                      <input type="number" value={ data.targets.dailyCalories } onChange={ ( e ) => store.updateTargets( { dailyCalories: Number( e.target.value ) } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    </div>
                    <div>
                      <label className="text-xs">Protein target (g)</label>
                      <input type="number" value={ data.targets.proteinTarget } onChange={ ( e ) => store.updateTargets( { proteinTarget: Number( e.target.value ) } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                    </div>
                  </div>
                </Section>

                <Section title={ 'Data management' }>
                  <div className="flex gap-2">
                    <button onClick={ () => store.exportJSON() } className="px-3 py-2 rounded bg-white/6">Export JSON</button>
                    <label className="px-3 py-2 rounded bg-white/6 cursor-pointer">
                      Import
                      <input type="file" accept="application/json" className="hidden" onChange={ ( e ) => handleImportFile( e.target.files?.[ 0 ] ?? null ) } />
                    </label>
                    <button onClick={ () => { if ( confirm( 'Reset all local data to defaults?' ) ) { ls.set( 'deependu_fitness_v1', DEFAULT ); window.location.reload(); } } } className="px-3 py-2 rounded bg-black/60">Reset</button>
                  </div>
                </Section>
              </div>
            ) }

          </div>

          {/* Right column: contextual editor */ }
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/3 border border-white/6 rounded-xl p-4">
              <div className="text-sm mb-2">Editing: <strong>{ selectedDate }</strong></div>

              <div className="text-xs text-white/70 mb-2">Workout quick-add</div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input value={ exerciseDraft.name } onChange={ ( e ) => setExerciseDraft( { ...exerciseDraft, name: e.target.value } ) } className="bg-black/40 border border-white/10 rounded px-2 py-1" />
                <input type="number" value={ exerciseDraft.sets } onChange={ ( e ) => setExerciseDraft( { ...exerciseDraft, sets: Number( e.target.value ) } ) } className="bg-black/40 border border-white/10 rounded px-2 py-1" />
                <input type="number" value={ exerciseDraft.reps } onChange={ ( e ) => setExerciseDraft( { ...exerciseDraft, reps: Number( e.target.value ) } ) } className="bg-black/40 border border-white/10 rounded px-2 py-1" />
                <input type="number" value={ exerciseDraft.weightKg } onChange={ ( e ) => setExerciseDraft( { ...exerciseDraft, weightKg: Number( e.target.value ) } ) } className="bg-black/40 border border-white/10 rounded px-2 py-1" />
              </div>
              <div className="flex gap-2">
                <button onClick={ addExercise } className="px-3 py-2 rounded bg-white/6">Add</button>
                <button onClick={ () => store.toggleWorkoutDone( selectedDate ) } className="px-3 py-2 rounded bg-black/60">Toggle done</button>
              </div>
            </div>

            <div className="bg-white/3 border border-white/6 rounded-xl p-4">
              <div className="text-xs text-white/70 mb-2">Meals quick-edit</div>
              <div className="space-y-2">
                <input placeholder="Breakfast" value={ mealDraft.breakfast || '' } onChange={ ( e ) => setMealDraft( { ...mealDraft, breakfast: e.target.value } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                <input placeholder="Lunch" value={ mealDraft.lunch || '' } onChange={ ( e ) => setMealDraft( { ...mealDraft, lunch: e.target.value } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                <input placeholder="Snack" value={ mealDraft.snack || '' } onChange={ ( e ) => setMealDraft( { ...mealDraft, snack: e.target.value } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                <input placeholder="Dinner" value={ mealDraft.dinner || '' } onChange={ ( e ) => setMealDraft( { ...mealDraft, dinner: e.target.value } ) } className="w-full bg-black/40 border border-white/10 rounded px-2 py-1" />
                <div className="flex gap-2 mt-2">
                  <button onClick={ saveMeals } className="px-3 py-2 rounded bg-white/6">Save</button>
                  <button onClick={ () => store.deleteMeal( selectedDate ) } className="px-3 py-2 rounded bg-black/60">Delete</button>
                </div>
              </div>
            </div>

            <div className="bg-white/3 border border-white/6 rounded-xl p-4">
              <div className="text-xs text-white/70 mb-2">Recent weight entries</div>
              <div className="space-y-1">
                { Object.entries( data.weights ).sort( ( a, b ) => b[ 0 ].localeCompare( a[ 0 ] ) ).slice( 0, 6 ).map( ( [ date, kg ] ) => (
                  <div key={ date } className="flex justify-between text-sm"><div>{ date }</div><div>{ kg } kg</div></div>
                ) ) }
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
