import {
  faCode,
  faDatabase,
  faCoffee,
  faServer,
  faFileExcel,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import {
  faWindows,
  faAndroid,
  faLinux,
} from "@fortawesome/free-brands-svg-icons";

interface Experience {
  mission: {
    [lang: string]: string;
  };

  info: {
    date?: {
      begin: string;
      end?: string;
    };
    place?: {
      link: string;
      text: string;
    };
    website?: string;
  };

  technologies: { name: string; icon: IconDefinition }[];

  keywords?: { [lang: string]: string[] };
  description?: { [lang: string]: string };
}

export default {
  "VIE Schneider Electric Ecobuilding": {
    mission: {
      en: "Web Programming Engineer and Data Analyst",
      fr: "Ingénieur Développement Web et Analyse de Données",
    },
    info: {
      date: {
        begin: "2018-11-01",
      },
      place: {
        link: "https://goo.gl/maps/fUQPfADV4Nq",
        text: "BOC, Andover, Massachussets",
      },
    },
    technologies: [
      {
        name: "JavaScript",
        icon: faCode,
      },
      {
        name: "Python",
        icon: faCode,
      },
      {
        name: "API integration",
        icon: faDatabase,
      },
    ],
  },
  "Schneider Electric Ecobuilding": {
    mission: {
      en: "Web Programming Engineer and Data Analyst",
      fr: "Ingénieur Développement Web et Analyse de Données",
    },
    info: {
      date: {
        begin: "2018-04-03",
        end: "2018-09-07",
      },
      place: {
        link: "https://goo.gl/maps/xf7HVYrEgFz",
        text: "HIVE, Rueil-Malmaison, France",
      },
    },
    technologies: [
      {
        name: "JavaScript",
        icon: faCode,
      },
      {
        name: "Python",
        icon: faCode,
      },
      {
        name: "API integration",
        icon: faDatabase,
      },
    ],
  },
  "Freelance (Bonjour Paris)": {
    mission: {
      en: "Front-end web developer",
      fr: "Développeur web (front-end)",
    },
    info: {
      date: {
        begin: "2017-01-09",
        end: "2018-03-30",
      },
      place: {
        link:
          "https://www.google.fr/maps/place/Angers/@47.481983,-0.6331467,12z/data=!3m1!4b1!4m5!3m4!1s0x480878da00e58e9d:0x40d37521e0d9c30!8m2!3d47.478419!4d-0.563166",
        text: "Angers, France",
      },
      website: "https://vuarnet.com",
    },
    keywords: {
      en: ["Freelance", "e-shop", "Team work"],
      fr: [
        "Auto-entrepreneur",
        "Plateforme e-commerce",
        "Travail en collaboration",
      ],
    },
    description: {
      en:
        "Along side my formation at Groupe ESEO, Bonjour Paris asked me to continue to work for them on the Vuarnet website we have been building. My task was to code the evolutions of their current e-shop website on the front end, and to add some scripts on the server (Windows Server 2012) to automate the deploying process. You can browse this very website using the link above.",
      fr:
        "En parallèle de ma formation à l'ESEO, Bonjour Paris a souhaité que je continue à m'occuper des évolutions sur le site e-commerce de Vuarnet, entreprise française, connue pour ses lunettes de soleil et ses masques de ski. Mes missions consistent à implémenter les nouvelles fonctionnalités demandées par Vuarnet sur la partie front-end de leur site internet. Vous pouvez visiter ce site web en utilisant le lien ci-dessus.",
    },
    technologies: [
      {
        name: "JavaScript",
        icon: faCode,
      },
      {
        name: "ASP.NET",
        icon: faCode,
      },
      {
        name: "Windows Server",
        icon: faWindows,
      },
    ],
  },
  "ProSE (ESEO + Qowisio)": {
    mission: {
      en: "Android developer",
      fr: "Développeur d'application Android",
    },
    info: {
      date: {
        begin: "2017-03-15",
        end: "2017-06-21",
      },
      place: {
        link:
          "https://www.google.fr/maps/place/Qowisio/@47.4622272,-0.5630493,17.78z/data=!4m5!3m4!1s0x48087447aea98d77:0xd175597396fb2edd!8m2!3d47.4623394!4d-0.5619584",
        text: "Angers, France",
      },
    },
    keywords: {
      en: [
        "Project management",
        "Android app development",
        "Connected objects",
      ],
      fr: [
        "Gestion de projet",
        "Conception de systèmes embarqués",
        "Développement mobile",
      ],
    },
    description: {
      en:
        "The small French company Qowisio asked us to make a demonstration kit for its Ultra-Narrow-Band technology (UNB) implementation; the purpose of this kit is to emulate a UNB network able to interact with the connected objects nearby, and a WiFi network to allow customers to connect their device and try the Android app we created with the team I led (four developers). This application gathers all the data from the connected objets and displays it on the screen. This application is internally used by Qowisio to sell its technology to its customers.",
      fr:
        "Qowisio, PME angevine spécialisée dans le traitement de données issues d'objets connectés, nous a demandé de réaliser un kit de démonstration de sa technologie Ultra-Narrow-Band (UNB). Le kit devait être capable d'émuler un réseau UNB hébergeant quelques objets connectés de Qowisio ainsi qu'un réseau WiFi sur lequel les prospects peuvent se connecter pour constater l'efficacité du réseau Qowisio. Mon rôle dans ce projet fut de diriger l'équipe Android de 4 personnes et de réaliser l'API qui permet à ladîte application de récupérer les données émanant des objets connectés.",
    },
    technologies: [
      {
        name: "Android",
        icon: faAndroid,
      },
      {
        name: "Java",
        icon: faCoffee,
      },
      {
        name: "Linux",
        icon: faLinux,
      },
      {
        name: "PHP",
        icon: faCode,
      },
      {
        name: "Apache",
        icon: faServer,
      },
      {
        name: "C",
        icon: faCode,
      },
    ],
  },
  "Bonjour Paris": {
    mission: {
      en: "Web developer",
      fr: "Intégration de solutions web",
    },
    info: {
      date: {
        begin: "2016-07-11",
        end: "2016-11-26",
      },
      place: {
        text: "Paris, France",
        link:
          "https://www.google.fr/maps/place/Bonjour+Paris/@48.8748121,2.3530751,17z/data=!3m1!4b1!4m5!3m4!1s0x47e66e12e8380f8b:0x26663d64703602b5!8m2!3d48.8748121!4d2.3552638",
      },
      website: "http://dev.bonjour.agency",
    },
    keywords: {
      en: [
        "Server maintenance&administration",
        "UI design integration",
        "WebDev",
      ],
      fr: [
        "Administration de serveur",
        "Conception d'interface d'utilisateur",
        "Développement Web",
      ],
    },
    description: {
      en:
        "Bonjour Paris is a global luxury communication agency focused on forward-thinking ideas, business-minded solutions for premium brands. My task was to build up the agency's website from scratch using the agency's visual identity; you can browse this very website using the link above. With a talented team of designers, I collaborated on the Vuarnet commercial website (vuarnet.com), and the Peter Lindbergh's presentation website as well (peterlindbergh.com). I was also in charge of choosing, setting up and maintaining their virtual private servers which host their websites and serve a Gitlab instance for code versioning purpose.",
      fr:
        "Bonjour Paris est une agence de design parisienne spécialisée dans le graphisme au service de l'industrie du luxe. Ma mission durant mon expérience chez Bonjour Paris fut de réaliser l'intégration de leur site internet de présentation de l'agence. Vous pouvez visiter ce site web en utilisant le lien ci-dessus. J'ai également été sollicité pour réaliser certaines parties du site du célèbre photographe allemand Peter Lindbergh et reprendre le développement du site e-commerce de Vuarnet, marque de lunettes de soleil française.",
    },
    technologies: [
      {
        name: "PHP",
        icon: faCode,
      },
      {
        name: "JavaScript",
        icon: faCode,
      },
      {
        name: "Linux",
        icon: faLinux,
      },
      {
        name: "ASP.NET",
        icon: faCode,
      },
      {
        name: "SQL",
        icon: faDatabase,
      },
    ],
  },
  "SEIO Junior-Entreprise": {
    mission: {
      en: "Vice-Chairman",
      fr: "Vice-Président",
    },
    info: {
      date: {
        begin: "2015-06-11",
        end: "2017-05-11",
      },
      place: {
        text: "Angers, France",
        link:
          "https://www.google.com/maps/place/SEIO+Junior-Entreprise/@47.493483,-0.550851,16z/data=!4m5!3m4!1s0x0:0x9ba3d648073c86d5!8m2!3d47.4934831!4d-0.5508506?ll=47.493483,-0.550851&z=16&t=m&hl=fr&gl=FR&mapclient=embed&cid=11215043101930063573",
      },
      website: "https://www.seio.org",
    },
    keywords: {
      en: [
        "Team managment",
        "Quality process supervision",
        "Intern ERP development",
      ],
      fr: ["Management", "Suivi qualité", "Développement d'un ERP interne"],
    },
    description: {
      en:
        "The SEIO is the Junior Entreprise of Groupe ESEO (the engineer school I attend). As Vice-Chairman, my task was to supervise the internal and external communication department, audit and quality department and IT department. I was in charge of managing the development of our internal ERP.",
      fr:
        "Le SEIO est la Junior-Entreprise de l'ESEO, école dans laquelle j'effectue ma formation d'ingénieur. J'ai occupé le poste de Vice-Président chargé de la communication interne et externe, du pôle audit et qualité, et des systèmes d'informations. Mon rôle au sein de cette Junior-Entreprise était de manager mes équipes et participer aux prises de décisions concernant le fonctionnement de l'association. Pour ce faire, j'ai réalisé, en collaboration avec deux de mes camarades, un intranet intégré aux différents environnements de travail nécessaires à notre activité.",
    },
    technologies: [
      {
        name: "Linux",
        icon: faLinux,
      },
      {
        name: "PHP",
        icon: faCode,
      },
      {
        name: "SQL",
        icon: faDatabase,
      },
      {
        name: "JavaScript",
        icon: faCode,
      },
    ],
  },
  "Crédit Agricole": {
    mission: {
      en: "Business Manager Assistant",
      fr: "Assistant chargé d'affaires en agence entreprise",
    },
    info: {
      date: {
        begin: "2015-07-06",
        end: "2015-07-31",
      },
      place: {
        link:
          "https://www.google.fr/maps/place/Cr%C3%A9dit+Agricole+Charente-Maritime+Deux-S%C3%A8vres/@45.7468535,-0.6271264,19.27z/data=!4m8!1m2!2m1!1ssaintes+credit+agricole+entreprise!3m4!1s0x0:0xb7e8b7c7981d521d!8m2!3d45.746941!4d-0.627188",
        text: "Saintes, France",
      },
    },
    keywords: {
      en: [
        "Audit customers' files",
        "Customer reminder tool",
        "Reception of customers",
      ],
      fr: [
        "Audit dossier clients",
        "Modélisation relance clients",
        "Accueil clients",
      ],
    },
    description: {
      en:
        "During the time I spent working with Crédit-Agricole, at the enterprises' bank office, my task was to welcome customers who come by or phone. Also, I was in charge of checking customers juridical files integrity and contacting them to get updated documents.",
      fr:
        "Au sein de l'agence entreprise de Saintes du Crédit Agricole Charente-Maritime Deux-Sèvres, j'ai appris à gérer la relation client professionnel, notamment par l'accueil téléphonique et physique. Cette expérience m'a également permis de comprendre le fonctionnement interne des mécanismes bancaires. J'ai eu pour missions d'auditer les dossiers juridiques et de proposer une modélisation des relances client sur tableur.",
    },
    technologies: [
      {
        name: "Excel",
        icon: faFileExcel,
      },
    ],
  },
} as { [experienceName: string]: Experience };
