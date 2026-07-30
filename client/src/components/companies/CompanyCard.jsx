// fichier gerant le component pour afficher la liste des entreprises

export default function CompanyCard({ company = {} }) {
  // au cas ou les datas sont incomplètes
  const initial = company.logoInitial || company.name?.charAt(0) || "?";

  return (
    <div className="bg-bone-light border border-primary-light/20 rounded-2xl p-6 flex flex-col h-full">

      {/* en tete */}
      <div className="flex items-center gap-4 mb-6">
        {/* logo entreprise */}
        <div className="w-14 h-14 rounded-xl bg-bone-light border-2 border-primary-light/30 flex items-center justify-center shrink-0">
          <span className="text-2xl font-bold text-font-primary-dark">
            {initial}
          </span>
        </div>

        {/* nom entreprise */}
        <div>

          <h2 className="text-xl font-bold text-font-primary-dark">
            {company.name || "Entreprise"}
          </h2>
        </div>
      </div>

      {/* nbr offre salaire */}
      <div className="mt-auto space-y-3">

        {/* offres */}
        <div className="flex items-center justify-between bg-primary-light/10 p-3 rounded-xl border border-primary-light/20">
          <span className="text-sm font-medium text-font-primary-dark/80">
            Offres ouvertes
          </span>
          <span className="text-base font-bold text-deep-primary">
            {company.openJobs ?? 0} {(company.openJobs || 0) > 1 ? "postes" : "poste"}
          </span>
        </div>

        {/* salaire */}
        <div className="flex items-center justify-between bg-accent/10 p-3 rounded-xl border border-accent/20">
          <span className="text-sm font-medium text-font-primary-dark/80">
            Salaire moyen
          </span>
          <span className="text-base font-bold text-accent-deep">
            {company.averageSalary
              ? `${company.averageSalary.toLocaleString('fr-FR')} €/an`
              : "Non communiqué"}
          </span>
        </div>

      </div>
    </div>
  );
}