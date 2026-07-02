import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import api from '@/lib/axios';

const phoneSchema = z.object({
  phoneNumber: z.string().length(10, 'Phone number must be exactly 10 digits').regex(/^\d+$/, 'Must contain only numbers'),
});

// Demo Mode is a DEV-ONLY convenience so the UI can be built without a running backend.
// It must never activate in a production build, and it must never fire for a real
// backend error (e.g. "phone number invalid") -- only for the backend being unreachable.
const DEMO_MODE_ENABLED = import.meta.env.DEV;

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof phoneSchema>>({
    resolver: zodResolver(phoneSchema) as any,
    defaultValues: { phoneNumber: '' },
  });

  const onSubmit = async (values: z.infer<typeof phoneSchema>) => {
    setIsLoading(true);
    try {
      const response = await api.post('/otp/request', {
        phoneNumber: values.phoneNumber,
      });
      const { isNew } = response.data.data;
      toast.success('OTP sent successfully');
      navigate(`/otp?phone=${values.phoneNumber}&isNew=${isNew}`);
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response?.data?.message || 'Could not send OTP. Please try again.');
        return;
      }
      if (DEMO_MODE_ENABLED) {
        console.warn('Backend unreachable — falling back to Demo Mode', error);
        toast.info('Demo Mode: simulating OTP send (backend unreachable)');
        setTimeout(() => {
          navigate(`/otp?phone=${values.phoneNumber}&isNew=true`);
        }, 600);
      } else {
        toast.error('Unable to reach the server. Please check your connection and try again.');
      }
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
        <div className="flex flex-col items-center mb-7">
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-[#F6F1E4] rotate-[-6deg]">
            <span
              className="text-primary font-black text-xl tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              MTA
            </span>
          </div>
          <h1
            className="mt-4 text-3xl font-bold text-[#1B2A2F] tracking-tight text-center"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            MultiTenant Ledger
          </h1>
          <p className="text-[#5B6660] text-sm mt-1.5 text-center max-w-[280px]">
            Your business accounts, kept the way you'd keep them on paper — only faster.
          </p>
        </div>

        <Card className="w-full border-0 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden bg-white">
          <div className="h-1.5 w-full bg-primary" />

          <CardHeader className="pb-1 pt-7 px-7">
            <p className="text-[#1B2A2F] font-semibold text-lg">Sign in</p>
            <p className="text-[#5B6660] text-sm mt-0.5">We'll text you a 6-digit code to verify it's you.</p>
          </CardHeader>

          <CardContent className="pb-8 px-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-[#5B6660] text-xs uppercase tracking-wider">
                        Mobile Number
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-stretch h-14 rounded-xl border border-[#DFD9C6] bg-[#FBFAF5] overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all duration-200">
                          <div className="flex items-center gap-1.5 px-4 bg-[#F0ECDD] border-r border-[#DFD9C6] text-[#1B2A2F] font-medium text-sm select-none">
                            <span aria-hidden>🇳🇵</span>
                            <span>+977</span>
                          </div>
                          <input
                            placeholder="98XXXXXXXX"
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            className="flex-1 min-w-0 px-4 bg-transparent text-lg text-[#1B2A2F] placeholder:text-[#C4BFAE] outline-none tracking-wide"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full text-base h-13 rounded-xl font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending code…' : 'Continue'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-3 mt-6 text-center">
          {['Cash & credit', 'Multi-branch', 'Bank-grade security'].map((f) => (
            <div key={f} className="text-[#5B6660] text-xs leading-snug">
              {f}
            </div>
          ))}
        </div>

        <p className="text-center text-[#8A9490] text-xs mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a> &{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}