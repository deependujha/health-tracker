"use client"

import Image from "next/image"
import { useState, useEffect } from "react";

interface ExerciseCardProps {
    exerciseName: string
    sets: number
    reps: string | number
    gifUrl?: string
    className?: string
}

export function ExerciseCard( {
    exerciseName,
    sets,
    reps,
    gifUrl = "/exercise-demonstration-gif.jpg",
    className = "",
}: ExerciseCardProps ) {
    const [ open, setOpen ] = useState( false );

    // allow escape key to close
    useEffect( () => {
        function handleKeyDown( e: KeyboardEvent ) {
            if ( e.key === "Escape" ) setOpen( false );
        }
        window.addEventListener( "keydown", handleKeyDown );
        return () => window.removeEventListener( "keydown", handleKeyDown );
    }, [] );

    return (
        <div
            className={ `p-6 bg-card border border-border rounded-4xl
 hover:shadow-lg transition-all duration-300 ${className}` }
        >
            <div className="flex items-center justify-between">
                {/* Left side - Exercise details */ }
                <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-primary text-balance leading-tight">{ exerciseName }</h3>

                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Sets</span>
                            <span className="text-xl font-bold text-foreground">{ sets }</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Reps</span>
                            <span className="text-xl font-bold text-foreground">{ reps }</span>
                        </div>
                    </div>
                </div>

                {/* Right side - GIF container */ }
                <div className="ml-6 flex-shrink-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300 hover:scale-105 transform hover:cursor-pointer" onClick={ () => setOpen( true ) }>
                        <Image
                            src={ gifUrl || "/placeholder.svg" }
                            alt={ `${exerciseName} demonstration` }
                            fill
                            className="object-cover"
                            sizes="80px"
                        />

                        {/* Overlay for better visual feedback */ }
                        <div className="absolute inset-0 bg-primary/0 hover:bg-primary/10 transition-colors duration-300" />
                    </div>
                </div>
            </div>
            {/* Overlay */ }
            { open && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={ () => setOpen( false ) } // clicking background closes
                >
                    <button
                        className="absolute top-6 right-6 text-white text-3xl font-bold"
                        onClick={ () => setOpen( false ) }
                    >
                        ×
                    </button>
                    <div
                        className="max-w-lg max-h-[80vh] p-4 bg-card rounded-3xl overflow-hidden"
                        onClick={ ( e ) => e.stopPropagation() }
                    >

                        <Image
                            src={ gifUrl || "/placeholder.svg" }
                            alt={ `${exerciseName} demonstration` }
                            width={ 800 }   // pick a good baseline width
                            height={ 600 }  // keeps aspect ratio safe
                            className="object-cover rounded-4xl z-500"
                            sizes="80px"
                        />
                    </div>
                </div>
            ) }
        </div>
    )
}
