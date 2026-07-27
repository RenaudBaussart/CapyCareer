// fichier gerant la recherche admin

// import
// icone
import { Search } from "lucide-react";

export default function SearchBar({ searchQuery, setSearchQuery, placeholder = "Rechercher par email..." }) {
    return (
        <div className="relative w-full md:w-72" role="search">
            <label htmlFor="search-input" className="sr-only">Recherche</label>
            <input
                id="search-input"
                type="search"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-bone-light/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary-dark placeholder-primary-dark/50 transition-all"
            />
            <Search className="w-5 h-5 text-primary-dark/50 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
        </div>
    );
}