import type { ConsultationRequest, ChatMessage } from '../types/designer';
import { generateAlternativeLayouts } from '../services/layoutGenerator';
import { SAMPLE_PROJECTS, SAMPLE_ROOM_FURNITURE } from './sampleProjects';

const sampleRoom = SAMPLE_PROJECTS[0].rooms[0];
const sampleFurniture = SAMPLE_ROOM_FURNITURE[sampleRoom.id] || [];

const samplePermutations = generateAlternativeLayouts(
  sampleRoom.dimensions,
  sampleRoom.doors,
  sampleRoom.windows,
  sampleRoom.obstacles,
  sampleFurniture
);

export const SAMPLE_CONSULTATION: ConsultationRequest = {
  id: 'consult-alexander-ethan-1',
  userId: 'user-alexander',
  userName: 'Alexander Wright',
  userEmail: 'alexander.wright@aera.design',
  designerId: 'des-ethan-rodrigues',
  projectId: 'proj-2bhk-alexander',
  projectName: 'My 2BHK Apartment (Master Bedroom 12×14 ft)',
  roomId: 'room-master-bed',
  roomName: 'Master Bedroom',
  status: 'accepted',
  message: 'Seeking advice on wardrobe clearances and optimal desk positioning.',
  createdAt: '2 hours ago',
  topic: 'Wardrobe Clearance & Circulation Optimization',
};

export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    consultationId: 'consult-alexander-ethan-1',
    senderId: 'user-alexander',
    senderName: 'Alexander Wright',
    senderRole: 'user',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    timestamp: '10:30 AM',
    text: 'Hi Ethan! I shared my Master Bedroom blueprint. We want to place an 8ft wardrobe, but AERA gave us a ⚠️ Dimension Warning saying the central walking aisle drops to 48 cm.',
  },
  {
    id: 'msg-2',
    consultationId: 'consult-alexander-ethan-1',
    senderId: 'des-ethan-rodrigues',
    senderName: 'Ethan Rodrigues',
    senderRole: 'designer',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    timestamp: '10:38 AM',
    text: 'Hi Alexander! I inspected your 12×14 ft floor plan. The issue is that the wardrobe was positioned perpendicular to the door swing path. I adjusted the layout by rotating the wardrobe 90° along the solid north alcove. This restores a full 92 cm circulation corridor without blocking natural daylight.',
    layoutAttachment: {
      layoutId: samplePermutations[0]?.id || 'layout-rev-ethan-1',
      title: 'Architectural Revision (92 cm Corridor)',
      score: 91,
      description: 'Wardrobe shifted to north wall; Queen bed centered on structural axis with dual 2ft nightstands.',
      applied: false,
      layoutData: samplePermutations[0],
    },
  },
  {
    id: 'msg-3',
    consultationId: 'consult-alexander-ethan-1',
    senderId: 'des-ethan-rodrigues',
    senderName: 'Ethan Rodrigues',
    senderRole: 'designer',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    timestamp: '10:40 AM',
    text: 'Click "Apply Revision to Blueprint" on the card above to immediately update your 2D CAD and 3D studio scene!',
  },
];
