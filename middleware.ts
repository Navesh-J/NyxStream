// import withAuth from "next-auth/middleware";
// import { NextResponse } from "next/server";

// export default withAuth(
//   function middleware() {
//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized({ req, token }) {
//         const { pathname } = req.nextUrl;

//         // always allow auth routes and static assets
//         if (
//           pathname.startsWith("/api/auth") ||
//           pathname === "/login" ||
//           pathname === "/register"
//         ) {
//           return true;
//         }

//         // public home page
//         if (pathname === "/") {
//           return true;
//         }

//         // public GET to /api/video
//         if (pathname === "/api/video" && req.method === "GET") {
//           return true;
//         }

//         // everything else needs a valid token
//         return !!token;
//       },
//     },
//   }
// );

// export const config = {
//   matcher: [
//     // apply to all pages and API under /api, minus static files
//     "/((?!_next/static|_next/image|favicon.ico|public/).*)",
//   ],
// };

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const method = req.method;

  // Only protect POST /api/video
  if (pathname === "/api/video" && method === "POST") {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      // redirect to login if unauthenticated
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // All other routes—including GET /api/video—bypass auth
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/video"],
};
