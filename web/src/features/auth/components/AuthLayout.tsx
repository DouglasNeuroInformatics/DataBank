import { Card, Heading, LanguageToggle, ThemeToggle } from '@douglasneuroinformatics/libui/components';
import { cn } from '@douglasneuroinformatics/libui/utils';
import { Link } from '@tanstack/react-router';

import { Logo } from '@/components';

type AuthLayoutProps = {
  children: React.ReactNode;
  maxWidth: 'md' | 'sm';
  title: string;
};

export const AuthLayout = ({ children, maxWidth, title }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex w-full flex-grow flex-col items-center justify-center">
        <Card
          className={cn(
            'sm:bg-card w-full border-none bg-inherit px-2.5 py-1.5 sm:border-solid',
            maxWidth === 'sm' && 'max-w-sm',
            maxWidth === 'md' && 'max-w-md'
          )}
        >
          <Card.Header className="flex items-center justify-center">
            <Link className="flex items-center justify-center" to="/">
              <Logo className="m-1.5 h-auto w-16" />
            </Link>
            <Heading variant="h2">{title}</Heading>
          </Card.Header>
          <Card.Content>{children}</Card.Content>
          <Card.Footer className="text-muted-foreground flex justify-between">
            <LanguageToggle
              align="start"
              options={{
                en: 'English',
                fr: 'Français'
              }}
              triggerClassName="border p-2"
              variant="ghost"
            />
            <ThemeToggle className="border p-2" variant="ghost" />
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};
