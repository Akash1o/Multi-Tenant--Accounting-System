import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowRightLeft, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-[#8A9490]">
        <Wallet className="h-12 w-12 mb-4 opacity-50" />
        <p>No organization selected.</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 pb-8"
    >
      <motion.div variants={item} className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight text-[#1B2A2F]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Overview
        </h2>
        <p className="text-[#5B6660]">Welcome back to <span className="font-semibold text-[#1B2A2F]">{selectedOrganization.name}</span></p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 gap-4">
        <Card className="border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl bg-white overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-[#5B6660]">Total Parties</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-[#1B2A2F]">{partiesCount}</div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl bg-white overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-[#5B6660]">Recent Activity</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <ArrowRightLeft className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold text-[#1B2A2F]">{recentTransactions.length}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#1B2A2F]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            Recent Transactions
          </h3>
          <Link to="/transactions" className="text-sm text-primary hover:bg-primary/10 px-3 py-1.5 rounded-full transition-colors font-medium">
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <Card className="border-dashed border-[#DFD9C6] bg-transparent shadow-none">
              <CardContent className="flex flex-col items-center justify-center h-32 text-[#8A9490]">
                <p>No recent transactions</p>
              </CardContent>
            </Card>
          ) : (
            recentTransactions.map((tx: any, i) => (
              <motion.div 
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white rounded-xl hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-full ${tx.flow === 'IN' ? 'bg-[#EAF3EE] text-primary' : 'bg-[#FEEAE8] text-[#B23B3B]'}`}>
                        {tx.flow === 'IN' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1B2A2F]">{tx.party?.name || 'Unknown Party'}</p>
                        <p className="text-xs text-[#8A9490]">{new Date(tx.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className={`font-bold text-lg ${tx.flow === 'IN' ? 'text-primary' : 'text-[#B23B3B]'}`}>
                      {tx.flow === 'IN' ? '+' : '-'}${tx.amount}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

