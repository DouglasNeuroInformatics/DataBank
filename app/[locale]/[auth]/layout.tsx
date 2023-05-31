import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  params: any;
}

const AuthLayout = ({ children, params }: AuthLayoutProps) => {
  console.log(params);
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
