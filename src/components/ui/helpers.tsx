import { motion } from 'framer-motion';

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

export { Section, Small };
