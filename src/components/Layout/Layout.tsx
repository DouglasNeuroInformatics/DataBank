import React from 'react';

import { HomeIcon } from '@heroicons/react/24/outline';

import { DesktopSidebar } from './DesktopSidebar';
import { MobileNavbar } from './MobileNavbar';

const navigation = [
  {
    label: 'Home',
    href: '#',
    icon: <HomeIcon />
  }
];

export interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen flex-col lg:flex-row">
      <DesktopSidebar navigation={navigation} />
      <MobileNavbar navigation={navigation} />
      <main className="container flex-grow border">{children}</main>
    </div>
  );

  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // return (
  //   <div className="flex h-screen">
  //     <MobileSidebar setShowMobileSidebar={setMobileMenuOpen} showMobileSidebar={mobileMenuOpen} />
  //     <DesktopSidebar />
  //     <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
  //       <MobileTopbar setShowMobileSidebar={setMobileMenuOpen} showMobileSidebar={mobileMenuOpen} />
  //       <main className="flex flex-1 overflow-hidden">
  //         {/* Primary column */}
  //         <section
  //           aria-labelledby="primary-heading"
  //           className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto lg:order-last"
  //         >
  //           <h1 className="sr-only" id="primary-heading">
  //             Account
  //           </h1>
  //           {/* Your content */}
  //         </section>

  //         {/* Secondary column (hidden on smaller screens) */}
  //         <aside className="hidden lg:order-first lg:block lg:flex-shrink-0">
  //           <div className="relative flex h-full w-96 flex-col overflow-y-auto border-r border-gray-200 bg-white">
  //             {children}
  //           </div>
  //         </aside>
  //       </main>
  //     </div>
  //   </div>
  // );
};
