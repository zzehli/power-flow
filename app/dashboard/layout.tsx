import { Metadata } from "next";
import { MainNav } from "@/components/navigation/main-nav";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Dashboard - PresentAI",
  description: "Manage your AI-generated presentations",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      {children}
      <Footer />
    </div>
  );
}