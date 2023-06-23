import { Heading } from '@/components/Heading';
import { withTransition } from '@/utils/withTransition';

export const DashboardPage = withTransition(() => {
  return (
    <div>
      <Heading title="Dashboard" />
    </div>
  );
});
