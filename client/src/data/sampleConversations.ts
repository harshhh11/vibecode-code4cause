import type { ConsultationRequest, ChatMessage } from '../types/designer';
import { generateAlternativeLayouts } from '../utils/layoutGenerator';
import { SAMPLE_ROOM_FURNITURE } from './sampleProjects';

const sampleLayoutOptions = generateAlternativeLayouts(
  { length: 14, width: 12, height: 10 },
  [{ id: 'd1', name: 'Entry Door', wall: 'south', offset: 2, width: 3.0, swing: 'inside_left' }],
  [{ id: 'w1', name: 'North Window', wall: 'north', offset: 4.5, width: 5.0, height: 5.0, sillHeight: 3.0 }],
  [],
  SAMPLE_ROOM_FURNITURE['room-master-bed'] || []
);

export const SAMPLE_CONSULTATION: ConsultationRequest = {
  id: 'consult-ethan-1',
  designerId: 'des-ethan-rodrigues',
  userId: 'user-alexander',
  userName: 'Alexander Wright',
  userEmail: 'alexander.wright@aera.design',
  projectId: 'proj-2bhk-alexander',
  projectName: 'My 2BHK Apartment',
  roomId: 'room-master-bed',
  roomName: 'Master Bedroom (12 × 14 ft)',
  topic: 'Wardrobe Clearance & Circulation Optimization',
  message: 'Hi Ethan, our current wardrobe setup feels cramped around the door swing. Looking for an optimal architectural layout before ordering millwork.',
  status: 'accepted',
  createdAt: 'Yesterday, 3:45 PM',
  budgetRange: '$2,000 - $5,000',
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    consultationId: 'consult-ethan-1',
    senderId: 'user-alexander',
    senderName: 'Alexander Wright',
    senderRole: 'user',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    timestamp: 'Yesterday at 3:45 PM',
    text: 'Hi Ethan! I shared my Master Bedroom project. We really like the Warm Minimal theme, but we noticed the walking path bottleneck between the door and the wardrobe.',
  },
  {
    id: 'msg-2',
    consultationId: 'consult-ethan-1',
    senderId: 'des-ethan-rodrigues',
    senderName: 'Ethan Rodrigues',
    senderRole: 'designer',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    timestamp: 'Yesterday at 4:10 PM',
    text: 'Hello Alexander! I reviewed your 2D floorplan and 3D walkthrough. You are right — the 4-door wardrobe was positioned directly in the door swing arc, dropping your walking clearance to ~48 cm.',
  },
  {
    id: 'msg-3',
    consultationId: 'consult-ethan-1',
    senderId: 'des-ethan-rodrigues',
    senderName: 'Ethan Rodrigues',
    senderRole: 'designer',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    timestamp: 'Yesterday at 4:15 PM',
    text: 'I have reworked the layout: I moved the wardrobe to the west wall with a 90° orientation, shifted the Queen bed center-aligned to the north wall, and placed your study table near the morning window. This raises your Layout Score from 76 to 91/100 and gives you a generous 92 cm walking clearance.',
    layoutAttachment: {
      layoutId: 'layout-opt-a',
      title: 'Ethan’s Optimized Layout A (91/100)',
      score: 91,
      description: 'Restores 92 cm central walking clearance, eliminates door collisions, and optimizes natural window daylight.',
      applied: false,
      layoutData: sampleLayoutOptions[0],
    },
  },
  {
    id: 'msg-4',
    consultationId: 'consult-ethan-1',
    senderId: 'user-alexander',
    senderName: 'Alexander Wright',
    senderRole: 'user',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    timestamp: 'Today at 9:30 AM',
    text: 'This looks so much better! The 3D render feels open and grounded. Applying this revision now.',
  },
];
