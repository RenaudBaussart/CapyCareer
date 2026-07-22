// fichier gerant le component pour afficher la liste des entreprises

// import
// icone
import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function CompanyCard({ company }) {
  return (
    <div className="bg-bone-light border border-primary-light/20 rounded-2xl p-6 hover:shadow-md hover:border-primary-light/50 transition-all duration-300 group">
      <div className="flex items-start gap-4 mb-4">
        {/* logo entreprise */}
        <div className="w-12 h-12 rounded-lg bg-bone-light border border-primary-light/30 flex items-center justify-center shrink-0 group-hover:border-primary transition-colors">
          <span className="text-xl font-bold text-font-primary-dark">
            {company.logoInitial}
          </span>
        </div>
        
        {/* nom entreprise */}
        <div>
          <h3 className="text-lg font-bold text-font-primary-dark group-hover:text-primary transition-colors">
            {company.name}
          </h3>
          
          {/* notation */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center text-accent">
              {[...Array(5)].map((_, index) => (
                <Star 
                  key={index} 
                  className={`w-4 h-4 ${index < company.rating ? "fill-current" : "text-primary-light"}`} 
                />
              ))}
            </div>
            <Link to={`/companies/${company.id}/reviews`} className="text-sm font-medium text-font-primary-dark hover:underline">
              {company.reviewsCount.toLocaleString('fr-FR')} avis
            </Link>
          </div>
        </div>
      </div>

      {/* link */}
      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-primary-light/20 text-sm font-medium text-font-primary-dark">
        <Link to={`/companies/${company.id}/salaries`} className="hover:text-accent-deep hover:underline transition-colors">
          Salaires
        </Link>
        <Link to={`/companies/${company.id}/questions`} className="hover:text-accent-deep hover:underline transition-colors">
          Questions
        </Link>
        <Link to={`/companies/${company.id}/jobs`} className="hover:text-accent-deep hover:underline transition-colors">
          {company.openJobs} Emplois ouverts
        </Link>
      </div>
    </div>
  );
}