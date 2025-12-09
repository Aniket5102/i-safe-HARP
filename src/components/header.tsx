
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
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <AsianPaintsLogo />
            <div className="flex items-center gap-2">
                <Image
                    src="/icons/i-safe-logo.png"
                    alt="i-safe Logo"
                    width={40}
                    height={40}
                />
                <span className="text-lg font-light text-gray-600 tracking-wider">
                    i-safe
                </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select>
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200 hidden md:flex">
                <SelectValue placeholder="Need Assistance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faq">FAQ</SelectItem>
                <SelectItem value="contact">Contact Us</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden md:flex items-center gap-3 text-gray-500">
              <Smartphone size={20} />
              <Calendar size={20} />
              <HelpCircle size={20} />
              <div className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  1
                </span>
              </div>
              <Home size={20} />
            </div>
            <div className="hidden lg:block text-sm text-gray-600">
              Asian Paints Limited (APL)
            </div>
            <Avatar className="h-9 w-9">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div
        className="bg-primary/90 text-primary-foreground"
      >
        <div className="container mx-auto px-4 flex justify-between items-center h-12">
            <Link href="/apps" className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary/100 transition-colors">
              <LayoutGrid size={20} />
              <span className="font-medium">Apps</span>
            </Link>
          <div className="flex items-center space-x-2">
            <span className="text-xs">powered by</span>
            <span className="font-semibold">Asian Paints - Systems</span>
          </div>
        </div>
      </div>
    </header>
  );
}
