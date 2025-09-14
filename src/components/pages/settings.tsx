import { Section } from '@/components/ui/helpers';
import { DEFAULT, ls } from "@/components/utils"


type SettingPageProps = {
    data: {
        profile: {
            name: string;
            heightCm: number;
        };
        targets: {
            startWeight: number;
            goalWeight: number;
            dailyCalories: number;
            proteinTarget: number;
        };
    };
    store: {
        updateProfile: ( profile: Partial<{ name: string; heightCm: number }> ) => void;
        updateTargets: ( targets: Partial<{ startWeight: number; goalWeight: number; dailyCalories: number; proteinTarget: number }> ) => void;
        exportJSON: () => void;
    };
    handleImportFile: ( file: File | null ) => void;
}

const SettingPage = ( { data, store, handleImportFile }: SettingPageProps ) => {
    return (
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
    )
}

export default SettingPage
