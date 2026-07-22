// ce fichier gere le component de generation de cartes (statistiques)

// informations de la card
export default function AdminStatCard({
  title,
  value,
  icon: Icon,
  trendText,
  trendColor = "text-green-600",
  colorClass = "bg-primary/10 text-primary"
}) {

  return (
    <article className="bg-bone-light/70 backdrop-blur-md p-5 rounded-3xl shadow-[0_0_15px_rgba(0,0,0,0.05)] border border-white/50 transition-all">
      <div className="flex justify-between items-start">

        <div>
         <h3 className="text-font-primary-dark text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-font-primary-dark mt-1" aria-label={`${value} ${title}`}>
            {value}
          </p>
        </div>
        <div className={`p-2 rounded-xl ${colorClass}`} aria-hidden="true">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className={`text-xs mt-2 font-medium ${trendColor}`}>{trendText}</p>
    </article>
  );
}