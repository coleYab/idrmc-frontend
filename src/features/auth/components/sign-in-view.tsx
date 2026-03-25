import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'IDRMC | Sign In',
  description: 'Secure access for EDRMC incident and risk management users.'
};

export default function SignInViewPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[linear-gradient(160deg,#0f3f2f_0%,#0f766e_35%,#14b8a6_100%)]'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(255,255,255,0.12),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(0,0,0,0.18),transparent_50%)]' />
      <div className='relative grid min-h-screen lg:grid-cols-2'>
        <section className='hidden flex-col justify-between border-r border-white/15 p-10 text-white lg:flex'>
          <div className='space-y-6'>
            <div className='inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs tracking-wide uppercase'>
              <ShieldCheck className='h-4 w-4' />
              EDRMC Secure Portal
            </div>
            <div className='space-y-3'>
              <h1 className='text-4xl leading-tight font-bold'>
                IDRMC Incident Operations Access
              </h1>
              <p className='max-w-xl text-sm leading-relaxed text-white/85'>
                Welcome to the Ethiopian Disaster and Risk Management
                Commission operational platform. Sign in to monitor incident
                intake, coordinate response visibility, and maintain accurate
                disaster verification workflows.
              </p>
            </div>
          </div>

          <div className='rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm'>
            <p className='text-sm leading-relaxed text-white/90'>
              This environment is designed for emergency and risk-management
              teams to keep incident intelligence coordinated, fast, and
              reliable across regions.
            </p>
            <p className='mt-3 text-xs text-white/70'>
              IDRMC x EDRMC | National Disaster Risk Operations
            </p>
          </div>
        </section>

        <section className='flex items-center justify-center p-4 sm:p-8'>
          <div className='w-full max-w-md rounded-2xl border border-white/25 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:p-8'>
            <div className='mb-6 text-center'>
              <h2 className='text-2xl font-bold text-emerald-900'>Sign In</h2>
              <p className='mt-1 text-sm text-emerald-800/80'>
                Access IDRMC operational dashboard
              </p>
            </div>

            <ClerkSignInForm
              appearance={{
                variables: {
                  colorPrimary: '#0f766e'
                }
              }}
            />

            <p className='text-muted-foreground mt-6 text-center text-xs'>
              By continuing, you agree to our{' '}
              <Link
                href='/terms-of-service'
                className='underline underline-offset-4'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy-policy'
                className='underline underline-offset-4'
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
