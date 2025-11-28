
"use client";

import Image from "next/image";
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
import ISafeLogo from "./i-safe-logo";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <AsianPaintsLogo />
              <ISafeLogo />
              <span className="text-lg font-light text-gray-600 tracking-wider">
                i-safe
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Select>
              <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                <SelectValue placeholder="Need Assistance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faq">FAQ</SelectItem>
                <SelectItem value="contact">Contact Us</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-3 text-gray-500">
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
            <div className="text-sm text-gray-600">
              Asian Paints Limited (APL)
            </div>
            <Avatar className="h-9 w-9">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback className="bg-cyan-200 text-cyan-800 font-bold">AK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <div className="bg-[#2d8b8b] h-12 flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-white">
            <LayoutGrid size={20} />
            <span className="font-medium">Apps</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white text-xs">powered by</span>
            <span className="text-white font-semibold">Asian Paints - Systems</span>
          </div>
        </div>
      </div>
    </header>
  );
}
