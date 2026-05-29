import React from 'react';

export default function ErtDashboardLayout({
  children,
  pie_stats,
  bar_stats,
  area_stats
}: {
  children: React.ReactNode;
  pie_stats: React.ReactNode;
  bar_stats: React.ReactNode;
  area_stats: React.ReactNode;
}) {
  return (
    <div className='flex flex-1 flex-col gap-4 py-4'>
      {children}

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6'>
        <div className='col-span-4'>{bar_stats}</div>
        <div className='col-span-4'>{area_stats}</div>
        <div className='col-span-4 min-h-0 md:col-span-2'>{pie_stats}</div>
      </div>
    </div>
  );
}
