import { api } from '@/lib/axios';
import type { Client } from '@/types';

export interface CreateClientData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxNumber?: string;
  notes?: string;
}

export interface UpdateClientData extends Partial<CreateClientData> {}

export const clientsApi = {
  // Get all clients
  getClients: async (): Promise<{ clients: Client[]; total: number }> => {
    const response = await api.get('/clients');
    return response.data;
  },

  // Get single client
  getClient: async (id: string): Promise<{ client: Client }> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  // Create client
  createClient: async (data: CreateClientData): Promise<{ client: Client }> => {
    const response = await api.post('/clients', data);
    return response.data;
  },

  // Update client
  updateClient: async (id: string, data: UpdateClientData): Promise<{ client: Client }> => {
    const response = await api.put(`/clients/${id}`, data);
    return response.data;
  },

  // Delete client
  deleteClient: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};