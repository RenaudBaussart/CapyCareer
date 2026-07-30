// fichier de données de démo
// WARNING: fichier temporaire, à supprimer une fois le fetch N8N branché

// liste "légère" telle que renvoyée par la route listing
export const JOBS_LISTING_MOCK = [
  {
    PK_id: 1,
    name: "Healthcare Software Engineer Fullstack - CDI Paris - Theodo HealthTech",
    contract_type: "CDI",
    city: "Paris",
    country: "France",
    company: "Theodo",
  },
  {
    PK_id: 2,
    name: "AI-Native Software Engineer - CDI Paris - Theodo",
    contract_type: "CDI",
    city: "Paris",
    country: "France",
    company: "Theodo",
  },
  {
    PK_id: 3,
    name: "Jeune Docteur - R&D en Intelligence Artificielle | Practice IA MARGO",
    contract_type: "CDI",
    city: "Paris",
    country: "France",
    company: "MARGO",
  },
  {
    PK_id: 4,
    name: "Cloud Engineer - London - Theodo UK",
    contract_type: "CDI",
    city: "Londres",
    country: "Royaume-Uni",
    company: "Theodo",
  },
];

// détail complet tel que renvoyé par la route offre (indexé par PK_id)
export const JOBS_DETAIL_MOCK = {
  1: {
    PK_id: 1,
    name: "Healthcare Software Engineer Fullstack - CDI Paris - Theodo HealthTech",
    contract_type: "CDI",
    city: "Paris",
    country: "France",
    company: "Theodo",
    description:
      "Chez Theodo HealthTech, nous accompagnons les acteurs de la santé dans le développement de dispositifs médicaux digitaux sur-mesure.\n\nTes missions :\n- Concevoir et développer des applications web/mobile certifiées \"dispositif médical\".\n- Décider de la stack technique (NestJS, React, React native, Vue, Angular, FHIR...).\n\nProfil recherché :\n- Diplômé·e d'une école d'ingénieur ou formation équivalente.\n- Minimum 2 ans d'expérience en développement.",
    url: "https://welovedevs.com/fr/app/job/healthcare-software-engineer-fullstack-cdi-paris-theodo-healthtech",
    is_remote_job: false,
    is_hybride_job: false,
    publish_date: "2025-10-09T20:18:18.000Z",
    salary_min: null,
    salary_max: null,
    currency: "EUR",
  },
  2: {
    PK_id: 2,
    name: "AI-Native Software Engineer - CDI Paris - Theodo",
    contract_type: "CDI",
    city: "Paris",
    country: "France",
    company: "Theodo",
    description:
      "En tant que Software Engineer Fullstack, ta mission sera de concevoir et écrire du code de qualité pour répondre aux problèmes de ton client.\n\nPour ça tu apprendras à :\n- Comprendre le problème de ton client et y apporter une solution maintenable.\n- Utiliser l'IA dans ton flux de travail quotidien, en la traitant comme un partenaire.",
    url: "https://welovedevs.com/fr/app/job/ainative-software-engineer-cdi-paris-theodo",
    is_remote_job: false,
    is_hybride_job: false,
    publish_date: "2025-10-09T20:18:12.000Z",
    salary_min: null,
    salary_max: null,
    currency: "EUR",
  },
  3: {
    PK_id: 3,
    name: "Jeune Docteur - R&D en Intelligence Artificielle | Practice IA MARGO",
    contract_type: "CDI",
    city: "Paris",
    country: "France",
    company: "MARGO",
    description:
      "Nous recherchons un(e) Jeune Docteur R&D passionné(e) par l'IA Générative et le Machine Learning.\n\nVos missions :\n- Développer des systèmes d'agents IA complexes.\n- Expérimenter les Foundation Models (LLMs, multimodalité, NLP, ML).\n\nProfil recherché :\n- Doctorat en IA, Machine Learning, NLP ou discipline connexe.",
    url: "https://welovedevs.com/fr/app/job/jeune-docteur-rampd-en-intelligence-artificielle-practice-ia-margo",
    is_remote_job: false,
    is_hybride_job: false,
    publish_date: "2025-10-09T20:18:12.000Z",
    salary_min: null,
    salary_max: null,
    currency: "EUR",
  },
  4: {
    PK_id: 4,
    name: "Cloud Engineer - London - Theodo UK",
    contract_type: "CDI",
    city: "Londres",
    country: "Royaume-Uni",
    company: "Theodo",
    description:
      "You will be building with Serverless on AWS. This will be a client-facing role.\n\nSkills:\n- Proven experience with AWS Serverless technologies (Lambda, API Gateway, DynamoDB).\n- Strong programming skills in Node.js and TypeScript.",
    url: "https://welovedevs.com/fr/app/job/cloud-engineer-london-theodo-uk",
    is_remote_job: false,
    is_hybride_job: true,
    publish_date: "2025-10-09T20:18:12.000Z",
    salary_min: null,
    salary_max: null,
    currency: "EUR",
  },
};

// simule la route listing (délai artificiel pour se rapprocher d'un vrai appel réseau)
export function fetchJobOffersMock() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ job_offers: JOBS_LISTING_MOCK, is_the_end: true });
    }, 400);
  });
}

// simule la route offre
export function fetchJobOfferDetailMock(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const job = JOBS_DETAIL_MOCK[id];
      if (job) resolve(job);
      else reject(new Error("Offre introuvable"));
    }, 300);
  });
}