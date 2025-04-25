import { Metadata } from "next";
import Link from "next/link";
import { Presentation, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Authentication Error - Point Flow",
  description: "There was an error with your authentication",
};

export default function AuthErrorPage() {
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
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight">
              Authentication Error
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground max-w-sm">
              There was a problem authenticating your account. Please try again or contact support if the problem persists.
            </p>
          </div>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex flex-col items-center space-y-4">
            <Link href="/auth/signin">
              <Button>Try again</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">Return to home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}