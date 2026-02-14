import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi, type UpdateProfileData, type ChangePasswordData } from '../api/userApi';
import { toast } from 'sonner';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';

export const useUser = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  // Get profile
  const { data, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: userApi.getProfile,
  });

  // Update profile
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => userApi.updateProfile(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      dispatch(setUser(response.user));
      toast.success('Profile updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update profile';
      toast.error(message);
    },
  });

  // Change password
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordData) => userApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to change password';
      toast.error(message);
    },
  });

  return {
    user: data?.user,
    isLoading,
    updateProfile: updateProfileMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
  };
};