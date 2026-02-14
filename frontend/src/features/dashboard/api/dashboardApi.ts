import { api } from '@/lib/axios';
import type { Client, Invoice } from '@/types';

export interface DashboardStats {
  totalClients: number;
  totalInvoices: number;
  totalRevenue: number;
  pendingPayments: number;
  paidInvoices: number;
  draftInvoices: number;
  sentInvoices: number;
  overdueInvoices: number;
}

export interface RecentData {
  recentClients: Client[];
  recentInvoices: Invoice[];
}

export const dashboardApi = {
  // Get dashboard stats
  getStats: async (): Promise<DashboardStats> => {
    // Since we don't have a dedicated stats endpoint, we'll calculate from existing data
    const [clientsRes, invoicesRes] = await Promise.all([
      api.get('/clients'),
      api.get('/invoices'),
    ]);

    const clients = clientsRes.data.clients || [];
    const invoices = invoicesRes.data.invoices || [];

    const totalRevenue = invoices
      .filter((inv: Invoice) => inv.status === 'PAID')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    const pendingPayments = invoices
      .filter((inv: Invoice) => inv.status === 'SENT' || inv.status === 'OVERDUE')
      .reduce((sum: number, inv: Invoice) => sum + inv.total, 0);

    return {
      totalClients: clients.length,
      totalInvoices: invoices.length,
      totalRevenue,
      pendingPayments,
      paidInvoices: invoices.filter((inv: Invoice) => inv.status === 'PAID').length,
      draftInvoices: invoices.filter((inv: Invoice) => inv.status === 'DRAFT').length,
      sentInvoices: invoices.filter((inv: Invoice) => inv.status === 'SENT').length,
      overdueInvoices: invoices.filter((inv: Invoice) => inv.status === 'OVERDUE').length,
    };
  },

  // Get recent data
  getRecentData: async (): Promise<RecentData> => {
    const [clientsRes, invoicesRes] = await Promise.all([
      api.get('/clients'),
      api.get('/invoices'),
    ]);

    const clients = clientsRes.data.clients || [];
    const invoices = invoicesRes.data.invoices || [];

    return {
      recentClients: clients.slice(0, 5),
      recentInvoices: invoices.slice(0, 5),
    };
  },
};