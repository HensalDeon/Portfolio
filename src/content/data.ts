export type Service = { title: string; description: string };

export type CapabilityGroup = { title: string; items: string[] };

export type Experience = {
  title: string;
  company: string;
  start: string;
  end: string;
  summary: string;
  points: string[];
};

export const services: Service[] = [
  {
    title: "Next.js and React",
    description:
      "Marketing sites and web apps on the App Router with TypeScript, Tailwind and headless CMS platforms such as Sanity.",
  },
  {
    title: "Webflow",
    description:
      "Design-faithful Webflow builds with CMS collections, interactions and a structure that stays maintainable.",
  },
  {
    title: "Motion and 3D",
    description:
      "Scroll-driven motion, Spline scenes and Three.js pieces that add character without costing load time.",
  },
  {
    title: "Performance and polish",
    description:
      "Fast loads, accessible markup, motion that respects the user and close attention to the design.",
  },
];

export const capabilities: CapabilityGroup[] = [
  {
    title: "Build",
    items: ["Next.js", "React", "TypeScript", "Node.js", "Express", "MongoDB", "GraphQL"],
  },
  {
    title: "Platforms",
    items: ["Webflow", "Sanity", "WordPress", "Firebase", "Vercel", "Netlify"],
  },
  {
    title: "Craft",
    items: ["Tailwind CSS", "Sass", "Three.js", "Spline", "Web animation", "Accessibility"],
  },
  {
    title: "Workflow",
    items: ["Figma", "Git", "GitHub", "GitLab", "Claude", "Cursor"],
  },
];

export const experiences: Experience[] = [
  {
    title: "Senior Web Developer",
    company: "Eighty Six Media",
    start: "2025",
    end: "Now",
    summary: "Webflow, React and Next.js builds for brands, with Spline 3D in the mix.",
    points: [
      "Build web applications with Webflow, React and Next.js.",
      "Integrate Spline scenes to bring interactive 3D into marketing sites.",
      "Maintain client projects across Next.js, WordPress and Webflow.",
      "Use AI tooling such as Claude, Cursor and Antigravity to move quickly.",
      "Style with Tailwind CSS and plain CSS for responsive, scalable layouts.",
    ],
  },
  {
    title: "Associate Software Developer",
    company: "Webandcrafts",
    start: "2024",
    end: "2025",
    summary:
      "React and Next.js product work, payment gateways and close collaboration with backend.",
    points: [
      "Built web applications with React and Next.js, focused on functionality and data flow.",
      "Managed state with Recoil and React Context.",
      "Integrated payment gateways including Checkout and Mastercard.",
      "Worked closely with the backend team to keep workflows smooth.",
      "Fetched data with SWR, GraphQL and Axios.",
      "Styled with Tailwind CSS, SCSS and CSS.",
    ],
  },
  {
    title: "Web Developer",
    company: "Trusttech",
    start: "2023",
    end: "2024",
    summary: "Full-stack builds across React, Node.js and PHP, designed alongside the Figma team.",
    points: [
      "Developed web applications with React, HTML5, SCSS, Tailwind CSS, Bootstrap, JavaScript, Node.js and PHP.",
      "Collaborated with the design team in Figma on visually rich, user-friendly interfaces.",
    ],
  },
  {
    title: "MERN Stack Developer",
    company: "Brototype",
    start: "2023",
    end: "2023",
    summary: "An intensive year of MERN applications, from Express APIs to React front ends.",
    points: [
      "Built front ends with React, Redux, JavaScript, Tailwind CSS, Bootstrap, Handlebars and EJS.",
      "Built back ends with Node.js, Express and MongoDB, plus SQL, Ajax and Axios.",
      "Wrote efficient database queries to keep response times low.",
      "Worked with designers in Figma on clear, user-friendly interfaces.",
    ],
  },
];
