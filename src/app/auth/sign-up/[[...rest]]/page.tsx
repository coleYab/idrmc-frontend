import { Metadata } from 'next';
import SignUpViewPage from '@/features/auth/components/sign-up-view';

export const metadata: Metadata = {
  title: 'IDRMC | Sign Up',
  description: 'Create account access for IDRMC and EDRMC operations portal.'
};

export default async function Page() {
  return <SignUpViewPage />;
}
