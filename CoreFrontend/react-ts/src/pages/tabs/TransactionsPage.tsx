import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingDown, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const txSchema = z.object({
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  flow: z.enum(['IN', 'OUT']),
  type: z.enum(['CASH', 'QR', 'CREDIT']),
  partyId: z.coerce.number({ message: "Select a party" }).min(1, 'Select a party'),
  note: z.string().optional(),
});

export default function TransactionsPage() {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof txSchema>>({
    resolver: zodResolver(txSchema) as any,
    defaultValues: {
      amount: 0,
      flow: 'IN',
      type: 'CASH',
      partyId: 0,
      note: '',
    },
  });

  const fetchData = async () => {
    if (!selectedOrganization) return;
    try {
      const [txRes, partiesRes] = await Promise.all([
        api.get(`/transactions?organizationId=${selectedOrganization.id}`),
        api.get(`/parties?organizationId=${selectedOrganization.id}`)
      ]);
      setTransactions(txRes.data?.data || []);
      setParties(partiesRes.data?.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedOrganization]);

  const onSubmit = async (values: z.infer<typeof txSchema>) => {
    setIsLoading(true);
    try {
      await api.post('/transactions', {
        ...values,
        organizationId: selectedOrganization?.id,
      });
      toast.success('Transaction added successfully');
      setIsOpen(false);
      form.reset();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedOrganization) {
    return <div className="p-4 text-center text-[#8A9490] mt-10">No organization selected.</div>;
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
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-6 pb-8"
    >
      <motion.div variants={item} className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-[#1B2A2F]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Transactions
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 px-4 h-10">
              <Plus className="w-4 h-4 mr-1.5" /> Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#1B2A2F]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Add Transaction</DialogTitle>
              <DialogDescription className="text-[#5B6660]">Record a new cash, QR, or credit transaction.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="flow" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#5B6660] font-semibold text-xs uppercase">Flow (IN/OUT)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger className="rounded-xl bg-[#FBFAF5] border-[#DFD9C6] focus:ring-primary/20 h-12"><SelectValue placeholder="Select flow" /></SelectTrigger></FormControl>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="IN">Money IN (+)</SelectItem>
                          <SelectItem value="OUT">Money OUT (-)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[#B23B3B] text-xs" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#5B6660] font-semibold text-xs uppercase">Amount</FormLabel>
                      <FormControl><Input type="number" placeholder="0" className="rounded-xl bg-[#FBFAF5] border-[#DFD9C6] focus-visible:ring-primary/20 h-12" {...field} /></FormControl>
                      <FormMessage className="text-[#B23B3B] text-xs" />
                    </FormItem>
                  )} />
                </div>
                
                <FormField control={form.control} name="partyId" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5B6660] font-semibold text-xs uppercase">Party</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ? field.value.toString() : ''}>
                      <FormControl><SelectTrigger className="rounded-xl bg-[#FBFAF5] border-[#DFD9C6] focus:ring-primary/20 h-12"><SelectValue placeholder="Select a party" /></SelectTrigger></FormControl>
                      <SelectContent className="rounded-xl">
                        {parties.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[#B23B3B] text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5B6660] font-semibold text-xs uppercase">Payment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="rounded-xl bg-[#FBFAF5] border-[#DFD9C6] focus:ring-primary/20 h-12"><SelectValue placeholder="Select payment type" /></SelectTrigger></FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="QR">QR Code / Bank</SelectItem>
                        <SelectItem value="CREDIT">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[#B23B3B] text-xs" />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="note" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5B6660] font-semibold text-xs uppercase">Note (Optional)</FormLabel>
                    <FormControl><Input placeholder="Transaction description..." className="rounded-xl bg-[#FBFAF5] border-[#DFD9C6] focus-visible:ring-primary/20 h-12" {...field} /></FormControl>
                    <FormMessage className="text-[#B23B3B] text-xs" />
                  </FormItem>
                )} />

                <Button type="submit" className="w-full h-13 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Transaction'}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        {transactions.length === 0 ? (
          <Card className="border-dashed border-[#DFD9C6] bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center h-32 text-[#8A9490]">
              <p>No transactions found</p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((tx, i) => (
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
                      <p className="font-semibold text-lg text-[#1B2A2F] leading-tight">{tx.party?.name || 'Unknown'}</p>
                      <div className="flex items-center space-x-2 text-xs text-[#8A9490] mt-0.5">
                        <span className="uppercase tracking-wider font-medium text-[10px] bg-primary/5 text-primary px-1.5 py-0.5 rounded-sm">{tx.type}</span>
                        <span>•</span>
                        <span>{new Date(tx.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${tx.flow === 'IN' ? 'text-primary' : 'text-[#B23B3B]'}`}>
                      {tx.flow === 'IN' ? '+' : '-'}${tx.amount}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
