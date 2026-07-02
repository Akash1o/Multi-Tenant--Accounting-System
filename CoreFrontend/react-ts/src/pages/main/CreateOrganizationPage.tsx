import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

const orgSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters').max(50),
});

export default function CreateOrganizationPage() {
  const navigate = useNavigate();
  const setSelectedOrganization = useAuthStore((state) => state.setSelectedOrganization);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: { name: '' },
  });

  const onSubmit = async (values: z.infer<typeof orgSchema>) => {
    setIsLoading(true);
    try {
      const response = await api.post('/organization', {
        name: values.name,
      });
      const org = response.data.data;
      setSelectedOrganization(org);
      toast.success('Organization created successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-[#F6F1E4] px-4 py-10">
      <div
        className="absolute inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent, transparent 35px, rgba(11,114,69,0.14) 35px, rgba(11,114,69,0.14) 36px)',
        }}
      />

      <div className="z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-[#F6F1E4] rotate-[-4deg]">
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1" />
            </svg>
          </div>
          <h1
            className="mt-4 text-3xl font-bold text-[#1B2A2F] tracking-tight text-center"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Set up your business
          </h1>
          <p className="text-[#5B6660] text-sm mt-1 text-center">
            One last step before your ledger is ready.
          </p>
        </div>

        <Card className="w-full border-0 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] rounded-lg overflow-hidden bg-white relative">
          <div className="absolute top-0 left-10 h-full w-px bg-[#B23B3B]/40" />

          <CardHeader className="pb-2 pt-8 pl-14 pr-8">
            <p className="text-[#1B2A2F] font-semibold text-lg">Organization name</p>
          </CardHeader>

          <CardContent className="pb-8 pl-14 pr-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[#5B6660] text-xs uppercase tracking-wider">
                        Business name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="E.g. Shrestha General Store"
                          className="h-14 text-lg border-0 border-b-2 border-[#D8D2C0] rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary transition-colors duration-200 text-[#1B2A2F] placeholder:text-[#C4BFAE]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full text-base h-13 rounded-md font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating…' : 'Create organization'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}