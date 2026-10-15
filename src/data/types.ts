export type FarmerId = "miho" | "takumi" | "masao";

export interface FarmerPhoto {
  src: string;
  alt: string;
  position: string;
}

export interface Farmer {
  id: FarmerId;
  name: string;
  age: number;
  region: string;
  crop: string;
  emoji: string;
  compatibility: number;
  tagline: string;
  bio: string;
  hobbies: string[];
  personality: string[];
  reason: string;
  surprise: string;
  photos: FarmerPhoto[];
  dailyCaption: string;
}

export interface ConversationQuestion {
  farmerId: FarmerId;
  questionId: string;
  userMessage: string;
  farmerResponse: string[];
  typingDelay: number;
  nextRecommendedQuestion: string;
  /** An eligible conversation turn. The UI unlocks the offer after two distinct questions. */
  offerUnlocked: boolean;
}

export interface Conversation {
  greeting: string[];
  questions: ConversationQuestion[];
  fallback: string;
  invitation: string;
}

export interface Product {
  id: string;
  title: string;
  shortTitle: string;
  subtitle: string;
  image: string;
  price: string;
  shipping: string;
  letter: string;
  cta: string;
}

export interface PreferenceOption {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  order: FarmerId[];
}
