
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Smartphone,
  Calendar,
  HelpCircle,
  Bell,
  Home,
  LayoutGrid,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AsianPaintsLogo from "./asian-paints-logo";
import Link from "next/link";
import Image from "next/image";

export default function Header() {

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link href="/" passHref>
               <AsianPaintsLogo className="h-6 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-muted-foreground">
              <Link href="/apps" className="hover:text-foreground transition-colors">
                <LayoutGrid size={20} />
              </Link>
              <div className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary text-xs text-white">
                  1
                </span>
              </div>
            </div>
            <Avatar className="h-9 w-9">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
