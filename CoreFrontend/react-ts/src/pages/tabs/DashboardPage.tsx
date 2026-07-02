import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowRightLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const [partiesCount, setPartiesCount] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (selectedOrganization) {
      const fetchData = async () => {
        try {
          const [partiesRes, transRes] = await Promise.all([
            api.get(`/parties?organizationId=${selectedOrganization.id}`),
            api.get(`/transactions?organizationId=${selectedOrganization.id}`)
          ]);
          setPartiesCount(partiesRes.data?.data?.length || 0);
          
          const trans = transRes.data?.data || [];
          setRecentTransactions(trans.slice(0, 5));
        } catch (error) {
          console.error('Failed to fetch dashboard data', error);
        }
      };
      fetchData();
    }
  }, [selectedOrganization]);

  if (!selectedOrganization) {
    return <div className="p-4 text-center text-muted-foreground mt-10">No organization selected.</div>;
  }

  return (
    <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground">Welcome back to {selectedOrganization.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-primary/10 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Parties</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{partiesCount}</div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{recentTransactions.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <Link to="/transactions" className="text-sm text-primary hover:underline font-medium">View All</Link>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <Card className="border-dashed bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <p>No recent transactions</p>
              </CardContent>
            </Card>
          ) : (
            recentTransactions.map((tx: any) => (
              <Card key={tx.id} className="overflow-hidden transition-all hover:shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${tx.flow === 'IN' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {tx.flow === 'IN' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{tx.party?.name || 'Unknown Party'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.flow === 'IN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.flow === 'IN' ? '+' : '-'}${tx.amount}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
