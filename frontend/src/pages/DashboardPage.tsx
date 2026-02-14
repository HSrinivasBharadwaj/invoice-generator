import { Users, FileText, DollarSign, Clock, TrendingUp, Send, CheckCircle } from 'lucide-react';
import { useDashboard } from '@/features/dashboard/hooks/useDashboard';
import StatsCard from '@/features/dashboard/components/StatsCard';
import RecentClients from '@/features/dashboard/components/RecentClients';
import RecentInvoices from '@/features/dashboard/components/RecentInvoices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardPage = () => {
  const { stats, recentClients, recentInvoices, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your overview</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Clients"
          value={stats.totalClients}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Total Invoices"
          value={stats.totalInvoices}
          icon={FileText}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          subtitle={`${stats.paidInvoices} paid invoices`}
        />
        <StatsCard
          title="Pending Payments"
          value={`$${stats.pendingPayments.toFixed(2)}`}
          icon={Clock}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          subtitle={`${stats.sentInvoices + stats.overdueInvoices} invoices`}
        />
      </div>

      {/* Invoice Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Draft</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftInvoices}</div>
            <p className="text-xs text-gray-500">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-blue-600" />
              <div className="text-2xl font-bold">{stats.sentInvoices}</div>
            </div>
            <p className="text-xs text-gray-500">Awaiting payment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="text-2xl font-bold">{stats.paidInvoices}</div>
            </div>
            <p className="text-xs text-gray-500">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <div className="text-2xl font-bold">{stats.overdueInvoices}</div>
            </div>
            <p className="text-xs text-gray-500">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentInvoices invoices={recentInvoices} />
        <RecentClients clients={recentClients} />
      </div>
    </div>
  );
};

export default DashboardPage;










