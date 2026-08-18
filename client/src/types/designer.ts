import type { GeneratedLayoutOption } from './layout';

export interface DesignerReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  date: string;
  comment: string;
  projectType: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  roomType: string;
  imageUrl: string;
  description: string;
}

export interface DesignerProfile {
  id: string;
  name: string;
  title: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  specialization: string[];
  styles: string[];
  ratePerSqFt: number;
  hourlyRate: number;
  bio: string;
  location: string;
  completedProjectsCount: number;
  responseTime: string;
  portfolio: PortfolioItem[];
  reviews: DesignerReview[];
}

export type ConsultationStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface ConsultationRequest {
  id: string;
  designerId: string;
  userId: string;
  userName: string;
  userEmail: string;
  projectId: string;
  projectName: string;
  roomId: string;
  roomName: string;
  topic: string;
  message: string;
  status: ConsultationStatus;
  createdAt: string;
  budgetRange?: string;
}

export interface ChatMessage {
  id: string;
  consultationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'designer' | 'aera_ai';
  senderAvatar: string;
  timestamp: string;
  text: string;
  
  // Attachments
  layoutAttachment?: {
    layoutId: string;
    title: string;
    score: number;
    description: string;
    applied: boolean;
    layoutData: GeneratedLayoutOption;
  };
  themeAttachment?: {
    themeId: string;
    themeName: string;
    paletteColors: string[];
  };
  viewpointAttachment?: {
    cameraAngle: 'isometric' | 'top' | 'walkthrough';
    note: string;
  };
}
