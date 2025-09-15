"use client"

import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return "/auth/login";
    switch (user.role) {
      case "owner":
        return "/roles/owner/dashboard";
      case "staff":
        return "/roles/staff/dashboard";
      default:
        return "/roles/consumer/dashboard";
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-background border-b">
      <Link href="/">
        <Image src="/logo.svg" alt="Spaces Logo" width={100} height={28} />
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={getDashboardLink()}>Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
