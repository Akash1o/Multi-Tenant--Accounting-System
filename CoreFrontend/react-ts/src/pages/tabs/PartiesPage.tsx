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
    return <div className="p-4 text-center text-muted-foreground mt-10">No organization selected.</div>;
  }

  return (
    <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Parties</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Party
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Party</DialogTitle>
              <DialogDescription>Create a customer or supplier for your organization.</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input placeholder="98XXXXXXXX" maxLength={10} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="type" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                        <SelectItem value="SUPPLIER">Supplier</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {parties.length === 0 ? (
          <Card className="border-dashed bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <p>No parties found</p>
            </CardContent>
          </Card>
        ) : (
          parties.map((party) => (
            <Card key={party.id} className="overflow-hidden transition-all hover:shadow-sm cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 text-primary rounded-full">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-base">{party.name}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="capitalize">{party.type.toLowerCase()}</span>
                      <span>•</span>
                      <span>{party.phoneNumber}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{party.balance || 0}</p>
                  <p className="text-xs text-muted-foreground">Balance</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
