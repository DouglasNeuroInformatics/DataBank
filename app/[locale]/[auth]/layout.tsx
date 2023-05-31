import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="flex h-screen w-screen items-center justify-center">{children}</div>
);

export default AuthLayout;
