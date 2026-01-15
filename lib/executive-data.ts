/**
 * Executive data structure and utilities
 * Parsed from executive-lib.csv
 */

export type Executive = {
  name: string;
  slug: string;
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  tone: string;
  frequentlyUsedWords: string;
  executivePositioning: string;
  otherNotes: string;
  status: string;
};

/**
 * Executive data parsed from CSV
 * Only includes Active executives
 */
export const EXECUTIVES: Executive[] = [
  {
    name: "Alex Cho",
    slug: "alex-cho",
    firstName: "Alex",
    lastName: "Cho",
    title: "President of Personal Systems at HP",
    company: "hp",
    tone: "Energized & professional",
    frequentlyUsedWords: "digital-equity; innovation; ai-2; sustainability; future-of-work; game-changing-2; hybrid-2; revolutionized",
    executivePositioning:
      "Digital Equity Enthusiast - Digital Equity is a personal passion for Alex and a major aspect to HP's Sustainable Impact. Future of AI Visionary - Alex shares insights on how AI is revolutionizing the tech industry. Product Expert - Alex shares news on the latest PS product and service launches.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Anneliese Olson",
    slug: "annelieseolson",
    firstName: "Anneliese",
    lastName: "Olson",
    title: "President, Imaging, Printing & Solutions",
    company: "hp",
    tone: "",
    frequentlyUsedWords: "",
    executivePositioning: "",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Aurelio Maruggi",
    slug: "aurelio-maruggi",
    firstName: "Aurelio",
    lastName: "Maruggi",
    title: "Division President of HP Office Print Solutions",
    company: "hp",
    tone: "Frequently talks about working in channel",
    frequentlyUsedWords: "hp; print; office-print",
    executivePositioning:
      "Channel Expert - Elevating a unique perspective. User Experience Evangelist - Positioning HP as a solutions company. Print Visionary - Revolutionizing printing in the modern workforce.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Carlos F. Cortés",
    slug: "carlos-f-cortes",
    firstName: "Carlos",
    lastName: "Cortés",
    title: "HP Mexico MD",
    company: "hp",
    tone: "Celebratory, excited, informative, detailed",
    frequentlyUsedWords: "ai; excited; partners; future-of-work; hybrid; edge; sustainability; hyperx; win",
    executivePositioning:
      "Trusted Market Leader - Near-shoring to Mexico. Customer Advocate - Creating lasting connections. Industry Trend Expert - Staying current on industry trends.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Dave Shull",
    slug: "dave-shull",
    firstName: "Dave",
    lastName: "Shull",
    title: "President of HP Solutions",
    company: "hp",
    tone: "Concise, casual, and personable",
    frequentlyUsedWords: "ai-2; hybrid-work; hybrid-2; innovation; poly; future-of-work; hp-solutions",
    executivePositioning:
      "Future of Work - Hybrid Expert. Cultivating Tech Talent. Software and Services. Bringing a Human Touch.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "David McQuarrie",
    slug: "david-mcquarrie",
    firstName: "David",
    lastName: "McQuarrie",
    title: "Chief Commercial Officer",
    company: "hp",
    tone: "Energetic; concise, rarely exceeds two grafs; partner and customers focused",
    frequentlyUsedWords: "ai; futureready; future-of-work",
    executivePositioning: "",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Ester Chiachio",
    slug: "ester-chiachio",
    firstName: "Ester",
    lastName: "Chiachio",
    title: "Head of Corporate Experiences at HP",
    company: "hp",
    tone: "Professional, energized and more long-form",
    frequentlyUsedWords: "cwc; ai; barcelona; future-of-work; game-changing; hybrid; innovative; women-in-tech",
    executivePositioning:
      "CWC Team Wins. CWC News. AI and Product Spotlights - Ester amplifies how human capabilities can be further enabled with the right technology.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Filiz Akdede",
    slug: "filiz-akdede",
    firstName: "Filiz",
    lastName: "Akdede",
    title: "Global Head of Go-To-Market, 3D Printing Solutions @HP",
    company: "hp",
    tone: "Smart and Thoughtful",
    frequentlyUsedWords: "hp; 3d-printing; barcelona; digital-equity; sustainability",
    executivePositioning:
      "Leadership & Teamwork - Providing real-time insights on the ground with partners. Sustainability - Uplifting people from disadvantages backgrounds. Future Trends & Technologies - HP has a future-focused strategy.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "François Minec",
    slug: "francois-minec",
    firstName: "François",
    lastName: "Minec",
    title: "VP & Global Head Polymers 3D Printing",
    company: "hp",
    tone: "Professional and Excited",
    frequentlyUsedWords: "print",
    executivePositioning:
      "Partner Cheerleader - Providing real-time insights on the ground with partners. Enthusiastic Team Leader - Sharing out from on-the-ground with the team. 3D Printing Adoption Evangelist - Helping transform manufacturing and HP's business with adoption.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Gary Hang",
    slug: "gary-hang",
    firstName: "Gary",
    lastName: "Hang",
    title: "Head of Channel Sales, Greater Asia",
    company: "hp",
    tone: "Inviting, straightforward, channel-oriented",
    frequentlyUsedWords: "ai; channel; community; hp; hybrid-2; poly; amplify-impact; ecosystem",
    executivePositioning:
      "Channel Partner Advocate - Optimize the channel partner network. Sales Enabler - Advancing cross-sell opportunities. Hyperlocal Leader - Providing real-time insights on the ground with partners.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Grad Rosenbaum",
    slug: "grad-rosenbaum",
    firstName: "Grad",
    lastName: "Rosenbaum",
    title: "Vice President and General Manager, WW Managed Services Center of Excellence",
    company: "hp",
    tone: "Casual girl dad",
    frequentlyUsedWords: "girldad; grad-itude-for-services",
    executivePositioning:
      "Customer Service Evangelist - Providing quantifiable value to customers. Enthusiastic Mentor - Educating those new in their career on navigating the career ladder. Empathetic Colleague - Highlighting the life in work-life balance.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Grant Hoffman",
    slug: "grant-hoffman",
    firstName: "Grant",
    lastName: "Hoffman",
    title: "Senior Vice President and General Manager of HP Renew Solutions",
    company: "hp",
    tone: "Professional and energized",
    frequentlyUsedWords: "sustainability; hp-solutions; renew; circularity",
    executivePositioning:
      "Renew Solutions Team Wins. Leadership Spotlights. Digital Equity - Digital Equity is a major aspect to HP's Sustainable Impact.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Guayente Sanmartin",
    slug: "guayente-sanmartin",
    firstName: "Guayente",
    lastName: "Sanmartin",
    title: "SVP and Division President of Commercial Systems & Displays Solutions at HP",
    company: "hp",
    tone: "Excited, energetic and positive",
    frequentlyUsedWords: "ai-2; innovation; women-in-tech; thrilled; women-in-stem; future-of-work; game-changing",
    executivePositioning:
      "Future of AI Enthusiast - Guayente shares insights on how AI is revolutionizing the tech industry. Women in Tech Evangelist - Spotlighting influential women at HP and across the tech industry. Behind-the-Scenes Leader - Guayente features glimpses into HP events and product launches.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Haim Levit",
    slug: "haim-levit",
    firstName: "Haim",
    lastName: "Levit",
    title: "Senior Vice President & Division President, HP Industrial Print Organization",
    company: "hp",
    tone: "Professional and Excited",
    frequentlyUsedWords: "sustainability; revolutionized; applications; vision; game-changing-2",
    executivePositioning:
      "Partner First Mindset. Employee Engagement. Industry Trends. Product Solutions.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Helen Sheirbon",
    slug: "helen-sheirbon",
    firstName: "Helen",
    lastName: "Sheirbon",
    title: "SVP and Division President of Hybrid Systems",
    company: "hp",
    tone: "Energized and to the point",
    frequentlyUsedWords: "hybrid; poly; workplace-collaboration; sustainability; hp",
    executivePositioning:
      "Championing the Future of Collaboration - Revolutionizing Collaboration. Reinventing the as-a-service Mode - Visionary Leadership for HP's Future. Advocating for Sustainable Impact & DEI - Advocacy for Sustainability in Hybrid Systems.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Jean Kozub",
    slug: "jean-kozub",
    firstName: "Jean",
    lastName: "Kozub",
    title: "VP & GM │ Personal Systems & Services at HP",
    company: "hp",
    tone: "Customer focused",
    frequentlyUsedWords: "hp; hybrid-2; innovative; oneteamonegoal; customerdelight; ai-2; partner-soccess; transformative-impact; community; industry-leader",
    executivePositioning:
      "Trusted Transformational Leader - Genuine and active leadership. Innovative Sales Strategy & Market Trailblazer - Leveraging insights and data. Future-Forward Visionary - Shaping the future of work.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Joe Pacula",
    slug: "joe-pacula",
    firstName: "Joe",
    lastName: "Pacula",
    title: "SVP and Division President, Print Supplies",
    company: "hp",
    tone: "Casual & Enthusiastic",
    frequentlyUsedWords: "print; power-of-print",
    executivePositioning:
      "Sustainability Champion - Supporting sustainability for customers and partners. Customer-Centricity Evangelist - Customer relationships driving print solutions. Approachable Leader - Showcasing HP Print wins and the team behind it all.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "John Gordon",
    slug: "john-gordon",
    firstName: "John",
    lastName: "Gordon",
    title: "SVP and President, HP Managed Solutions",
    company: "hp",
    tone: "Personable & Excited",
    frequentlyUsedWords: "managed-solutions; hybrid-work; future-of-work; it; hp-solutions",
    executivePositioning:
      "Future of Work Visionary - Discuss how HP Workforce Solutions is committed to delivering simple and flexible outcomes. Business Transformation Veteran - Leveraging a unique Fortune 100 perspective. Team Empowerment Evangelist - Building a next generation workforce.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Juan Manuel Campos",
    slug: "juan-manuel-campos",
    firstName: "Juan Manuel",
    lastName: "Campos",
    title: "HP Peru MD",
    company: "hp",
    tone: "Results-oriented, strategic",
    frequentlyUsedWords: "futureready; ai; amplify-impact; partners",
    executivePositioning:
      "Customer Growth Expert - Providing real-time insights at ground zero in Peru. Equity Activist - Educating LATAM on the digital divide. Transformative Leader - Helping transform HP's business with the right mindset.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Kobi Elbaz",
    slug: "kobi-elbaz-646a3920",
    firstName: "Kobi",
    lastName: "Elbaz",
    title: "SVP & General Manager, Global Revenue Operations",
    company: "hp",
    tone: "Serious & inspiring; concise, blunt & punchy language",
    frequentlyUsedWords: "ai; amplify-impact; future-of-work; partners",
    executivePositioning: "",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Kong Meng Koh",
    slug: "kong-meng-koh",
    firstName: "Kong Meng",
    lastName: "Koh",
    title: "MD for South East Asia and HP Singapore (Private)",
    company: "hp",
    tone: "Lyrical, united, rich descriptions",
    frequentlyUsedWords: "ai; innovation; future-of-work; futureready",
    executivePositioning:
      "Catalyst for the Future of Work - Amplifying value beyond the echo chamber. Sales-Driven Officer - Measuring sales and success. Authentic Partnership Advocate - Focused and purposeful messaging.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Mateo Figueroa",
    slug: "mateo-figueroa",
    firstName: "Mateo",
    lastName: "Figueroa",
    title: "SVP & MD of Latin America",
    company: "hp",
    tone: "Direct, to-the-point, visionary, informed, well-rounded, transparent",
    frequentlyUsedWords: "ai-2; channel; hybrid-2; future-of-work; futureready; digital-equity; ecosystem; innovation; edge",
    executivePositioning:
      "Transformation Visionary - Empowering communities through technology. Authentic Trusted Leader - Building lasting relationships through value. Future Ready Creator - Pioneering hybrid innovation.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Noam Zilbershtain",
    slug: "noam-zilbershtain",
    firstName: "Noam",
    lastName: "Zilbershtain",
    title: "VP & General Manager of HP Indigo",
    company: "hp",
    tone: "Professional and self congratulatory",
    frequentlyUsedWords: "indigo; hp-indigo",
    executivePositioning:
      "What HP Is Doing Through Technology - Becoming a digital company. What Indigo Is Exploring to Drive the Business - Creating an infrastructure of tools to connect with people. What Drives the People - Cultivating the feeling of family.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Paul Gracey",
    slug: "paul-gracey",
    firstName: "Paul",
    lastName: "Gracey",
    title: "Head of Print, Greater Asia",
    company: "hp",
    tone: "Conversation-like, relatable",
    frequentlyUsedWords: "print; ai",
    executivePositioning:
      "Trusted Change Agent - Business from every angle. Hyperlocal Business Ambassador - Navigating a diverse tapestry. Tech Evangelist - Expanding the scope of Print solutions.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Ricardo Kamel",
    slug: "ricardo-kamel",
    firstName: "Ricardo",
    lastName: "Kamel",
    title: "HP Brazil MD",
    company: "hp",
    tone: "Straightforward, united",
    frequentlyUsedWords: "ai; partners; community; digital-equity; edge; future-of-work; excited; innovation",
    executivePositioning:
      "Customer-Focused Visionary - Educating Brazil on cyber security risks. Sustainability Advocate - Leading conversations around climate action. Transformative Global Leader - Leveraging known voices to spread HP's message.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Samir Shah",
    slug: "samir-shah",
    firstName: "Samir",
    lastName: "Shah",
    title: "Head of Personal Systems, Greater Asia",
    company: "hp",
    tone: "",
    frequentlyUsedWords: "hybrid-work; poly; ai; community; future-of-work; hp; workforce-solutions",
    executivePositioning:
      "Growth Navigator - PS is setting the stage for Greater Asia. Unlocking the Human Potential - Reflecting power inside and out. Market Solutions Pioneer - Gaining an unfair share.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Sandra Hinestroza",
    slug: "sandra-hinestroza",
    firstName: "Sandra",
    lastName: "Hinestroza",
    title: "HP Colombia MD",
    company: "hp",
    tone: "Welcoming, inclusive, warm, informational",
    frequentlyUsedWords: "ai; community; digital-equity; excited; hp; women-in-tech; hybrid-2",
    executivePositioning:
      "Dedicated Employee Counselor - Amplify and elevate voices. Passionate Partner Advocate - Trailblazing solutions to empower and elevate the Colombia market. Driven Climate & Equity Champion - Building a brighter future by healing the planet.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Sandy Waller",
    slug: "sandy-waller",
    firstName: "Sandy",
    lastName: "Waller",
    title: "Vice President of US Print & Supplies Sales",
    company: "hp",
    tone: "Upbeat, casual, not opposed to emojis, optimistic, likes talking about management opportunities with her team",
    frequentlyUsedWords: "",
    executivePositioning:
      "Finger on Pulse of Commercial Print Trends. Looking Toward the Future: Services & Solutions. Deep-Rooted Perspective in the HP Way.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Savi Baveja",
    slug: "savi-baveja",
    firstName: "Savi",
    lastName: "Baveja",
    title: "President of Personalization and 3D Printing and Chief Incubation Officer",
    company: "hp",
    tone: "Professional and smart",
    frequentlyUsedWords: "3d-printing; innovative; technology; excited; innovation",
    executivePositioning:
      "Scale through P3D's Ecosystem of Partners and Customer. Accelerating Application Adoption. Additive Manufacturing Transformation. Innovation for Growth.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Stacy Wolff",
    slug: "stacy-wolff",
    firstName: "Stacy",
    lastName: "Wolff",
    title: "Senior Vice President of Design and Sustainability",
    company: "hp",
    tone: "casual, passionate and creative. likes to romanticize the design process",
    frequentlyUsedWords: "design; innovation; sustainability; hybrid-2; ai; reimagining-processes; virgin-materials; creativity",
    executivePositioning:
      "Design Pioneer. Sustainability Ambassador. Innovation Catalyst.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Sue Richards (Kelly)",
    slug: "sue-richards-kelly",
    firstName: "Sue",
    lastName: "Richards",
    title: "Division President and General Manager of Home Printing",
    company: "hp",
    tone: "Casual and focused on social issues",
    frequentlyUsedWords: "ai; women-in-tech; innovative-spirit; women-in-stem",
    executivePositioning: "N/A",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Todd Gustafson",
    slug: "todd-gustafson-2",
    firstName: "Todd",
    lastName: "Gustafson",
    title: "President & Head, Public Sector, HP Fed",
    company: "hp",
    tone: "Lengthier posts. Keep high level for customers and partners (HP-related). Personal moments tend to be lengthier",
    frequentlyUsedWords: "futureready; ai-2; hp; futureofwork; hybrid-work; partners; hp-solutions; navy",
    executivePositioning:
      "HP Public Sector Ambassador - Driving the mission of an all-American company. Global Altruist - Prioritizing better educational outcomes. Values-Driven Role Model - Providing advice with a perspective that's 35 years deep at HP.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Tommy Gardner",
    slug: "tommy-gardner",
    firstName: "Tommy",
    lastName: "Gardner",
    title: "Chief Technology Officer",
    company: "hp",
    tone: "Precise, knowledgeable, confident, analytical and anecdotal",
    frequentlyUsedWords: "ai-2; hp; navy",
    executivePositioning:
      "Trusted Advisor - A CTO's voice for HP that turns insights into trust. Future-Forward Engineer - Practically applying his Navy background. Committed Educator - Preparing the next generation workforce.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Tuan Tran",
    slug: "tuan-tran",
    firstName: "Tuan",
    lastName: "Tran",
    title: "President of Technology & Innovation Organization at HP",
    company: "hp",
    tone: "Concise & Professional",
    frequentlyUsedWords: "ai-2; future-of-work; game-changing; innovation; vision; industry-leader",
    executivePositioning:
      "Future of Work Visionary - Tuan leads out on the narrative that flexible work and the rise of AI are dramatically evolving. AI Expert - Tuan leads a dynamic new HP team focused on shaping the company's technology strategy. Tech Landscape Leader - Tuan is committed to helping solve customer problems.",
    otherNotes: "",
    status: "Active",
  },
  {
    name: "Vinay Awasthi",
    slug: "vinay-awasthi",
    firstName: "Vinay",
    lastName: "Awasthi",
    title: "SVP & MD Greater Asia",
    company: "hp",
    tone: "Direct, intricate, results-oriented, driven",
    frequentlyUsedWords: "ai; channel; crn; ecosystem; future-of-work; hp",
    executivePositioning:
      "Leveled Communicator - Chief Motivating Officer. Opportunity Strategist - Driving innovation through the edge. Change Architect - Redefining growth markets at HP.",
    otherNotes: "",
    status: "Active",
  },
];

/**
 * Get executive by slug
 */
export function getExecutiveBySlug(slug: string): Executive | undefined {
  return EXECUTIVES.find((exec) => exec.slug === slug);
}

/**
 * Get all active executives
 */
export function getActiveExecutives(): Executive[] {
  return EXECUTIVES.filter((exec) => exec.status === "Active");
}
