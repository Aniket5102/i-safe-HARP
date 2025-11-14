
'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Home, Link, LayoutGrid, PenSquare, Settings } from 'lucide-react';
import IdeagenLogo from '@/components/ideagen-logo';

export default function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', icon: Home, label: 'Home', tooltip: 'Home' },
    { href: '/modules', icon: LayoutGrid, label: 'Modules', tooltip: 'Modules' },
    { href: '/apps', icon: Link, label: 'Apps', tooltip: 'Apps' },
    { href: '/setup', icon: Settings, label: 'Setup', tooltip: 'Setup' },
  ];

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton tooltip="Ideagen" isActive={false} className="justify-start">
          <IdeagenLogo className="h-6 w-6" />
          <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Ideagen...</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <NextLink href={item.href} legacyBehavior={false}>
            <SidebarMenuButton as="a" tooltip={item.tooltip} isActive={pathname === item.href} className="justify-start">
              <item.icon />
              <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">{item.label}</span>
            </SidebarMenuButton>
          </NextLink>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
