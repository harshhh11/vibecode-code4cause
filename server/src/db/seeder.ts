import { db } from './database.js';
import { SAMPLE_PROJECTS, SAMPLE_ROOM_FURNITURE } from '../data/sampleProjects.js';
import { DESIGNERS_DATA } from '../data/designersData.js';
import { INITIAL_MESSAGES, SAMPLE_CONSULTATION } from '../data/sampleConversations.js';

export async function seedDatabaseIfEmpty() {
  const existingProjects = await db.projects.findMany();
  if (existingProjects && existingProjects.length > 0) {
    console.log('📦 Database already populated with', existingProjects.length, 'projects.');
    return;
  }

  console.log('🌱 Seeding database with architectural models and verified designers...');

  // 1. Seed Projects & Rooms & Furniture
  for (const proj of SAMPLE_PROJECTS) {
    await db.projects.create({
      id: proj.id,
      name: proj.name,
      description: proj.description,
      type: proj.type,
      total_area_sqft: proj.totalAreaSqFt,
      config_type: proj.configType || null,
      active_room_id: proj.activeRoomId,
      active_theme_id: proj.activeThemeId,
      layout_score: proj.layoutScore,
      versions: proj.versions || [],
      created_at: proj.createdAt,
      last_edited: proj.lastEdited,
    });

    for (const room of proj.rooms) {
      await db.rooms.create({
        id: room.id,
        project_id: proj.id,
        name: room.name,
        type: room.type,
        length_ft: room.dimensions.length,
        width_ft: room.dimensions.width,
        height_ft: room.dimensions.height,
        doors: room.doors || [],
        windows: room.windows || [],
        obstacles: room.obstacles || [],
        theme_id: room.themeId || null,
      });

      const items = SAMPLE_ROOM_FURNITURE[room.id] || [];
      for (const item of items) {
        await db.furniture.create({
          id: item.id,
          room_id: room.id,
          name: item.name,
          category: item.category,
          width_ft: item.width,
          depth_ft: item.depth,
          height_ft: item.height,
          pos_x: item.x,
          pos_y: item.y,
          rotation_deg: item.rotation,
          is_existing: item.isExisting ? 1 : 0,
          color: item.color || null,
          material: item.material || null,
          model_type: item.modelType,
        });
      }
    }
  }

  // 2. Seed Designers
  for (const des of DESIGNERS_DATA) {
    await db.designers.create({
      id: des.id,
      name: des.name,
      title: des.title,
      bio: des.bio,
      avatar: des.avatar,
      rating: des.rating,
      reviews_count: des.reviewsCount,
      experience_years: des.experienceYears,
      hourly_rate: des.hourlyRate,
      rate_per_sqft: des.ratePerSqFt,
      location: des.location,
      verified: des.verified ? 1 : 0,
      response_time: des.responseTime,
      styles: des.styles || [],
      specialization: des.specialization || [],
      portfolio: des.portfolio || [],
      reviews: des.reviews || [],
    });
  }

  // 3. Seed Consultation & Messages
  await db.consultations.create({
    id: SAMPLE_CONSULTATION.id,
    user_id: SAMPLE_CONSULTATION.userId,
    designer_id: SAMPLE_CONSULTATION.designerId,
    project_id: SAMPLE_CONSULTATION.projectId,
    topic: SAMPLE_CONSULTATION.topic,
    status: SAMPLE_CONSULTATION.status,
    budget_range: '$2,000 - $5,000',
    created_at: SAMPLE_CONSULTATION.createdAt,
  });

  for (const msg of INITIAL_MESSAGES) {
    await db.messages.create({
      id: msg.id,
      consultation_id: msg.consultationId,
      sender_id: msg.senderId,
      sender_name: msg.senderName,
      sender_role: msg.senderRole,
      sender_avatar: msg.senderAvatar,
      timestamp: msg.timestamp,
      text: msg.text,
      layout_attachment: msg.layoutAttachment || null,
    });
  }

  console.log('✅ AERA Database successfully seeded with architectural spaces and chat threads!');
}
