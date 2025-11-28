
'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Home, Link as LinkIcon, LayoutGrid, Settings, ChevronsUpDown, FileText, Calendar, HardHat, ClipboardCheck, BarChart, Shield, ListTodo } from 'lucide-react';
import IdeagenLogo from '@/components/ideagen-logo';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';

const modules = [
  { name: 'Inspections & Audits', href: '#', icon: FileText },
  { name: 'Calendar', href: '#', icon: Calendar },
  { name: 'Incident Management', href: '#', icon: HardHat },
  { name: 'Performance Management', href: '#', icon: BarChart },
  { name: 'Risk Assessment', href: '#', icon: Shield },
  { name: 'Task Management', href: '#', icon: ListTodo },
];


export default function SidebarNav() {
  const pathname = usePathname();
  const [isModulesOpen, setIsModulesOpen] = useState(false);

  const menuItems = [
    { href: '/', icon: Home, label: 'Home', tooltip: 'Home' },
    { href: '/apps', icon: LinkIcon, label: 'Apps', tooltip: 'Apps' },
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
      
      <SidebarMenuItem>
          <NextLink href={'/'} legacyBehavior={false}>
            <SidebarMenuButton as="a" tooltip={'Home'} isActive={pathname === '/'} className="justify-start">
              <Home />
              <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Home</span>
            </SidebarMenuButton>
          </NextLink>
      </SidebarMenuItem>

      <Collapsible open={isModulesOpen} onOpenChange={setIsModulesOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
             <SidebarMenuButton
              isActive={pathname.startsWith('/modules')}
              className="justify-start"
              tooltip="Modules"
            >
              <LayoutGrid />
              <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Modules</span>
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>

        <CollapsibleContent>
           <SidebarMenuSub>
            {modules.map((item) => (
              <SidebarMenuSubItem key={item.name}>
                <NextLink href={item.href} legacyBehavior={false}>
                  <SidebarMenuSubButton as="a" isActive={pathname === item.href}>
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuSubButton>
                </NextLink>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
      
      <SidebarMenuItem>
          <NextLink href={'/apps'} legacyBehavior={false}>
            <SidebarMenuButton as="a" tooltip={'Apps'} isActive={pathname === '/apps'} className="justify-start">
              <LinkIcon />
              <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Apps</span>
            </SidebarMenuButton>
          </NextLink>
      </SidebarMenuItem>

       <SidebarMenuItem>
          <NextLink href={'/setup'} legacyBehavior={false}>
            <SidebarMenuButton as="a" tooltip={'Setup'} isActive={pathname === '/setup'} className="justify-start">
              <Settings />
              <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Setup</span>
            </SidebarMenuButton>
          </NextLink>
      </SidebarMenuItem>

    </SidebarMenu>
  );
}
