"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Presentation, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/navigation/user-nav";
import { useSession } from "next-auth/react";

export function MainNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const routes = [
    {
      href: "/",
      label: "Home",
      active: pathname === "/",
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-stone-900/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <img
            src="/images/presentation-emoji-1583836-1344298.png"
            alt="Point Flow icon"
            className="h-6 w-6"
          />
          <span className="hidden font-bold sm:inline-block">
            Point Flow
          </span>
        </div>
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex items-center space-x-6 text-sm font-medium ml-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  route.active ? "text-foreground" : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            {session ? (
              <>
                <UserNav />
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:hidden">
          {session ? (
            <UserNav />
          ) : (
            <Link href="/auth/signin">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-top md:hidden bg-background border-t">
            <div className="relative z-20 grid gap-6 p-4 rounded-md">
              <nav className="grid grid-flow-row auto-rows-max text-sm">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center py-2 transition-colors hover:text-foreground/80",
                      route.active ? "text-foreground" : "text-foreground/60"
                    )}
                    onClick={closeMenu}
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}