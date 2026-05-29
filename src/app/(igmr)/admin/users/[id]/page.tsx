import UserDetailClient from './user-detail-client';

export const metadata = {
  title: 'User Details - Admin Console'
};

export default function UserDetailPage({ params }: { params: { id: string } }) {
  return <UserDetailClient id={params.id} />;
}
