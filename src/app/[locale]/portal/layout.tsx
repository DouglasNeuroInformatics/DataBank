import React from 'react';

interface PortalLayoutProps {
  children: React.ReactNode;
}

const PortalLayout = ({ children }: PortalLayoutProps) => {
  return <div>{children}</div>;
};

export default PortalLayout;
