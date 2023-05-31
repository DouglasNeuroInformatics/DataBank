import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="p-2 sm:w-96">{children}</div>
    </div>
  );
};

export default AuthLayout;
