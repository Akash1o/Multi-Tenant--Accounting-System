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
    return <div className="p-4 text-center text-muted-foreground mt-10">No organization selected.</div>;
  }

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>Record a new cash, QR, or credit transaction.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="flow" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flow (IN/OUT)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select flow" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="IN">Money IN (+)</SelectItem>
                          <SelectItem value="OUT">Money OUT (-)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="amount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                
                <FormField control={form.control} name="partyId" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ? field.value.toString() : ''}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a party" /></SelectTrigger></FormControl>
                      <SelectContent>
                        {parties.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select payment type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="QR">QR Code / Bank</SelectItem>
                        <SelectItem value="CREDIT">Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="note" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (Optional)</FormLabel>
                    <FormControl><Input placeholder="Transaction description..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Transaction'}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <p>No transactions found</p>
            </CardContent>
          </Card>
        ) : (
          transactions.map((tx) => (
            <Card key={tx.id} className="overflow-hidden transition-all hover:shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${tx.flow === 'IN' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {tx.flow === 'IN' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="font-medium text-base">{tx.party?.name || 'Unknown'}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="capitalize">{tx.type.toLowerCase()}</span>
                      <span>•</span>
                      <span>{new Date(tx.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${tx.flow === 'IN' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {tx.flow === 'IN' ? '+' : '-'}${tx.amount}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
