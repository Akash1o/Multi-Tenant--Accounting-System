import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield, Users } from 'lucide-react';

const phoneSchema = z.object({
  phoneNumber: z.string().length(10, 'Phone number must be exactly 10 digits').regex(/^\d+$/, 'Must contain only numbers'),
});

const DEMO_MODE_ENABLED = import.meta.env.DEV;

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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
      const { isNew, otp } = response.data.data;
    
      console.log('%c 🔑 OTP CODE: ' + otp, 'background: #0b7245; color: white; font-size: 24px; padding: 10px; border-radius: 5px;');
      toast.success('OTP sent successfully');
      navigate(`/otp?phone=${values.phoneNumber}&isNew=${isNew}`, {
        state: { otp }
      });
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
    <div className="relative flex flex-col min-h-screen overflow-hidden bg-[#F6F1E4]">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent, transparent 35px, rgba(11,114,69,0.14) 35px, rgba(11,114,69,0.14) 36px)',
        }}
      />

      {/* Header / Logo */}
      <div className="relative z-20 flex justify-between items-center p-6 lg:px-12">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setShowLogin(false)}
        >
          <div className="w-10 h-10 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-[#F6F1E4] rotate-[-6deg]">
            <span
              className="text-primary font-black text-xs tracking-tight"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              MTA
            </span>
          </div>
          <span 
            className="text-xl font-bold text-[#1B2A2F] tracking-tight"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            MultiTenant
          </span>
        </div>
        
        {!showLogin && (
          <Button 
            variant="ghost" 
            className="text-[#1B2A2F] font-semibold hover:bg-primary/10"
            onClick={() => setShowLogin(true)}
          >
            Sign in
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 w-full max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!showLogin ? (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="grid lg:grid-cols-2 gap-12 items-center w-full"
            >
              <div className="flex flex-col items-start text-left">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Accounting re-imagined for modern teams
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl lg:text-6xl font-bold text-[#1B2A2F] tracking-tight leading-[1.1]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Your business accounts, kept the way you'd keep them on paper.
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#5B6660] text-lg mt-6 max-w-lg leading-relaxed"
                >
                  Experience the simplicity of a traditional ledger combined with bank-grade security, multi-branch support, and powerful digital insights.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 flex gap-4 w-full sm:w-auto"
                >
                  <Button
                    onClick={() => setShowLogin(true)}
                    className="h-14 px-8 rounded-xl text-lg font-semibold bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-12 grid grid-cols-2 gap-6"
                >
                  {[
                    { icon: CheckCircle2, text: 'Real-time syncing' },
                    { icon: Users, text: 'Multi-branch access' },
                    { icon: Shield, text: 'Bank-grade security' },
                    { icon: CheckCircle2, text: 'Zero learning curve' },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-[#1B2A2F] font-medium">
                      <div className="bg-white p-1.5 rounded-md shadow-sm border border-[#DFD9C6]">
                        <feature.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="hidden lg:block relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2.5rem] blur-3xl -z-10 transform rotate-3 scale-105" />
                <div className="bg-white rounded-[2rem] shadow-2xl border border-[#DFD9C6] p-6 rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="text-xs text-gray-400 font-medium">multi-tenant-ledger.app</div>
                  </div>
                  {/* Fake UI mockup */}
                  <div className="space-y-4">
                    <div className="h-10 w-1/3 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-primary/5 rounded-xl border border-primary/10 p-4 flex flex-col justify-between">
                        <div className="h-2 w-12 bg-primary/20 rounded" />
                        <div className="h-6 w-20 bg-primary/40 rounded" />
                      </div>
                      <div className="h-24 bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col justify-between">
                        <div className="h-2 w-12 bg-gray-200 rounded" />
                        <div className="h-6 w-16 bg-gray-300 rounded" />
                      </div>
                      <div className="h-24 bg-gray-50 rounded-xl border border-gray-100 p-4 flex flex-col justify-between">
                        <div className="h-2 w-12 bg-gray-200 rounded" />
                        <div className="h-6 w-24 bg-gray-300 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-12 bg-gray-50 rounded-lg flex items-center px-4 justify-between">
                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200" />
                            <div className="h-3 w-24 bg-gray-200 rounded" />
                          </div>
                          <div className="h-3 w-16 bg-gray-300 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
              <motion.div
              key="login"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md relative"
            >
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-16 h-16 rounded-full border border-[#DFD9C6] flex items-center justify-center bg-white shadow-sm mb-6">
                  <span
                    className="text-primary font-black text-xl tracking-tight"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    MTA
                  </span>
                </div>
                <h2
                  className="text-4xl font-bold text-[#1B2A2F] tracking-tight text-center"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                >
                  Welcome back
                </h2>
                <p className="text-[#5B6660] text-sm mt-3 text-center max-w-[280px] leading-relaxed">
                  Enter your mobile number to securely access your ledgers.
                </p>
              </div>

              <Card className="w-full border border-white/50 shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-[1.5rem] overflow-hidden bg-white/80 backdrop-blur-2xl relative">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

                <CardContent className="pt-10 pb-10 px-8 relative z-10">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-[#1B2A2F] font-bold text-sm tracking-wide">
                              Mobile Number
                            </FormLabel>
                            <FormControl>
                              <div className="group flex items-stretch h-16 rounded-2xl bg-white border border-[#E5E0D1] shadow-sm overflow-hidden focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all duration-300">
                                <div className="flex items-center gap-2 px-5 bg-[#FAFAF7] border-r border-[#E5E0D1] text-[#1B2A2F] font-semibold text-sm select-none">
                                  <span aria-hidden className="text-lg">🇳🇵</span>
                                  <span className="text-[#5B6660]">+977</span>
                                </div>
                                <input
                                  placeholder="98XXXXXXXX"
                                  type="tel"
                                  inputMode="numeric"
                                  maxLength={10}
                                  className="flex-1 min-w-0 px-5 bg-transparent text-xl font-medium text-[#1B2A2F] placeholder:text-[#C4BFAE] outline-none tracking-[0.1em]"
                                  value={field.value}
                                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                                  onBlur={field.onBlur}
                                  name={field.name}
                                  ref={field.ref}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[#B23B3B] text-xs font-medium" />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full text-lg h-16 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white transition-all duration-300 shadow-[0_4px_14px_rgba(11,114,69,0.3)] hover:shadow-[0_6px_20px_rgba(11,114,69,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] group flex items-center justify-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending code…' : (
                          <>
                            Continue
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                  
                  <div className="mt-8 flex items-center justify-center gap-2 text-[#8A9490] text-xs font-medium">
                    <Shield className="w-4 h-4 text-primary/60" />
                    <span>Secure, bank-grade encryption</span>
                  </div>
                  
                  {DEMO_MODE_ENABLED && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs px-4 py-3 rounded-xl flex items-center gap-3">
                      <span className="text-lg">🧪</span>
                      <span>Test build — check browser console for OTP</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center"
              >
                <button 
                  onClick={() => setShowLogin(false)}
                  className="text-[#8A9490] hover:text-[#1B2A2F] text-sm font-semibold transition-colors flex items-center justify-center gap-2 mx-auto group"
                >
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Back to home
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}