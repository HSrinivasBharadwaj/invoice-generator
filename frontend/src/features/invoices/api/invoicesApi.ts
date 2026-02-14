import { api } from '@/lib/axios';
import type { Invoice } from '@/types';

export interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceData {
  clientId: string;
  dueDate: string;
  taxRate?: number;
  discount?: number;
  notes?: string;
  terms?: string;
  items: InvoiceItemInput[];
}

export interface UpdateInvoiceData {
  clientId?: string;
  dueDate?: string;
  taxRate?: number;
  discount?: number;
  notes?: string;
  terms?: string;
  items?: InvoiceItemInput[];
}

export interface UpdateStatusData {
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

export const invoicesApi = {
  // Get all invoices
  getInvoices: async (): Promise<{ invoices: Invoice[]; total: number }> => {
    const response = await api.get('/invoices');
    return response.data;
  },

  // Get single invoice
  getInvoice: async (id: string): Promise<{ invoice: Invoice }> => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  // Create invoice
  createInvoice: async (data: CreateInvoiceData): Promise<{ invoice: Invoice }> => {
    const response = await api.post('/invoices', data);
    return response.data;
  },

  // Update invoice
  updateInvoice: async (id: string, data: UpdateInvoiceData): Promise<{ invoice: Invoice }> => {
    const response = await api.put(`/invoices/${id}`, data);
    return response.data;
  },

  // Update invoice status
  updateInvoiceStatus: async (id: string, data: UpdateStatusData): Promise<{ invoice: Invoice }> => {
    const response = await api.patch(`/invoices/${id}/status`, data);
    return response.data;
  },

  // Delete invoice
  deleteInvoice: async (id: string): Promise<void> => {
    await api.delete(`/invoices/${id}`);
  },
};