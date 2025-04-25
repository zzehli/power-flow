import { Metadata } from "next";
import Link from "next/link";
import { Presentation } from "lucide-react";
import { SignInForm } from "@/components/auth/signin-form";

export const metadata: Metadata = {
  title: "Sign In - Point Flow",
  description: "Sign in to your Point Flow account",
};

export default function SignInPage() {
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
          <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card p-6 shadow sm:rounded-lg sm:px-12">
            <SignInForm />
          </div>
        </div>
      </div>
    </div>
  );
}