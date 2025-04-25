// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export default withAuth(
//   function middleware(req: NextRequest) {
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token }) => !!token,
//     },
//   }
// );

export default function middleware() { }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };