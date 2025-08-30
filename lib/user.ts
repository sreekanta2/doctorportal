// // middleware.ts
// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";
// import { UserRole } from "./types/common";

// const DASHBOARDS: Record<UserRole, string> = {
//   patient: "/patient/dashboard",
//   admin: "/admin/dashboard",
//   clinic: "/clinic/dashboard",
//   doctor: "/doctor/dashboard",
// };

// const PUBLIC_ROUTES = [
//   "/",
//   "/auth",
//   "/doctors",
//   "/clinics",
//   "/about",
//   "/contact",
//   "/services",
// ];

// // Define all protected route patterns
// const PROTECTED_ROUTE_PATTERNS = [
//   "/patient/",
//   "/admin/",
//   "/clinic/",
//   "/doctor/",
// ];

// const isPublicRoute = (pathname: string) =>
//   PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

// const isProtectedRoute = (pathname: string) =>
//   PROTECTED_ROUTE_PATTERNS.some((route) => pathname.startsWith(route));

// export default withAuth(
//   async function middleware(req) {
//     const { pathname } = req.nextUrl;
//     const { token } = req.nextauth;

//     // Redirect authenticated users away from auth pages
//     if (token && pathname.startsWith("/auth")) {
//       return NextResponse.redirect(
//         new URL(DASHBOARDS[token.role as UserRole], req.url)
//       );
//     }

//     // Handle protected routes (including all patient routes)
//     if (isProtectedRoute(pathname)) {
//       if (!token) {
//         const signInUrl = new URL("/auth/sign-in", req.url);
//         signInUrl.searchParams.set("callbackUrl", pathname);
//         return NextResponse.redirect(signInUrl);
//       }

//       // Check if user is trying to access their appropriate dashboard
//       const isDashboardRoute = Object.values(DASHBOARDS).some((path) =>
//         pathname.startsWith(path)
//       );

//       if (isDashboardRoute) {
//         const userDashboard = DASHBOARDS[token.role as UserRole];
//         if (!pathname.startsWith(userDashboard)) {
//           return NextResponse.redirect(new URL(userDashboard, req.url));
//         }
//       }

//       // Additional role-based access control for protected routes
//       if (pathname.startsWith("/patient") && token.role !== "patient") {
//         return NextResponse.redirect(
//           new URL(DASHBOARDS[token.role as UserRole], req.url)
//         );
//       }

//       if (pathname.startsWith("/admin") && token.role !== "admin") {
//         return NextResponse.redirect(
//           new URL(DASHBOARDS[token.role as UserRole], req.url)
//         );
//       }

//       if (pathname.startsWith("/clinic") && token.role !== "clinic") {
//         return NextResponse.redirect(
//           new URL(DASHBOARDS[token.role as UserRole], req.url)
//         );
//       }

//       if (pathname.startsWith("/doctor") && token.role !== "doctor") {
//         return NextResponse.redirect(
//           new URL(DASHBOARDS[token.role as UserRole], req.url)
//         );
//       }
//     }

//     return NextResponse.next();
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         // Allow public routes, require auth for protected routes
//         return (
//           isPublicRoute(req.nextUrl.pathname) ||
//           (isProtectedRoute(req.nextUrl.pathname) && !!token)
//         );
//       },
//     },
//   }
// );

// export const config = {
//   matcher: [
//     "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
//   ],
// };
