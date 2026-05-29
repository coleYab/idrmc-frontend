import { UserProfile } from '@clerk/nextjs';

export default function ProfilePage() {
  return (
    <div className='container mx-auto py-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='mb-8 text-3xl font-bold'>Profile</h1>
        <UserProfile
          appearance={{
            elements: {
              card: 'shadow-none',
              navbar: 'hidden',
              pageScrollBox: 'p-0'
            }
          }}
        />
      </div>
    </div>
  );
}
