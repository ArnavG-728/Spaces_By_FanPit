const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001/api'

export type Space = {
  _id?: string
  name: string
  description: string
  pricePerHour: number
  capacity: number
  amenities: string[]
  createdAt?: string
  updatedAt?: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const res = await fetch(`${API_BASE}${path}` as string, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  listSpaces: () => request<Space[]>('/spaces'),
  getSpace: (id: string) => request<Space>(`/spaces/${id}`),
  createSpace: (payload: Omit<Space, '_id' | 'createdAt' | 'updatedAt'>) =>
    request<Space>('/spaces', { method: 'POST', body: JSON.stringify(payload) }),
  updateSpace: (id: string, payload: Partial<Space>) =>
    request<Space>(`/spaces/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  deleteSpace: (id: string) => request<{ deleted: true }>(`/spaces/${id}`, { method: 'DELETE' }),
}
