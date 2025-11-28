
'use client';

import { usePathname } from 'next/navigation';
import NextLink from 'next/link';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { Home, Link as LinkIcon, LayoutGrid, Settings, ChevronsUpDown, FileText, Calendar, HardHat, BarChart, Shield, ListTodo, Building, Wrench, Lock, Cog } from 'lucide-react';
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

const setupItems = [
    { name: 'Enterprise Setup', href: '#', icon: Building },
    { name: 'System Setup', href: '#', icon: Wrench },
    { name: 'Security', href: '#', icon: Lock },
    { name: 'Module Setup', href: '#', icon: Cog },
]


export default function SidebarNav() {
  const pathname = usePathname();
  const [isModulesOpen, setIsModulesOpen] = useState(false);
  const [isSetupOpen, setIsSetupOpen] = useState(false);

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
                <NextLink href={item.href} legacyBehavior passHref>
                  <SidebarMenuSubButton isActive={pathname === item.href}>
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

       <Collapsible open={isSetupOpen} onOpenChange={setIsSetupOpen}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
             <SidebarMenuButton
              isActive={pathname.startsWith('/setup')}
              className="justify-start"
              tooltip="Setup"
            >
              <Settings />
              <span className="group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden">Setup</span>
              <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50 group-data-[state=expanded]:inline-flex group-data-[state=collapsed]:hidden" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>

        <CollapsibleContent>
           <SidebarMenuSub>
            {setupItems.map((item) => (
              <SidebarMenuSubItem key={item.name}>
                <NextLink href={item.href} legacyBehavior passHref>
                  <SidebarMenuSubButton isActive={pathname === item.href}>
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuSubButton>
                </NextLink>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>

    </SidebarMenu>
  );
}
