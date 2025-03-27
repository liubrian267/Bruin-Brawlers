import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt, SessionPayload } from "./utils/jwt";


const protectedRoutes = [
  "/profile",
  "/feed",
  "/editPosts",
  "/edit-profile",
  "/create",
  "/search",
  "/leaderboard",
];
const publicRoutes = ["/","/login", "/signup"];


export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname; 
    const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith("/profile/");
    const isPublicRoute = publicRoutes.includes(path);

    const cookieStore = await cookies()
    const cookie = cookieStore.get("session")?.value as string;
    const session: SessionPayload | undefined = await decrypt(cookie);

    //console.log("Session", session);
    const response = NextResponse.next();
    //create a cookie for the brawlID: 
    if (session?.brawlId) {
        response.cookies.set("brawlID", session.brawlId, {
          httpOnly: false, // Allow client-side access
          path: "/", // Available across all pages
          sameSite: "strict",
          maxAge: 3600, // 1 hour expiration (optional)
        });
        //return response;
      }
    if (isProtectedRoute && !session?.userId){
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    if(isPublicRoute && session?.userId){
        return NextResponse.redirect(new URL("/feed", req.nextUrl));
    }
    
    

    return response;
}