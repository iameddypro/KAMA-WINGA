
export type VerificationTier = 'blue' | 'gold' | 'diamond' | undefined;
export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'suspended';
export type Language = 'sw' | 'en' | 'ko' | 'zh' | 'fr' | 'de' | 'pt' | 'tw' | 'ru';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  password?: string;
  dob?: string;
  verificationTier?: VerificationTier;
  username?: string;
  bio?: string;
  location?: string;
  phoneNumber?: string;
  followers: number;
  following: number;
  role?: UserRole;
  status?: UserStatus;
  joinedDate?: string;
  blockedUsers: string[]; // List of user IDs blocked by this user
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  timestamp: string;
  isSolution?: boolean;
}

export interface Post {
  id: string;
  author: User;
  image?: string;
  video?: string;
  title: string;
  description: string;
  location: string;
  tags: string[];
  likes: number;
  reposts: number;
  crushes: number;
  comments: Comment[];
  timestamp: string;
  status: 'open' | 'found';
}

export interface Meme {
  id: string;
  author: User;
  videoUrl: string;
  thumbnail?: string;
  caption: string;
  likes: number;
  shares: number;
  comments: number;
}

export interface Report {
  id: string;
  postId?: string;
  reportedUserId: string;
  reporterId: string;
  reason: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
  // Hydrated data for UI
  postTitle?: string;
  postImage?: string;
  reportedUserName?: string;
}

export enum ViewState {
  FEED = 'FEED',
  CREATE = 'CREATE',
  PROFILE = 'PROFILE',
  DETAIL = 'DETAIL',
  EDIT_PROFILE = 'EDIT_PROFILE',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  MEMES = 'MEMES',
  USER_PROFILE = 'USER_PROFILE',
  SEARCH = 'SEARCH'
}

export interface AIAnalysisResult {
  title: string;
  category: string;
  tags: string[];
  suggestedLocations: string[];
}