import { api } from '@/lib/axios';
import type { User } from '@/types';

export interface UpdateProfileData {
  name?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  logoUrl?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userApi = {
  // Get user profile
  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<{ user: User }> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await api.put('/users/password', data);
    return response.data;
  },
};