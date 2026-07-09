import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useLocation } from 'react-router-dom';

 
const OTP_LENGTH = 6;

const DEMO_MODE_ENABLED = import.meta.env.DEV;

export default function OtpPage() {
 const navigate = useNavigate();
  const location = useLocation(); 
  const testOtp = location.state?.otp;
  const [searchParams] = useSearchParams();
  const phone = searchParams.get('phone');
  const isNew = searchParams.get('isNew') === 'true';
  const login = useAuthStore((state) => state.login);
  const setSelectedOrganization = useAuthStore((state) => state.setSelectedOrganization);

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) {
      navigate('/login');
    }
  }, [phone, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const otp = digits.join('');

  const handleChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      return;
    }
    // Handles a full paste landing in one box too
    const chars = clean.split('');
    const next = [...digits];
    chars.forEach((c, i) => {
      if (index + i < OTP_LENGTH) next[index + i] = c;
    });
    setDigits(next);
    const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const completeLogin = (accessToken: string, refreshToken: string, user: any, organizations?: any[]) => {
    login(accessToken, refreshToken, user);

    if (isNew) {
      navigate('/create-organization');
      return;
    }

    if (organizations && organizations.length > 0) {
      setSelectedOrganization(organizations[0]);
      navigate('/dashboard');
    } else {
      navigate('/create-organization');
    }
  };

  const handleSubmit = async () => {
    if (otp.length !== OTP_LENGTH) {
      setError('Enter all 6 digits');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.post('/otp/verify', { phoneNumber: phone, otp });
      const { accessToken, refreshToken, user, organizations } = response.data.data;
      const loggedInUser = user || { id: Date.now(), phoneNumber: phone, firstName: 'User', lastName: '' };

      toast.success('Successfully verified');
      completeLogin(accessToken, refreshToken, loggedInUser, organizations);
    } catch (err: any) {
      if (err.response) {
        setError(err.response?.data?.message || 'Incorrect or expired code. Please try again.');
        setDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
        return;
      }
      if (DEMO_MODE_ENABLED) {
        console.warn('Backend unreachable — falling back to Demo Mode', err);
        toast.info('Demo Mode: simulating verification (backend unreachable)');
        setTimeout(() => {
          const demoUser = { id: Date.now(), phoneNumber: phone || '9800000000', firstName: 'Demo', lastName: 'User' };
          const demoOrgs = isNew ? [] : [{ id: 1, name: 'Demo Organization', role: 'owner' }];
          completeLogin('demo-access-token', 'demo-refresh-token', demoUser, demoOrgs);
        }, 800);
      } else {
        toast.error('Unable to reach the server. Please try again.');
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
          <div className="relative w-16 h-16 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center bg-[#F6F1E4] rotate-[6deg]">
            <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1
            className="mt-4 text-3xl font-bold text-[#1B2A2F] tracking-tight text-center"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Verify it's you
          </h1>
          <p className="text-[#5B6660] text-sm mt-1.5 text-center">
            Code sent to <span className="text-[#1B2A2F] font-medium">+977 {phone}</span>
          </p>
          {testOtp && (
  <div 
    className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 mb-4 cursor-pointer active:scale-95 transition-transform"
    onClick={() => {
      navigator.clipboard.writeText(testOtp);
      toast.success('OTP copied to clipboard!');
    }}
  >
    <p className="text-xs text-emerald-600 font-medium text-center">🧪 Test Mode — Tap to copy OTP</p>
    <p className="text-3xl font-bold text-emerald-700 tracking-[0.5em] text-center mt-1">
      {testOtp}
    </p>
  </div>
)}
        </div>

        <Card className="w-full border-0 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.08)] rounded-2xl overflow-hidden bg-white">
          <div className="h-1.5 w-full bg-primary" />

          <CardHeader className="pb-1 pt-7 px-7">
            <p className="text-[#1B2A2F] font-semibold text-lg">Enter code</p>
          </CardHeader>

          <CardContent className="pb-8 px-7">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between gap-2">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={OTP_LENGTH}
                      value={d}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="w-full aspect-square max-w-[46px] text-center text-2xl font-semibold rounded-xl border border-[#DFD9C6] bg-[#FBFAF5] text-[#1B2A2F] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all duration-200"
                    />
                  ))}
                </div>
                {error && <p className="text-sm text-[#B23B3B] mt-2 text-center">{error}</p>}
              </div>

              <Button
                type="button"
                onClick={handleSubmit}
                className="w-full text-base h-13 rounded-xl font-semibold bg-primary hover:bg-primary/90 transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying…' : 'Confirm'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-[#8A9490] text-xs mt-6">
          Didn't get a code?{' '}
          <button type="button" className="text-primary hover:underline font-medium">Resend</button>
        </p>
      </div>
    </div>
  );
}