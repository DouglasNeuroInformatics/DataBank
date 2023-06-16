import { Link } from 'react-router-dom';

import { ThemeToggle } from '@/components';

export const LandingPage = () => {
  return (
    <>
      <header className="bg-white p-2 shadow dark:bg-slate-800">
        <div className="container flex justify-between">
          <img alt="logo" className="h-10" src="/logo.png" />
          <div>
            <nav>
              <Link to="/login">Login</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <h1>Landing Page</h1>
    </>
  );
};
