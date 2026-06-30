/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  TRAINEE = "Trainee",
  TRAINER = "Trainer",
  ADMIN = "Admin",
}

export interface UserFitnessData {
  weight: number; // in kg
  bodyFat: number; // in %
  muscleMass: number; // in kg
  history: { date: string; weight: number; bodyFat: number; muscleMass: number }[];
  goals: string[];
  achievements: { id: string; title: string; description: string; date: string; icon: string }[];
}

export interface TraineeProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  fitnessData: UserFitnessData;
  subscriptions: string[]; // trainer IDs
  savedPosts: string[]; // post IDs
  coachingHistory: string[]; // question IDs
  languages: string[];
  theme: "dark" | "light";
}

export interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  specialty: string;
  country: string;
  languages: string[];
  rating: number;
  subscribersCount: number;
  monthlyPrice: number;
  verified: boolean;
  verificationStatus: "unsubmitted" | "pending" | "verified" | "rejected";
  certificates: { name: string; url: string; date: string }[];
  revenue: {
    total: number;
    subscriptions: number;
    tips: number;
    platformCut: number; // 20%
    trainerEarnings: number; // 80%
    history: { month: string; amount: number }[];
  };
  subscribers: { id: string; name: string; email: string; activeSince: string; plan: string }[];
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  date: string;
  originalLanguage?: string;
  translations?: Record<string, string>;
}

export interface Post {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  title: string;
  content: string;
  mediaType: "image" | "video" | "carousel" | "text";
  mediaUrls?: string[];
  type: "public" | "premium";
  likesCount: number;
  viewsCount: number;
  comments: Comment[];
  date: string;
  originalLanguage: string;
  translations: Record<string, string>;
  isLiked?: boolean;
  isSaved?: boolean;
  isReported?: boolean;
  reportReason?: string;
}

export interface Short {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  videoUrl: string;
  description: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  type: "question" | "flex" | "achievement" | "discussion";
  title: string;
  content: string;
  mediaUrl?: string;
  likesCount: number;
  comments: Comment[];
  date: string;
  isLiked?: boolean;
  originalLanguage: string;
  translations: Record<string, string>;
}

export interface CoachingQuestion {
  id: string;
  traineeId: string;
  traineeName: string;
  traineeAvatar: string;
  trainerId: string;
  trainerName: string;
  title: string;
  text: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
  status: "pending" | "replied" | "coached" | "completed" | "archived";
  trainerReplyText?: string;
  followUpText?: string;
  finalResponseText?: string;
  date: string;
  replyDate?: string;
  feedbackImage?: string; // For exercise posture annotation if desired
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  isTyping?: boolean;
  attachmentUrl?: string;
  attachmentType?: "image" | "video" | "document";
  originalLanguage?: string;
  translations?: Record<string, string>;
}

export interface Notification {
  id: string;
  type: "subscriber" | "coaching" | "reply" | "tip" | "payment" | "report";
  title: string;
  message: string;
  date: string;
  read: boolean;
}
