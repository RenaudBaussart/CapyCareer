// fichier gerant le component de pagination global

// import
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, isTheEnd, onPrevPage, onNextPage }) {
    return (
        <div className="flex items-center justify-center gap-4 mt-6">
            <button
                onClick={onPrevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-white/50 text-font-primary-dark hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                <ChevronLeft className="w-4 h-4" />
                Précédent
            </button>

            <span className="text-font-primary-dark font-medium min-w-20 text-center">
                Page {currentPage + 1}
            </span>

            <button
                onClick={onNextPage}
                disabled={isTheEnd}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 border border-white/50 text-font-primary-dark hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
                Suivant
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}