import Image from "next/image"

interface ExerciseCardProps {
    exerciseName: string
    sets: number
    reps: number
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
    return (
        <div
            className={ `p-6 bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02] ${className}` }
        >
            <div className="flex items-center justify-between">
                {/* Left side - Exercise details */ }
                <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-bold text-primary text-balance leading-tight">{ exerciseName }</h3>

                    <div className="flex gap-6">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Sets</span>
                            <span className="text-2xl font-bold text-foreground">{ sets }</span>
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Reps</span>
                            <span className="text-2xl font-bold text-foreground">{ reps }</span>
                        </div>
                    </div>
                </div>

                {/* Right side - GIF container */ }
                <div className="ml-6 flex-shrink-0">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300 hover:scale-105 transform">
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
        </div>
    )
}
