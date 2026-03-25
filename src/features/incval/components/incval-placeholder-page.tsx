import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { InfobarContent } from '@/components/ui/infobar';

interface IncvalPlaceholderPageProps {
  title: string;
  description: string;
  infoContent: InfobarContent;
  dummyText: string;
}

export default function IncvalPlaceholderPage({
  title,
  description,
  infoContent,
  dummyText
}: IncvalPlaceholderPageProps) {
  return (
    <PageContainer
      pageTitle={title}
      pageDescription={description}
      infoContent={infoContent}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground text-sm leading-relaxed'>
            {dummyText}
          </p>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
