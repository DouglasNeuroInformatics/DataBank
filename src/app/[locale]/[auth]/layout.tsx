import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
