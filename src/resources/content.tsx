import {
  About,
  Blog,
  Whop,
  Home,
  Newsletter,
  Person,
  Social,
  Work,
} from "@/types";
import { Line, Row, Text } from "@once-ui-system/core";
import Image from "next/image";
import { FomoRank } from "@/components/FomoRank";

const person: Person = {
  firstName: "Rokit",
  lastName: "G",
  name: `Rokit G`,
  role: "Software Engineer",
  avatar: "/images/avatar.jpg",
  email: "1rokitg@gmail.com",
  location: "Europe/Madrid", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Spanish"], // optional: Leave the array empty if you don't want to display languages
  locale: "en", // BCP 47 language tag for the HTML lang attribute, e.g., 'en', 'ja', 'zh-TW'
};

const newsletter: Newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}'s Newsletter</>,
  description: <>My weekly newsletter about markets and tech</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  // Set essentials: true for links you want to show on the about page
  {
    name: "Discord",
    icon: "discord",
    link: "https://whop.com/rokitg/free-comm",
    essential: true,
  },
  {
    name: "Telegram",
    icon: "telegram",
    link: "https://t.me/rok1tg",
    essential: true,
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/1rokitg",
    essential: false,
  },
  {
    name: "TikTok",
    icon: "tiktok",
    link: "https://www.tiktok.com/@rokitg",
    essential: false,
  },
  {
    name: "YouTube",
    icon: "youtube",
    link: "https://www.youtube.com/@1rokitg",
    essential: false,
  },
  {
    name: "Twitter",
    icon: "twitter",
    link: "https://x.com/1rokitg",
    essential: true,
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: "ROKITG.COM",
  description: `Learn how unprofitable traders are becoming the top 2%`,
  headline: <> How unprofitable traders are becoming the top 2%</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <Row gap="8" vertical="center">
          <Image
            src="/images/fomo-logo.png"
            alt="Fomo App logo"
            width={26}
            height={26}
            style={{ width: "26px", height: "26px", borderRadius: "6px" }}
          />
          <strong className="">Fomo App</strong>
        </Row>
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          <FomoRank />
        </Text>
      </Row>
    ),
    href: "https://fomo.family/r/rokitg",
  },
  subline: (
    <>
      I'm {person.firstName}, a {person.role.toLowerCase()} turned{" "}
      <Text as="span" size="xl" weight="strong">
        trader.{" "}
      </Text>
      <br />
      Now I've decided to share my knowledge with everyone.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: false,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/rokitg/community",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Soy Rokit, ingeniero de software en Madrid y parte del mundo del trading.
        Detrás de ROKITG hay una comunidad que estoy construyendo. ¿Quieres conocerme
        y formar parte de ella? Haz clic en Discord y únete gratis.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "FLY",
        timeframe: "2022 - Present",
        role: "Senior Design Engineer",
        achievements: [
          <>
            Redesigned the UI/UX for the FLY platform, resulting in a 20%
            increase in user engagement and 30% faster load times.
          </>,
          <>
            Spearheaded the integration of AI tools into design workflows,
            enabling designers to iterate 50% faster.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Once UI Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Creativ3",
        timeframe: "2018 - 2022",
        role: "Lead Designer",
        achievements: [
          <>
            Developed a design system that unified the brand across multiple
            platforms, improving design consistency by 40%.
          </>,
          <>
            Led a cross-functional team to launch a new product line,
            contributing to a 15% increase in overall company revenue.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "University of Jakarta",
        description: <>Studied software engineering.</>,
      },
      {
        name: "Build the Future",
        description: <>Studied online marketing and personal branding.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Futures Trading",
        description: <>Known for his public Hyperliquid PnL.</>,
        tags: [],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
      {
        title: "Frontend Engineering",
        description: (
          <>
            Built next gen apps with the latest technologies on both Web2 and
            Web3 environments.
          </>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
        ],
        // optional: leave the array empty if you don't want to display images
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about markets and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const whop: Whop = {
  path: "/whop",
  label: "Whop",
  title: `Whop – ${person.name}`,
  description: `Whop products by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, whop };
