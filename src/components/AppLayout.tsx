import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import type { ProjectType } from '../types';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  // Determine default project type based on route
  let defaultType: ProjectType | undefined;
  if (location.pathname.startsWith('/long-term')) {
    defaultType = 'long-term';
  } else if (location.pathname.startsWith('/short-term')) {
    defaultType = 'short-term';
  } else if (location.pathname.startsWith('/chores')) {
    defaultType = 'chores';
  }

  // Show TopBar on pages that can add projects (except overview)
  const showTopBar = ['/long-term', '/short-term', '/chores'].includes(location.pathname);

  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {showTopBar && <TopBar defaultType={defaultType} />}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
