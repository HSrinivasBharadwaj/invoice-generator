import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientsApi, type CreateClientData, type UpdateClientData } from '../api/clientsApi';
import { toast } from 'sonner';

export const useClients = () => {
  const queryClient = useQueryClient();

  // Get all clients
  const { data, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getClients,
  });

  // Create client
  const createMutation = useMutation({
    mutationFn: (data: CreateClientData) => clientsApi.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create client';
      toast.error(message);
    },
  });

  // Update client
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) =>
      clientsApi.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update client';
      toast.error(message);
    },
  });

  // Delete client
  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientsApi.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Client deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to delete client';
      toast.error(message);
    },
  });

  return {
    clients: data?.clients || [],
    total: data?.total || 0,
    isLoading,
    error,
    createClient: createMutation.mutate,
    updateClient: updateMutation.mutate,
    deleteClient: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook for single client
export const useClient = (id: string) => {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsApi.getClient(id),
    enabled: !!id,
  });
};