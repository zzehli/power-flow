"use client";

import { Metadata } from "next";
import Link from "next/link";
import { Presentation, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <Presentation className="h-8 w-8" />
              <span className="font-bold text-xl">Point Flow</span>
            </Link>
          </div>
          <div className="mt-8 flex flex-col items-center">
            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
              <LogOut className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight">
              Sign out of your account
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Are you sure you want to sign out?
            </p>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex flex-col items-center space-y-4">
            <Button onClick={handleSignOut} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing out...
                </>
              ) : (
                <>Sign out</>
              )}
            </Button>
            <Link href="/dashboard">
              <Button variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}