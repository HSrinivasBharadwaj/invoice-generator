import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Invoice } from '@/types';
import { format } from 'date-fns';

interface RecentInvoicesProps {
  invoices: Invoice[];
}

const RecentInvoices = ({ invoices }: RecentInvoicesProps) => {
  const getStatusBadge = (status: Invoice['status']) => {
    const variants: Record<Invoice['status'], { className: string }> = {
      DRAFT: { className: 'bg-gray-100 text-gray-800' },
      SENT: { className: 'bg-blue-100 text-blue-800' },
      PAID: { className: 'bg-green-100 text-green-800' },
      OVERDUE: { className: 'bg-red-100 text-red-800' },
      CANCELLED: { className: 'bg-gray-100 text-gray-600' },
    };

    return (
      <Badge variant="secondary" className={variants[status].className}>
        {status}
      </Badge>
    );
  };

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">
            No invoices yet. Create your first invoice!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber}
                  </p>
                  {getStatusBadge(invoice.status)}
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {invoice.client?.name || 'Unknown Client'}
                </p>
                <p className="text-xs text-gray-400">
                  Due: {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  ${invoice.total.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentInvoices;