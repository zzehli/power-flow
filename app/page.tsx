"use client";
import { MainNav } from "@/components/navigation/main-nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <Hero />
      </main>
    </div>
  );
}