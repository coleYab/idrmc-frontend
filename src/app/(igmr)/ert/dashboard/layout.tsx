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

      <div className='grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-3'>
        <div className='xl:col-span-2'>{bar_stats}</div>
        <div className='xl:col-span-1'>{pie_stats}</div>
        <div className='xl:col-span-3'>{area_stats}</div>
      </div>
    </div>
  );
}
