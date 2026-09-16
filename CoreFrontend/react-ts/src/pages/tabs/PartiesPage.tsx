import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, User as UserIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const partySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phoneNumber: z.string().length(10, 'Must be 10 digits'),
  type: z.enum(['CUSTOMER', 'SUPPLIER']),
});

export default function PartiesPage() {
  const selectedOrganization = useAuthStore((state) => state.selectedOrganization);
  const [parties, setParties] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof partySchema>>({
    resolver: zodResolver(partySchema) as any,
    defaultValues: {
      name: '',
      phoneNumber: '',
      type: 'CUSTOMER',
    },
  });

  const fetchParties = async () => {
    if (!selectedOrganization) return;
    try {
      const response = await api.get(`/parties?organizationId=${selectedOrganization.id}`);
      setParties(response.data?.data || []);
    } catch (error) {
      toast.error('Failed to load parties');
    }
  };

  useEffect(() => {
    fetchParties();
  }, [selectedOrganization]);

  const onSubmit = async (values: z.infer<typeof partySchema>) => {
    setIsLoading(true);
    try {
      await api.post('/parties', {
        ...values,
        organizationId: selectedOrganization?.id,
      });
      toast.success('Party added successfully');
      setIsOpen(false);
      form.reset();
      fetchParties();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add party');
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
          Parties
        </h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 px-4 h-10">
              <Plus className="w-4 h-4 mr-1.5" /> Add Party
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-[#1B2A2F]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Add New Party</DialogTitle>
              <DialogDescription className="text-[#5B6660]">Create a customer or supplier for your organization.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5B6660] font-semibold text-xs uppercase">Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" className="rounded-xl bg-[#FBFAF5] border-[#DFD9C6] focus-visible:ring-primary/20 h-12" {...field} /></FormControl>
                    <FormMessage className="text-[#B23B3B] text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5B6660] font-semibold text-xs uppercase">Phone Number</FormLabel>
                    <FormControl><Input placeholder="98XXXXXXXX" maxLength={10} className="rounded-xl bg-[#FBFAF5] border-[#DFD9C6] focus-visible:ring-primary/20 h-12" {...field} /></FormControl>
                    <FormMessage className="text-[#B23B3B] text-xs" />
                  </FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#5B6660] font-semibold text-xs uppercase">Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="rounded-xl bg-[#FBFAF5] border-[#DFD9C6] focus:ring-primary/20 h-12"><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="SUPPLIER">Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[#B23B3B] text-xs" />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full h-13 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90 mt-2 shadow-lg shadow-primary/20" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        {parties.length === 0 ? (
          <Card className="border-dashed border-[#DFD9C6] bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center h-32 text-[#8A9490]">
              <p>No parties found</p>
            </CardContent>
          </Card>
        ) : (
          parties.map((party, i) => (
            <motion.div
              key={party.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="overflow-hidden border-0 shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-white rounded-xl hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all cursor-pointer">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#EAF3EE] text-primary rounded-full">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-[#1B2A2F] leading-tight">{party.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-[#8A9490] mt-0.5">
                        <span className="uppercase tracking-wider font-medium text-[10px] bg-primary/5 text-primary px-1.5 py-0.5 rounded-sm">{party.type}</span>
                        <span>•</span>
                        <span>{party.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-[#1B2A2F]">${party.balance || 0}</p>
                    <p className="text-[10px] uppercase font-semibold text-[#8A9490] tracking-wider mt-0.5">Balance</p>
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
