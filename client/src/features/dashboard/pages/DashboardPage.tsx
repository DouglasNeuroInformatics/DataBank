import { Feed } from '../components/Feed';

import { Heading } from '@/components/Heading';

export const DashboardPage = () => {
  return (
    <div>
      <Heading title="Dashboard" />
      <div className="mx-auto mt-10 max-w-xl">
        <Feed />
      </div>
    </div>
  );
};
