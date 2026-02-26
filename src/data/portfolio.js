const translations = {
  pl: {
    bio: {
      description: "Tworzę high-endowe aplikacje webowe. Specjalizacja: React, Node.js, oraz unikalne interfejsy z duszą. Łączę nowoczesne technologie z nostalgią lat 90.",
    },
    about: {
      heading: "Manifesto",
      paragraphs: [
        "Nie wierzę w szablony. Każdy projekt to unikalna historia, którą opowiadam poprzez kod i design. Łączę surową wydajność <highlight>Reacta</highlight> z płynnością interakcji, tworząc doświadczenia, które zapadają w pamięć.",
        "Moje podejście to \"Digital Craftsmanship\" – dbałość o każdy pixel, każdą animację i każdą linijkę kodu. Nie ma dróg na skróty."
      ]
    },
    experience: [
      {
        role: "Fullstack Developer",
        period: "2025 - Obecnie",
        description: "Tworzenie nowoczesnych aplikacji webowych przy użyciu React, Node.js i Three.js. Budowanie dedykowanych rozwiązań dla klientów, ze szczególnym naciskiem na user experience i performance."
      },
      {
        role: "Student Informatyki",
        period: "2022 - 2026",
        description: "Studia inżynierskie. Specjalizacja w sieciach i inżynierii oprogramowania. Aktywny udział w kołach naukowych i projektach studenckich."
      }
    ],
    projects: {
      hireup: "Platforma sąsiedzka łącząca osoby poszukujące usług z lokalnymi wykonawcami. System ogłoszeń, chat w czasie rzeczywistym i system ocen.",
      kuznia: "Kompleksowy system zarządzania siłownią — projekt inżynierski. Rezerwacje, sklep online, panel administratora i statystyki użytkowników.",
      lankas: "Nowoczesna strona wizytówka dla lokalnej firmy usługowej. Wysoka wydajność, SEO friendly i pełna responsywność."
    },
    ui: {
      contactHeading: "System gotowy?",
      contactSubheading: "Zaczynijmy współpracować.",
      copyTooltip: "Kliknij aby skopiować",
      copied: "Skopiowano!",
      experienceHeading: "Historia_",
      skillsHeading: "Umiejętności",
      reloadPage: "Odśwież stronę",
      errorMessage: "Coś poszło nie tak.",
      noscript: "To portfolio wymaga JavaScript. Włącz JavaScript w ustawieniach przeglądarki."
    }
  },
  en: {
    bio: {
      description: "I build high-end web applications. Specializing in React, Node.js, and unique interfaces with soul. I blend modern technologies with 90s nostalgia.",
    },
    about: {
      heading: "Manifesto",
      paragraphs: [
        "I don't believe in templates. Every project is a unique story I tell through code and design. I combine the raw power of <highlight>React</highlight> with smooth interactions, creating experiences that stick.",
        "My approach is \"Digital Craftsmanship\" — attention to every pixel, every animation, and every line of code. No shortcuts."
      ]
    },
    experience: [
      {
        role: "Fullstack Developer",
        period: "2025 - Present",
        description: "Building modern web applications using React, Node.js, and Three.js. Creating custom solutions for clients with emphasis on user experience and performance."
      },
      {
        role: "Computer Science Student",
        period: "2022 - 2026",
        description: "Engineering studies. Specializing in Networks and software engineering. Active participation in scientific groups and student projects."
      }
    ],
    projects: {
      hireup: "Neighborhood platform connecting service seekers with local providers. Features job listings, real-time chat, and a rating system.",
      kuznia: "Comprehensive gym management system — engineering thesis project. Reservations, online shop, admin panel, and user statistics.",
      lankas: "Modern business card website for a local service company. High performance, SEO friendly, and fully responsive."
    },
    ui: {
      contactHeading: "Ready to build?",
      contactSubheading: "Let's work together.",
      copyTooltip: "Click to copy",
      copied: "Copied!",
      experienceHeading: "Experience_",
      skillsHeading: "Skills",
      reloadPage: "Reload Page",
      errorMessage: "Something went wrong.",
      noscript: "This portfolio requires JavaScript. Please enable JavaScript in your browser settings."
    }
  }
};

// Language-independent data
export const portfolioData = {
  bio: {
    name: "Mateusz Dombrowski",
    firstName: "Mateusz",
    title: "Fullstack Developer",
    email: "kontakt@mateuszdombrowski.com",
    socials: {
      github: "https://github.com/matidomber",
      linkedin: "https://www.linkedin.com/in/mateusz-dombrowski-61b95734a/",
    }
  },
  projects: [
    {
      id: "hireup",
      title: "HireUP",
      type: "Web Application",
      tech: ["React", "Firebase", "Tailwind"],
      link: "https://hire-up.pl/",
      image: "/projects/hireup.png"
    },
    {
      id: "kuznia",
      title: "Kuźnia Fitness",
      type: "E-commerce / Service",
      tech: ["React", "PostgreSQL", "Node.js", "Express"],
      link: "https://github.com/matidomber/GYM-main",
      image: "/projects/gym.png"
    },
    {
      id: "lankas",
      title: "LANKAS",
      type: "Landing Page",
      tech: ["HTML", "CSS", "JavaScript"],
      link: "https://github.com/matidomber/Lankas",
      image: "/projects/lankas.png"
    }
  ],
  skills: {
    frontend: ["React", "JavaScript (ES6+)", "Three.js", "Framer Motion", "Tailwind", "CSS", "HTML5", "Next.js", "TypeScript", "Redux"],
    backend: ["Node.js", "Express", "PostgreSQL", "Firebase", "REST API", "Python", "SQL"],
    tools: ["Git", "Vite", "Canvas", "AI", "AWS", "Google Cloud", "Docker", "Linux", "SSH/SFTP"],
    scripting: ["npm", "lua", "bash"]
  },
  stackHighlights: ["React", "Node.js", "Postgres"],
};

/** Get translated content for the current language */
export const getTranslation = (lang) => translations[lang] || translations.pl;

/** Get a localized project with description merged */
export const getLocalizedProjects = (lang) => {
  const t = translations[lang] || translations.pl;
  return portfolioData.projects.map(p => ({
    ...p,
    description: t.projects[p.id] || p.id
  }));
};

/** Get localized experience entries */
export const getLocalizedExperience = (lang) => {
  const t = translations[lang] || translations.pl;
  return t.experience.map((exp, i) => ({
    id: i + 1,
    company: i === 0 ? "Freelance" : "UKW Bydgoszcz",
    ...exp
  }));
};
