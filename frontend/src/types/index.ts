// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  companyName: string | null;
  companyAddress: string | null;
  companyPhone: string | null;
  logoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  logoUrl?: string;
}

// Client types
export interface Client {
  id: string;
  userId: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  taxNumber: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Invoice types
export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  amountPaid: number;
  paymentMethod: string | null;
  paymentDate: string | null;
  notes: string | null;
  terms: string | null;
  createdAt: string;
  updatedAt: string;
  client?: Client;
  items?: InvoiceItem[];
}

// API Response types
export interface ApiResponse<T> {
  message: string;
  data?: T;
  error?: string;
  errors?: string[];
}