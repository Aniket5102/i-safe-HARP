
'use client';

import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from './ui/button';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export default function AuthButton() {
  const auth = useAuth();
  const { user, loading } = useUser();
  const router = useRouter();

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
      router.push('/login');
    }
  };

  const handleSignIn = () => {
    router.push('/login');
  };

  if (loading) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  if (!user) {
    return (
      <Button variant="outline" onClick={handleSignIn}>
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-9 w-9 cursor-pointer">
          {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
          <AvatarFallback className="bg-primary/20 text-primary font-bold">
            {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>{user.displayName}</DropdownMenuItem>
        <DropdownMenuItem disabled className="text-xs text-muted-foreground -mt-2">{user.email}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
