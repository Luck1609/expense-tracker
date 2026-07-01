import { Link } from '@inertiajs/react';
import { LayoutGrid, Plus, Wallet, Tags, HandCoins, ChartNoAxesCombined, Sparkles } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import categories from '@/routes/categories';
import income from '@/routes/income';
import insight from '@/routes/insight';
import report from '@/routes/report';
import transactions from '@/routes/transactions';
import { buttonVariants } from './ui/button';

const mainNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: dashboard(),
    icon: LayoutGrid,
  },
  {
    title: 'Transactions',
    href: transactions.index(),
    icon: HandCoins,
  },
  {
    title: 'Categories & Labels',
    href: categories.index(),
    icon: Tags,
  },
  {
    title: 'Income Sources',
    href: income.index(),
    icon: Wallet,
  },
  {
    title: 'AI Insight',
    href: insight.index(),
    icon: Sparkles,
  },
  {
    title: 'Report',
    href: report.index(),
    icon: ChartNoAxesCombined,
  },
];


export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarTrigger className="absolute top-7 -right-3 rounded-full" variant="default" />
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="#" prefetch>
                <AppLogo />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  variant="default"
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  <div className="flex gap-2 items-center">
                    <Plus className="size-5" />
                    Add Transaction
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
