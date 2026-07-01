import type { ReactNode } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import Container from '@/components/container';
import { PopupProvider } from '@/contexts/popup-context';

export default function AppLayout({
  children,
}: { children: ReactNode }) {
  return (
    <PopupProvider>
      <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar" className="overflow-x-hidden">

          <Container>
            {children}
          </Container>
        </AppContent>
      </AppShell>
    </PopupProvider>
  );
}
