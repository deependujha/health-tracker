
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

export default ContributionGrid;
