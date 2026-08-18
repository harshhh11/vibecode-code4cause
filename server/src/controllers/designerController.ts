import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';
import type { DesignerProfile } from '../types/designer.js';

export async function getAllDesigners(req: Request, res: Response): Promise<void> {
  try {
    const { style, search } = req.query;
    const raw = await db.designers.findMany();

    let designers: DesignerProfile[] = raw.map((d) => ({
      id: d.id,
      name: d.name,
      title: d.title,
      bio: d.bio,
      avatar: d.avatar,
      rating: d.rating,
      reviewsCount: d.reviews_count || 18,
      completedProjectsCount: d.completed_projects_count || 42,
      experienceYears: d.experience_years || 8,
      hourlyRate: d.hourly_rate || 120,
      ratePerSqFt: d.rate_per_sqft || 3.5,
      location: d.location || 'New York, NY',
      verified: Boolean(d.verified),
      responseTime: d.response_time || '< 2 hours',
      styles: d.styles || [],
      specialization: d.specialization || [],
      portfolio: d.portfolio || [],
      reviews: d.reviews || [],
    }));

    if (style && style !== 'all') {
      designers = designers.filter((d) => d.styles.includes(String(style)));
    }

    if (search) {
      const q = String(search).toLowerCase();
      designers = designers.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.specialization.some((s: string) => s.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, count: designers.length, data: designers });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getDesignerById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const d = await db.designers.findById(id);
    if (!d) {
      res.status(404).json({ success: false, error: 'Designer not found' });
      return;
    }

    const designer: DesignerProfile = {
      id: d.id,
      name: d.name,
      title: d.title,
      bio: d.bio,
      avatar: d.avatar,
      rating: d.rating,
      reviewsCount: d.reviews_count || 18,
      completedProjectsCount: d.completed_projects_count || 42,
      experienceYears: d.experience_years || 8,
      hourlyRate: d.hourly_rate || 120,
      ratePerSqFt: d.rate_per_sqft || 3.5,
      location: d.location || 'New York, NY',
      verified: Boolean(d.verified),
      responseTime: d.response_time || '< 2 hours',
      styles: d.styles || [],
      specialization: d.specialization || [],
      portfolio: d.portfolio || [],
      reviews: d.reviews || [],
    };

    res.json({ success: true, data: designer });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function createConsultation(req: Request, res: Response): Promise<void> {
  try {
    const { designerId, projectId, topic, budgetRange = '$2,000 - $5,000', userId = 'user-alexander' } = req.body;
    const consultationId = `consult-${uuidv4().substring(0, 8)}`;
    const now = new Date().toISOString().split('T')[0];

    const consult = await db.consultations.create({
      id: consultationId,
      user_id: userId,
      designer_id: designerId,
      project_id: projectId,
      topic: topic || 'Spatial Optimization & Clearance Review',
      status: 'active',
      budget_range: budgetRange,
      created_at: now,
    });

    res.status(201).json({ success: true, consultationId, data: consult, message: 'Consultation request sent to designer.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
