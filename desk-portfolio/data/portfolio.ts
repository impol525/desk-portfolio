export interface Project {
  title: string;
  description: string;
  tags: string[];
  /** Live site link. */
  href?: string;
  /** Source code link, for example a GitHub repo. */
  repo?: string;
  /** A few bullet points shown on the project's detail page. */
  details?: string[];
  /** Screenshot paths, for example "/projects/my-system/1.png" (files go in public/projects/...). */
  images?: string[];
}

export interface StackGroup {
  group: string;
  items: string[];
}

export interface ContactLink {
  label: string;
  href: string;
}

interface Contact {
  email: string;
  location: string;
  mapsUrl: string;
  phone?: string;
  phoneIntl?: string;
  links: ContactLink[];
}

/**
 * Draws a simple dashboard wireframe as an image, so the gallery has something to show
 * until real screenshots exist. Replace these with real files later (see `images` below).
 */
function wireframe(title: string, accent: string, layout: "table" | "cards"): string {
  const nav = ["Dashboard", "Records", "Requests", "Reports", "Settings"]
    .map(
      (label, i) =>
        `<rect x='14' y='${74 + i * 38}' width='132' height='28' rx='8' fill='${i === 0 ? accent : "#1e293b"}' opacity='${i === 0 ? 0.9 : 1}'/>` +
        `<text x='28' y='${92 + i * 38}' font-size='12' fill='${i === 0 ? "#0b1220" : "#94a3b8"}' font-family='sans-serif'>${label}</text>`,
    )
    .join("");

  const stats = [0, 1, 2]
    .map(
      (i) =>
        `<rect x='${190 + i * 200}' y='84' width='184' height='72' rx='10' fill='#111a2e'/>` +
        `<rect x='${204 + i * 200}' y='100' width='70' height='8' rx='4' fill='#475569'/>` +
        `<rect x='${204 + i * 200}' y='122' width='${60 + i * 20}' height='20' rx='5' fill='${accent}' opacity='0.85'/>`,
    )
    .join("");

  const body =
    layout === "table"
      ? Array.from({ length: 6 }, (_, i) => {
          const y = 180 + i * 38;
          return (
            `<rect x='190' y='${y}' width='584' height='28' rx='6' fill='${i === 0 ? "#1e293b" : "#0f172a"}'/>` +
            `<rect x='204' y='${y + 9}' width='${90 + ((i * 37) % 80)}' height='10' rx='4' fill='#475569'/>` +
            `<rect x='440' y='${y + 9}' width='70' height='10' rx='4' fill='#334155'/>` +
            `<rect x='690' y='${y + 6}' width='64' height='16' rx='8' fill='${accent}' opacity='0.6'/>`
          );
        }).join("")
      : [0, 1, 2, 3]
          .map((i) => {
            const x = 190 + (i % 2) * 296;
            const y = 180 + Math.floor(i / 2) * 124;
            return (
              `<rect x='${x}' y='${y}' width='288' height='112' rx='10' fill='#111a2e'/>` +
              `<rect x='${x + 16}' y='${y + 16}' width='120' height='10' rx='4' fill='#64748b'/>` +
              `<rect x='${x + 16}' y='${y + 40}' width='250' height='8' rx='4' fill='#334155'/>` +
              `<rect x='${x + 16}' y='${y + 58}' width='200' height='8' rx='4' fill='#334155'/>` +
              `<rect x='${x + 16}' y='${y + 84}' width='64' height='16' rx='8' fill='${accent}' opacity='0.7'/>`
            );
          })
          .join("");

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>` +
    `<rect width='800' height='450' fill='#0b1220'/>` +
    `<rect width='800' height='48' fill='#111a2e'/>` +
    `<circle cx='24' cy='24' r='6' fill='#ff5f57'/><circle cx='44' cy='24' r='6' fill='#febc2e'/><circle cx='64' cy='24' r='6' fill='#28c840'/>` +
    `<text x='92' y='29' font-size='13' fill='#cbd5e1' font-family='sans-serif'>${title}</text>` +
    `<rect x='0' y='48' width='160' height='402' fill='#0f172a'/>` +
    nav +
    `<text x='190' y='72' font-size='15' font-weight='bold' fill='#e2e8f0' font-family='sans-serif'>Overview</text>` +
    stats +
    body +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// DEMO CONTENT: these projects are made up for a class activity.
// Replace them with the real projects when they exist. To use real screenshots, put the image files in
// public/projects/<project-name>/ and list them in `images`, for example ["/projects/my-system/1.png"].
const projects: Project[] = [
  {
    title: "Barangay Resident Records System",
    description:
      "A web system for managing resident records, household information and certificate requests for a barangay office.",
    tags: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    details: [
      "Resident and household records with search and filters",
      "Online requests for barangay certificates, with status tracking",
      "Admin login with separate staff and admin access",
      "Printable certificates and monthly summary reports",
    ],
    images: [
      wireframe("Barangay Resident Records System", "#38bdf8", "table"),
      wireframe("Barangay Resident Records System", "#34d399", "cards"),
    ],
  },
  {
    title: "Online Enrollment and Grades Portal",
    description:
      "A school portal where students enroll in subjects and view their grades, and teachers encode grades and manage class lists.",
    tags: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    details: [
      "Student enrollment with subject selection and schedule checking",
      "Teacher grade encoding and class lists per section",
      "Students view their grades for each semester",
      "Admin tools for sections, subjects and user accounts",
    ],
    images: [
      wireframe("Online Enrollment and Grades Portal", "#a78bfa", "cards"),
      wireframe("Online Enrollment and Grades Portal", "#fbbf24", "table"),
    ],
  },
];

// STARTER LIST: confirm these with John Ray and edit as needed.
const stack: StackGroup[] = [
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript"] },
  { group: "Backend and database", items: ["PHP", "MySQL"] },
  { group: "Tools", items: ["Git"] },
];

const contact: Contact = {
  email: "hermocillajohnray821@gmail.com",
  location: "Macatbong, Cabanatuan City",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Macatbong+Cabanatuan+City",
  // Optional: add a phone number later, for example
  // phone: "0900 000 0000",
  // phoneIntl: "+639000000000",
  // Add his GitHub / LinkedIn / Facebook here when he sends them, for example
  // { label: "GitHub", href: "https://github.com/his-handle" }
  links: [],
};

export const portfolio = {
  name: "John Ray G. Hermocilla",
  role: "BSIT student, Web System Technology",
  school: "NEUST, Atate Campus",
  about: [
    "I'm a 4th-year BS Information Technology student majoring in Web System Technology at Nueva Ecija University of Science and Technology (NEUST), Atate Campus.",
    "I'm based in Cabanatuan City, and I'm learning to build web systems from the database to the interface.",
  ],
  projects,
  stack,
  contact,
};