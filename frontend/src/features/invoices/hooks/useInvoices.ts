import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  invoicesApi, 
  type CreateInvoiceData, 
  type UpdateInvoiceData, 
  type UpdateStatusData 
} from '../api/invoicesApi';
import { toast } from 'sonner';

export const useInvoices = () => {
  const queryClient = useQueryClient();

  // Get all invoices
  const { data, isLoading, error } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoicesApi.getInvoices,
  });

  // Create invoice
  const createMutation = useMutation({
    mutationFn: (data: CreateInvoiceData) => invoicesApi.createInvoice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create invoice';
      toast.error(message);
    },
  });

  // Update invoice
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInvoiceData }) =>
      invoicesApi.updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update invoice';
      toast.error(message);
    },
  });

  // Update invoice status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStatusData }) =>
      invoicesApi.updateInvoiceStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice status updated!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to update status';
      toast.error(message);
    },
  });

  // Delete invoice
  const deleteMutation = useMutation({
    mutationFn: (id: string) => invoicesApi.deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to delete invoice';
      toast.error(message);
    },
  });

  return {
    invoices: data?.invoices || [],
    total: data?.total || 0,
    isLoading,
    error,
    createInvoice: createMutation.mutate,
    updateInvoice: updateMutation.mutate,
    updateInvoiceStatus: updateStatusMutation.mutate,
    deleteInvoice: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook for single invoice
export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.getInvoice(id),
    enabled: !!id,
  });
};