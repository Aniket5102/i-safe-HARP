
'use client';

import { Bell, LayoutGrid, Moon, Sun } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

export default function Header() {
  const { user, logout } = useAuth();
  const { setTheme, theme } = useTheme();

  return (
    <header className="bg-background shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
             <Link href="/" passHref>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <Image src="/asian-paints-logo.png" alt="Asian Paints Logo" width={80} height={50} />
                        <span className="text-2xl font-bold text-primary">i-Safe</span>
                    </div>
                </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">{user.employeeId}</span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="px-2 py-1.5">
                      <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>{user.role}</Badge>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <div className="flex items-center justify-between w-full gap-2">
                            <Label htmlFor="theme-toggle" className="flex items-center gap-2 cursor-pointer">
                                {theme === 'dark' ? <Moon /> : <Sun />}
                                <span>Theme</span>
                            </Label>
                            <Switch
                                id="theme-toggle"
                                checked={theme === 'dark'}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                            />
                        </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Log Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
