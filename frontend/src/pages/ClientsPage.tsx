import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useClients } from '@/features/clients/hooks/useClients';
import ClientFormDialog from '@/features/clients/components/ClientFormDialog';
import ClientsTable from '@/features/clients/components/ClientsTable';
import type { Client } from '@/types';
import type { CreateClientData } from '@/features/clients/api/clientsApi';

const ClientsPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>();

  const {
    clients,
    total,
    isLoading,
    createClient,
    updateClient,
    deleteClient,
    isCreating,
    isUpdating,
    isDeleting,
  } = useClients();

  const handleCreate = (data: CreateClientData) => {
    createClient(data, {
      onSuccess: () => setDialogOpen(false),
    });
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  const handleUpdate = (data: CreateClientData) => {
    if (selectedClient) {
      updateClient(
        { id: selectedClient.id, data },
        {
          onSuccess: () => {
            setDialogOpen(false);
            setSelectedClient(undefined);
          },
        }
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteClient(id);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedClient(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading clients...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 mt-1">
            Manage your clients ({total} total)
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsTable
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>

      <ClientFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSubmit={selectedClient ? handleUpdate : handleCreate}
        client={selectedClient}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default ClientsPage;




