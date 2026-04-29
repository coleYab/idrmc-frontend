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
  className
}: IncidentAttachmentItemProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  const imageSrc = src.startsWith('data:')
    ? src
    : src.startsWith('http')
      ? src
      : `data:image/jpeg;base64,${src}`;

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
