import { Request, Response } from 'express';
import { db } from '../db/database.js';
import { v4 as uuidv4 } from 'uuid';
import type { ChatMessage } from '../types/designer.js';

export async function getConsultationMessages(req: Request, res: Response): Promise<void> {
  try {
    const consultationId = String(req.params.consultationId);
    const raw = await db.messages.findByConsultation(consultationId);

    const messages: ChatMessage[] = raw.map((m: any) => ({
      id: m.id,
      consultationId: m.consultation_id,
      senderId: m.sender_id,
      senderName: m.sender_name,
      senderRole: m.sender_role,
      senderAvatar: m.sender_avatar,
      timestamp: m.timestamp,
      text: m.text,
      layoutAttachment: m.layout_attachment || undefined,
    }));

    res.json({ success: true, count: messages.length, data: messages });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function sendMessage(req: Request, res: Response): Promise<void> {
  try {
    const consultationId = String(req.params.consultationId);
    const { senderId, senderName, senderRole, senderAvatar, text, layoutAttachment } = req.body;
    const msgId = `msg-${uuidv4().substring(0, 8)}`;

    const newMsg = await db.messages.create({
      id: msgId,
      consultation_id: consultationId,
      sender_id: senderId || 'user-alexander',
      sender_name: senderName || 'Alexander Wright',
      senderRole: senderRole || 'user',
      senderAvatar: senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      timestamp: 'Just now',
      text,
      layout_attachment: layoutAttachment || null,
    });

    res.status(201).json({ success: true, messageId: msgId, data: newMsg, message: 'Message delivered.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function applyRevision(req: Request, res: Response): Promise<void> {
  try {
    const { messageId } = req.body;
    res.json({ success: true, message: `Revision from ${messageId} applied to project blueprint.` });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
