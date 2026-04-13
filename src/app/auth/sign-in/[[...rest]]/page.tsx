import { Metadata } from 'next';
import SignInViewPage from '@/features/auth/components/sign-in-view';

export const metadata: Metadata = {
  title: 'IDRMC | Sign In',
  description: 'Secure sign in for IDRMC and EDRMC operations access.'
};

export default async function Page() {
  return <SignInViewPage />;
}
