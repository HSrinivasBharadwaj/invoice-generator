import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { User } from '@/types';
import type { UpdateProfileData } from '../api/userApi';

const profileSchema = z.object({
  name: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  logoUrl: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: User;
  onSubmit: (data: UpdateProfileData) => void;
  isLoading: boolean;
}

const ProfileForm = ({ user, onSubmit, isLoading }: ProfileFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name || '',
      companyName: user.companyName || '',
      companyAddress: user.companyAddress || '',
      companyPhone: user.companyPhone || '',
      logoUrl: user.logoUrl || '',
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal and company information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email (Cannot be changed)</Label>
            <Input id="email" value={user.email} disabled className="bg-gray-50" />
            <p className="text-xs text-gray-500">
              Your email is permanent and cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" {...register('name')} placeholder="John Doe" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input id="companyName" {...register('companyName')} placeholder="Acme Corp" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyPhone">Company Phone</Label>
            <Input id="companyPhone" {...register('companyPhone')} placeholder="+1 555 0123" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyAddress">Company Address</Label>
            <Input
              id="companyAddress"
              {...register('companyAddress')}
              placeholder="123 Business St, City, State"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              {...register('logoUrl')}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-xs text-gray-500">
              Enter a URL to your company logo (optional)
            </p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;