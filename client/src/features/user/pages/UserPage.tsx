import { useAuthStore } from '@/stores/auth-store';

export const UserPage = () => {
  const auth = useAuthStore();

  return (
    <div>
      <h1>{auth.currentUser?.firstName + ' ' + auth.currentUser?.lastName}</h1>
    </div>
  );
};
