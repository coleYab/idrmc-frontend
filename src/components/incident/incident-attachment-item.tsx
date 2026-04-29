'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface IncidentAttachmentItemProps {
  src: string;
  alt: string;
  className?: string;
  index: number;
}

export function IncidentAttachmentItem({
  src,
  alt,
  className,
  index
}: IncidentAttachmentItemProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  // Handle Base64 vs URL
  const imageSrc = src.startsWith('data:')
    ? src // already correct base64
    : src.startsWith('http')
      ? src // already a valid URL
      : `data:image/jpeg;base64,${src}`; // raw base64 from mobile

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn('h-40 w-full rounded-md border object-cover', className)}
      loading='lazy'
      onError={() => {
        setHasError(true);
      }}
    />
  );
}
