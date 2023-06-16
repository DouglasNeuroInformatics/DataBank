import { ThemeToggle } from '@/components';

export const LandingPage = () => {
  return (
    <>
      <header className="bg-white p-2 shadow">
        <div className="container flex justify-between">
          <img alt="logo" className="h-10" src="/logo.png" />
          <ThemeToggle />
        </div>
      </header>
      <h1>Landing Page</h1>
    </>
  );
};
