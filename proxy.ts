import { NextRequest, NextResponse } from "next/server";
import { env } from "./lib/env";

export function proxy(request: NextRequest) {
    if (env.NODE_ENV === "development") {
        return NextResponse.next();
    }

    const { pathname } = request.nextUrl;
    const allowed =
        pathname === "/" ||
        pathname === "/join-waitlist" ||
        pathname.startsWith("/legal/");

    if (!allowed) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    ],
};