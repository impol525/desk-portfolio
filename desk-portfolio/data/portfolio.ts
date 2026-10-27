export interface Project {
  title: string;
  description: string;
  tags: string[];
  href?: string;
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
  GitHub: string;
  links: ContactLink[];
}

// SAMPLE PROJECTS: replace these with John Ray's real projects when he sends them.
const projects: Project[] = [
  {
    title: "Simple Inventory System",
    description: "A web-based CRUD application designed to manage product stock levels, track item details, and generate basic inventory reports.",
    tags: ["PHP", "MySQL", "Bootstrap"],
  },
  {
    title: "Leave App",
    description: "A lightweight productivity tool allowing users to add, filter, complete, and delete daily tasks with a responsive user interface.",
    tags: ["HTML", "CSS", "JavaScript"],
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
  phone: "09957316886",
  GitHub: "hermocillajohnray821",
  // phoneIntl: "+639000000000",
  // Add his GitHub / LinkedIn / Facebook here when he sends them, for example
  // { label: "GitHub", href: "https://github.com/hermocillajohnray821" }
  links: [{ label: "GitHub", href: "https://github.com/hermocillajohnray821" },
    { label: "Facebook", href: "https://web.facebook.com/jonrey.gayato.378" }
  ],
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