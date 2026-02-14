import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useInvoices } from '@/features/invoices/hooks/useInvoices';
import InvoiceFormDialog from '@/features/invoices/components/InvoiceFormDialog';
import InvoicesTable from '@/features/invoices/components/InvoicesTable';
import type { Invoice } from '@/types';
import type { CreateInvoiceData } from '@/features/invoices/api/invoicesApi';

const InvoicesPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | undefined>();

  const {
    invoices,
    total,
    isLoading,
    createInvoice,
    updateInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    isCreating,
    isUpdating,
    isDeleting,
  } = useInvoices();

  const handleCreate = (data: CreateInvoiceData) => {
    createInvoice(data, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleUpdate = (data: CreateInvoiceData) => {
    if (selectedInvoice) {
      updateInvoice(
        { id: selectedInvoice.id, data },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setSelectedInvoice(undefined);
          },
        }
      );
    }
  };

  const handleStatusChange = (id: string, status: Invoice['status']) => {
    updateInvoiceStatus({ id, data: { status } });
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedInvoice(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 mt-1">
            Manage your invoices ({total} total)
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoicesTable
            invoices={invoices}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>

      <InvoiceFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={selectedInvoice ? handleUpdate : handleCreate}
        invoice={selectedInvoice}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default InvoicesPage;




