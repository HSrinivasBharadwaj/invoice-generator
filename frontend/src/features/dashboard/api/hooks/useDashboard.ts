import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../dashboardApi';

export const useDashboard = () => {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const { data: recentData, isLoading: isLoadingRecent } = useQuery({
    queryKey: ['dashboard-recent'],
    queryFn: dashboardApi.getRecentData,
    refetchInterval: 30000,
  });

  return {
    stats: stats || {
      totalClients: 0,
      totalInvoices: 0,
      totalRevenue: 0,
      pendingPayments: 0,
      paidInvoices: 0,
      draftInvoices: 0,
      sentInvoices: 0,
      overdueInvoices: 0,
    },
    recentClients: recentData?.recentClients || [],
    recentInvoices: recentData?.recentInvoices || [],
    isLoading: isLoadingStats || isLoadingRecent,
  };
};