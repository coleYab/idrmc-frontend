import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Admin Console'
};

export default function AdminPage() {
  redirect('/admin/dashboard');
}
