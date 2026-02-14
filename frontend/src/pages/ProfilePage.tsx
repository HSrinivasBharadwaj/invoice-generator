import { useUser } from '@/features/user/hooks/useUser';
import ProfileForm from '@/features/user/components/ProfileForm';
import ChangePasswordForm from '@/features/user/components/ChangePasswordForm';
import type { UpdateProfileData, ChangePasswordData } from '@/features/user/api/userApi';

const ProfilePage = () => {
  const { user, isLoading, updateProfile, changePassword, isUpdatingProfile, isChangingPassword } =
    useUser();

  const handleProfileUpdate = (data: UpdateProfileData) => {
    updateProfile(data);
  };

  const handlePasswordChange = (data: ChangePasswordData) => {
    changePassword(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-red-500">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileForm user={user} onSubmit={handleProfileUpdate} isLoading={isUpdatingProfile} />
        <ChangePasswordForm onSubmit={handlePasswordChange} isLoading={isChangingPassword} />
      </div>
    </div>
  );
};

export default ProfilePage;