export type Candidate = {
  id: string;
  name: string;
  age: number;
  location: string;
  headline: string;
  photoTone: string;
  overall: number;
  categories: { label: string; value: number; tier: string }[];
  whyCompatible: string;
  discussPoints: string[];
  interests: string[];
};

export const candidates: Candidate[] = [
  {
    id: "maya-l",
    name: "Maya",
    age: 29,
    location: "Oakland, CA · 6 mi away",
    headline: "Product designer, weekend trail runner, terrible at board games",
    photoTone: "#8f3346",
    overall: 92,
    categories: [
      { label: "Relationship goals", value: 95, tier: "Excellent" },
      { label: "Values", value: 82, tier: "Strong" },
      { label: "Lifestyle", value: 90, tier: "Excellent" },
      { label: "Communication", value: 80, tier: "Strong" },
      { label: "Interests", value: 68, tier: "Good" },
    ],
    whyCompatible:
      "You both described wanting a partner before 35, value direct communication over conflict-avoidance, and independently mentioned wanting a slower, less city-centered life within five years.",
    discussPoints: [
      "Maya travels for work roughly one week a month — worth discussing how you'd handle time apart.",
      "You lean introverted; she recharges by being around people. Ask how she supports downtime.",
    ],
    interests: ["Trail running", "Ceramics", "Film photography"],
  },
  {
    id: "priya-k",
    name: "Priya",
    age: 31,
    location: "San Francisco, CA · 3 mi away",
    headline: "ICU nurse, plant parent, always down for a 6am hike",
    photoTone: "#c9a15a",
    overall: 87,
    categories: [
      { label: "Relationship goals", value: 88, tier: "Excellent" },
      { label: "Values", value: 90, tier: "Excellent" },
      { label: "Lifestyle", value: 74, tier: "Strong" },
      { label: "Communication", value: 85, tier: "Excellent" },
      { label: "Interests", value: 60, tier: "Good" },
    ],
    whyCompatible:
      "Strong overlap on caretaking values and how you each define emotional maturity. Her shift schedule and your routine both prize structure over spontaneity.",
    discussPoints: [
      "Her rotating shifts mean evenings aren't always free — worth asking about her schedule pattern.",
      "She's not sure about kids yet; you are. Good to raise early.",
    ],
    interests: ["Hiking", "Houseplants", "Cooking"],
  },
  {
    id: "elena-r",
    name: "Elena",
    age: 28,
    location: "Berkeley, CA · 9 mi away",
    headline: "PhD candidate in oceanography, plays bass, bad at texting back",
    photoTone: "#5c5766",
    overall: 79,
    categories: [
      { label: "Relationship goals", value: 70, tier: "Good" },
      { label: "Values", value: 84, tier: "Strong" },
      { label: "Lifestyle", value: 76, tier: "Strong" },
      { label: "Communication", value: 65, tier: "Good" },
      { label: "Interests", value: 88, tier: "Excellent" },
    ],
    whyCompatible:
      "Shared intellectual curiosity and near-identical taste in how you spend a Saturday. Communication styles differ — she prefers longer, less frequent check-ins.",
    discussPoints: [
      "She's two years from finishing her PhD and open to relocating after — worth understanding her timeline.",
      "You said quick replies matter to you; she's upfront that she's slow to text.",
    ],
    interests: ["Marine biology", "Live music", "Rock climbing"],
  },
];

export type Message = {
  id: string;
  from: "them" | "me" | "ai";
  text: string;
  time: string;
};

export type Conversation = {
  candidateId: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    candidateId: "maya-l",
    lastMessage: "Ha, I've genuinely never won a single round of Catan",
    lastTime: "2:14 PM",
    unread: 2,
    messages: [
      { id: "1", from: "me", text: "Okay the ceramics thing — self-taught or classes?", time: "1:52 PM" },
      { id: "2", from: "them", text: "Started with a community studio two years ago, now I'm mildly obsessed", time: "1:58 PM" },
      { id: "3", from: "them", text: "Ha, I've genuinely never won a single round of Catan", time: "2:14 PM" },
    ],
  },
  {
    candidateId: "priya-k",
    lastMessage: "Sounds good — Sunday morning works well for me",
    lastTime: "Yesterday",
    unread: 0,
    messages: [
      { id: "1", from: "me", text: "Would a sunrise hike be too ambitious for a first date?", time: "Yesterday" },
      { id: "2", from: "them", text: "Sounds good — Sunday morning works well for me", time: "Yesterday" },
    ],
  },
];

export type ProfileData = {
  name: string;
  age: number;
  location: string;
  bio: string;
  relationshipGoals: string;
  values: string[];
  dealBreakers: string[];
  interests: string[];
};

export const myProfile: ProfileData = {
  name: "Jordan",
  age: 30,
  location: "San Francisco, CA",
  bio: "Backend engineer who spends too much money on coffee equipment. Looking for someone to build a life with, not just fill a weekend.",
  relationshipGoals: "Long-term, open to marriage and kids within a few years",
  values: ["Emotional honesty", "Financial stability", "Family closeness"],
  dealBreakers: ["Doesn't want kids", "Smoking"],
  interests: ["Coffee", "Cycling", "Sci-fi novels", "Cooking"],
};

export type Course = {
  id: string;
  title: string;
  description: string;
  topic: string;
  priceCents: number;
  coachName: string;
  coachHeadline: string;
  thumbnailTone: string;
  lessonCount: number;
};

export const courses: Course[] = [
  {
    id: "confidence-foundations",
    title: "Confidence Foundations",
    description:
      "A practical, no-fluff course on building real dating confidence — not scripts or tricks, just the mindset and habits that make you naturally more at ease.",
    topic: "Confidence",
    priceCents: 4900,
    coachName: "Renee Ashford",
    coachHeadline: "Dating coach, 8 years, former matchmaker",
    thumbnailTone: "#8f3346",
    lessonCount: 6,
  },
  {
    id: "age-gap-dating-older-women",
    title: "Dating Older Women: What Actually Works",
    description:
      "For younger men interested in dating older women — communication styles, common misconceptions, and how to show up as an equal, not a project.",
    topic: "Age-gap dating",
    priceCents: 5900,
    coachName: "Marcus Webb",
    coachHeadline: "Relationship coach specializing in age-gap dynamics",
    thumbnailTone: "#c9a15a",
    lessonCount: 5,
  },
  {
    id: "texting-that-works",
    title: "Texting That Actually Gets Replies",
    description:
      "The difference between texts that die in the group chat and texts that lead somewhere — pacing, tone, and reading real interest vs. politeness.",
    topic: "Communication",
    priceCents: 3900,
    coachName: "Priya Chandran",
    coachHeadline: "Communication coach, former dating app product lead",
    thumbnailTone: "#5c5766",
    lessonCount: 4,
  },
  {
    id: "recovering-from-rejection",
    title: "Recovering From Rejection & Getting Back Out There",
    description:
      "A short course for the period after a breakup or a string of rejections — how to process it honestly and re-enter dating without carrying resentment.",
    topic: "Mindset",
    priceCents: 2900,
    coachName: "Renee Ashford",
    coachHeadline: "Dating coach, 8 years, former matchmaker",
    thumbnailTone: "#8f3346",
    lessonCount: 4,
  },
];

export type CoachProfile = {
  userId: string;
  name: string;
  headline: string;
  bio: string;
  status: "pending" | "approved" | "rejected";
};

export const myCoachApplication: CoachProfile | null = null;
