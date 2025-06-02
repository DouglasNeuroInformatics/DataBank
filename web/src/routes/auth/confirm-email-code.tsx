import { createFileRoute } from '@tanstack/react-router';

import { ConfirmEmailPage } from '@/features/auth/pages/ConfirmEmailPage';

export const Route = createFileRoute('/auth/confirm-email-code')({
  component: ConfirmEmailPage
});
