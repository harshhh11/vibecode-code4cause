const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const aeraApi = {
  // Health
  checkHealth: () => request<{ status: string; platform: string }>('/health'),

  // Projects
  getProjects: () => request<{ success: boolean; data: any[] }>('/projects'),
  getProject: (id: string) => request<{ success: boolean; data: { project: any; furniture: any } }>(`/projects/${id}`),
  createProject: (data: any) => request<{ success: boolean; projectId: string }>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Furniture CRUD
  addFurniture: (projectId: string, roomId: string, data: any) =>
    request<{ success: boolean; itemId: string }>(`/projects/${projectId}/rooms/${roomId}/furniture`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFurniture: (projectId: string, roomId: string, furnitureId: string, data: any) =>
    request<{ success: boolean }>(`/projects/${projectId}/rooms/${roomId}/furniture/${furnitureId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFurniture: (projectId: string, roomId: string, furnitureId: string) =>
    request<{ success: boolean }>(`/projects/${projectId}/rooms/${roomId}/furniture/${furnitureId}`, {
      method: 'DELETE',
    }),

  // AI Intelligence
  getWholeHomeDistribution: (totalAreaSqFt: number, configType: string) =>
    request<{ success: boolean; data: any }>('/ai/whole-home-distribution', {
      method: 'POST',
      body: JSON.stringify({ totalAreaSqFt, configType }),
    }),
  getRoomDimensions: (roomType: string, totalAreaSqFt: number) =>
    request<{ success: boolean; data: any }>('/ai/room-dimensions', {
      method: 'POST',
      body: JSON.stringify({ roomType, totalAreaSqFt }),
    }),
  checkFurnitureCompatibility: (data: any) =>
    request<{ success: boolean; data: any }>('/ai/furniture-check', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  scoreLayout: (data: any) =>
    request<{ success: boolean; data: any }>('/ai/score-layout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  generateLayouts: (data: any) =>
    request<{ success: boolean; data: any[] }>('/ai/generate-layouts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  assistantChat: (data: { message: string; roomName?: string; length?: number; width?: number; currentScore?: number }) =>
    request<{ success: boolean; data: { reply: string; suggestions: any[] } }>('/ai/assistant-chat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Designers & Consultations
  getDesigners: (params?: { style?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<{ success: boolean; data: any[] }>(`/designers${query ? `?${query}` : ''}`);
  },
  getDesigner: (id: string) => request<{ success: boolean; data: any }>(`/designers/${id}`),
  createConsultation: (data: any) => request<{ success: boolean; consultationId: string }>('/designers/consultations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Chat & Messages
  getMessages: (consultationId: string) =>
    request<{ success: boolean; data: any[] }>(`/chat/${consultationId}/messages`),
  sendMessage: (consultationId: string, data: any) =>
    request<{ success: boolean; messageId: string }>(`/chat/${consultationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Catalogs & Export
  getFurnitureCatalog: () => request<{ success: boolean; data: any[] }>('/catalog/furniture'),
  getColorThemes: () => request<{ success: boolean; data: any[] }>('/catalog/themes'),
  exportSpecSheet: (data: any) =>
    request<{ success: boolean; data: any }>('/catalog/export/spec-sheet', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
