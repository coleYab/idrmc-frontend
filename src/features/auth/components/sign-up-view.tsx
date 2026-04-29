'use client';

import { SignUp as ClerkSignUpForm } from '@clerk/nextjs';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function SignUpViewPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[linear-gradient(165deg,#0a3d2f_0%,#0f766e_45%,#22c55e_100%)]'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(255,255,255,0.12),transparent_42%),radial-gradient(circle_at_85%_85%,rgba(0,0,0,0.2),transparent_55%)]' />
      <div className='relative grid min-h-screen lg:grid-cols-2'>
        <section className='hidden flex-col justify-between border-r border-white/15 p-10 text-white lg:flex'>
          <div className='space-y-6'>
            <div className='inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs tracking-wide uppercase'>
              <ShieldCheck className='h-4 w-4' />
              National Response Platform
            </div>
            <div className='space-y-3'>
              <h1 className='text-4xl leading-tight font-bold'>
                Join IDRMC Operations Workspace
              </h1>
              <p className='max-w-xl text-sm leading-relaxed text-white/85'>
                Create your authenticated access to the Ethiopian Disaster and
                Risk Management Commission environment for incident
                coordination, validation, and response visibility.
              </p>
            </div>
          </div>

          <div className='rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm'>
            <p className='text-sm leading-relaxed text-white/90'>
              Every account in this portal supports accurate and accountable
              disaster-risk operations across national and regional workflows.
            </p>
            <p className='mt-3 text-xs text-white/70'>
              EDRMC Secure Access | IDRMC Project
            </p>
          </div>
        </section>

        <section className='flex items-center justify-center p-4 sm:p-8'>
          <div className='w-full max-w-md rounded-2xl border border-white/25 bg-white/90 p-6 shadow-2xl backdrop-blur-md sm:p-8'>
            <div className='mb-6 text-center'>
              <h2 className='text-2xl font-bold text-emerald-900'>Sign Up</h2>
              <p className='mt-1 text-sm text-emerald-800/80'>
                Register for IDRMC emergency operations access
              </p>
            </div>

            <ClerkSignUpForm
              path='/auth/sign-up'
              routing='path'
              signInUrl='/auth/sign-in'
              appearance={{
                variables: {
                  colorPrimary: '#0f766e'
                }
              }}
            />

            <div className='mt-4 text-center text-sm text-emerald-900/90'>
              Already have an account?{' '}
              <Link
                href='/auth/sign-in'
                className='font-semibold text-emerald-900 underline underline-offset-2'
              >
                Sign in
              </Link>
            </div>

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
