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
      link: "https://github.com/matidomber/HIREUP",
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
    frontend: ["React", "JavaScript (ES6+)", "Three.js", "Framer Motion", "Tailwind", "CSS", "HTML5", "Next.js", "TypeScript"],
    backend: ["Node.js", "Express", "PostgreSQL", "Firebase", "REST API"],
    tools: ["Git", "Vite", "Canvas", "AI", "AWS", "Docker"],
    scripting: ["npm", "lua"]
  },
  stackHighlights: ["React", "Node.js", "Postgres"],
  cv: {
    phone: "+48 518 851 572",
    dob: "26.07.2003",
    location: "Toruń / Bydgoszcz",
  }
};

// CV-specific translations
export const cvTranslations = {
  pl: {
    title: "Curriculum Vitae",
    download: "Pobierz CV",
    close: "Zamknij",
    sections: {
      personalInfo: "Dane osobowe",
      objective: "Cel zawodowy",
      education: "Wykształcenie",
      experience: "Doświadczenie zawodowe",
      skills: "Umiejętności techniczne",
      certificates: "Certyfikaty",
      languages: "Języki",
      interests: "Zainteresowania",
    },
    labels: {
      phone: "Telefon",
      email: "E-mail",
      location: "Lokalizacja",
      dob: "Data urodzenia",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    objective: "Fullstack Developer z pasją do tworzenia nowoczesnych aplikacji webowych. Specjalizuję się w React, Node.js i Three.js. Szukam możliwości rozwoju w dynamicznym zespole, gdzie mogę łączyć wiedzę techniczną z kreatywnością.",
    education: [
      {
        school: "Uniwersytet Kazimierza Wielkiego w Bydgoszczy",
        degree: "Inżynier — Informatyka",
        specialization: "Sieci komputerowe i inżynieria oprogramowania",
        period: "2022 – 2026",
      },
      {
        school: "Liceum Ogólnokształcące w Brodnicy",
        degree: "Profil z rozszerzeniem Informatyki",
        specialization: "",
        period: "2019 – 2022",
      }
    ],
    experience: [
      {
        role: "Fullstack Developer",
        company: "Freelance",
        period: "2025 – obecnie",
        duties: [
          "Projektowanie i budowanie aplikacji webowych w React, Node.js i Three.js",
          "Współpraca z klientami (m.in. firma LANKAS) — strony wizytówkowe, systemy web",
          "Optymalizacja wydajności, SEO i responsywności",
        ]
      },
      {
        role: "Hydraulik",
        company: "Działalność własna / po godzinach",
        period: "2020 – obecnie",
        duties: [
          "Instalacje i naprawy hydrauliczne — ponad 10 lat doświadczenia praktycznego",
          "Obsługa klientów indywidualnych i małych firm",
          "Zarządzanie zleceniami i materiałami",
        ]
      },
      {
        role: "Kurier cateringu",
        company: "Bydgoszcz",
        period: "3 miesiące",
        duties: [
          "Terminowa dostawa posiłków na terenie Bydgoszczy",
          "Obsługa klienta i logistyka tras",
        ]
      }
    ],
    certificates: [
      "Certyfikat HTML, CSS, JavaScript",
    ],
    languages: [
      { name: "Polski", level: "ojczysty" },
      { name: "Angielski", level: "C1" },
    ],
    interests: "Informatyka i budowa komputerów, siłownia, gry komputerowe",
    rodo: "Wyrażam zgodę na przetwarzanie moich danych osobowych dla potrzeb niezbędnych do realizacji procesu rekrutacji zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych (RODO).",
  },
  en: {
    title: "Curriculum Vitae",
    download: "Download CV",
    close: "Close",
    sections: {
      personalInfo: "Personal Information",
      objective: "Career Objective",
      education: "Education",
      experience: "Work Experience",
      skills: "Technical Skills",
      certificates: "Certificates",
      languages: "Languages",
      interests: "Interests",
    },
    labels: {
      phone: "Phone",
      email: "E-mail",
      location: "Location",
      dob: "Date of Birth",
      github: "GitHub",
      linkedin: "LinkedIn",
    },
    objective: "Fullstack Developer passionate about building modern web applications. Specializing in React, Node.js, and Three.js. Seeking opportunities to grow in a dynamic team where I can combine technical expertise with creativity.",
    education: [
      {
        school: "Kazimierz Wielki University in Bydgoszcz",
        degree: "Bachelor of Engineering — Computer Science",
        specialization: "Computer Networks and Software Engineering",
        period: "2022 – 2026",
      },
      {
        school: "High School in Brodnica",
        degree: "Computer Science extended profile",
        specialization: "",
        period: "2019 – 2022",
      }
    ],
    experience: [
      {
        role: "Fullstack Developer",
        company: "Freelance",
        period: "2025 – Present",
        duties: [
          "Designing and building web applications using React, Node.js, and Three.js",
          "Working with clients (incl. LANKAS) — business websites, web systems",
          "Performance optimization, SEO, and responsive design",
        ]
      },
      {
        role: "Plumber",
        company: "Self-employed / Part-time",
        period: "2020 – Present",
        duties: [
          "Plumbing installations and repairs — over 10 years of hands-on experience",
          "Serving individual clients and small businesses",
          "Managing orders and materials",
        ]
      },
      {
        role: "Catering Courier",
        company: "Bydgoszcz",
        period: "3 months",
        duties: [
          "Timely meal delivery across Bydgoszcz",
          "Customer service and route logistics",
        ]
      }
    ],
    certificates: [
      "HTML, CSS, JavaScript Certificate",
    ],
    languages: [
      { name: "Polish", level: "native" },
      { name: "English", level: "C1" },
    ],
    interests: "IT and computer building, gym & fitness, PC gaming",
    rodo: "I consent to the processing of my personal data for the purposes of the recruitment process in accordance with the Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 (GDPR).",
  }
};

export const getCVTranslation = (lang) => cvTranslations[lang] || cvTranslations.pl;

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
