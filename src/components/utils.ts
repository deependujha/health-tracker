
// ---------------------- Utilities ----------------------
export const ls = {
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
  set: ( key: string, value: string | object ) => {
    if ( typeof window === 'undefined' ) return;
    try {
      localStorage.setItem( key, JSON.stringify( value ) );
    } catch ( e ) {
      console.warn( 'ls.set err', e );
    }
  },
};

export const todayISO = (): ISODate => new Date().toISOString().slice( 0, 10 );
export const uid = ( p = '' ) => p + Math.random().toString( 36 ).slice( 2, 9 );

// date range helper
export function rangeDays( n: number ): ISODate[] {
  const arr: ISODate[] = [];
  for ( let i = n - 1; i >= 0; i-- ) {
    const d = new Date();
    d.setDate( d.getDate() - i );
    arr.push( d.toISOString().slice( 0, 10 ) );
  }
  return arr;
}

// ---------------------- Default Data ----------------------
export const DEFAULT: FitnessData = {
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
