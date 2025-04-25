import { MainNav } from "@/components/navigation/main-nav";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Presentation, Plus, Folder, Clock } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard - Point Flow",
  description: "Manage your AI-generated presentations",
};
export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto py-10">
        <p>page</p>
      </main>
    </div>
  )
}
// export default function DashboardPage() {
// return (
//   <div className="flex min-h-screen flex-col">
//     <main className="flex-1 container py-10">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//           <p className="text-muted-foreground">
//             Create and manage your presentations
//           </p>
//         </div>
//         <Button size="sm" className="flex items-center gap-2">
//           <Plus className="h-4 w-4" />
//           New Presentation
//         </Button>
//       </div>

//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         <Link href="/dashboard/empty">
//           <div className="group relative overflow-hidden rounded-lg border p-4 shadow-sm transition-all hover:shadow-md">
//             <div className="flex h-[180px] flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed p-10">
//               <div className="rounded-full bg-primary/10 p-3">
//                 <Plus className="h-5 w-5 text-primary" />
//               </div>
//               <p className="font-medium">Create presentation</p>
//             </div>
//           </div>
//         </Link>

//         <div className="group relative overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
//           <div className="flex flex-col">
//             <div className="h-[140px] rounded bg-gradient-to-br from-blue-500 to-purple-600"></div>
//             <div className="flex items-center justify-between mt-4">
//               <div>
//                 <h3 className="font-medium">Quarterly Review</h3>
//                 <p className="text-xs text-muted-foreground">May 15, 2025</p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Folder className="h-4 w-4" />
//                   <span className="sr-only">Folder</span>
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Presentation className="h-4 w-4" />
//                   <span className="sr-only">Presentation</span>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="group relative overflow-hidden rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
//           <div className="flex flex-col">
//             <div className="h-[140px] rounded bg-gradient-to-br from-green-500 to-teal-600"></div>
//             <div className="flex items-center justify-between mt-4">
//               <div>
//                 <h3 className="font-medium">Product Pitch</h3>
//                 <p className="text-xs text-muted-foreground">May 10, 2025</p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Folder className="h-4 w-4" />
//                   <span className="sr-only">Folder</span>
//                 </Button>
//                 <Button variant="ghost" size="icon" className="h-8 w-8">
//                   <Presentation className="h-4 w-4" />
//                   <span className="sr-only">Presentation</span>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-10">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-semibold">Recent Presentations</h2>
//           <Button variant="ghost" size="sm" className="gap-1">
//             <Clock className="h-4 w-4" />
//             View All
//           </Button>
//         </div>
//         <div className="rounded-lg border">
//           <div className="relative overflow-auto">
//             <table className="w-full caption-bottom text-sm">
//               <thead>
//                 <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
//                   <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
//                   <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Created</th>
//                   <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Modified</th>
//                   <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
//                   <td className="p-4 align-middle">Quarterly Review</td>
//                   <td className="p-4 align-middle">May 15, 2025</td>
//                   <td className="p-4 align-middle">2 days ago</td>
//                   <td className="p-4 align-middle">
//                     <Button variant="ghost" size="sm">
//                       Edit
//                     </Button>
//                   </td>
//                 </tr>
//                 <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
//                   <td className="p-4 align-middle">Product Pitch</td>
//                   <td className="p-4 align-middle">May 10, 2025</td>
//                   <td className="p-4 align-middle">1 week ago</td>
//                   <td className="p-4 align-middle">
//                     <Button variant="ghost" size="sm">
//                       Edit
//                     </Button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </main>
//   </div>
// );
// }