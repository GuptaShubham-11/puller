import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { eq, count } from "drizzle-orm";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/database";
import { repositories } from "@/lib/database/schema";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get("page") ?? "1");
        const limit = Number(searchParams.get("limit") ?? "10");

        const offset = (page - 1) * limit;

        const connectedRepositories = await db
            .select({
                id: repositories.id,
                owner: repositories.owner,
                name: repositories.name,
                githubRepoId: repositories.githubRepoId,
                createdAt: repositories.createdAt,
            })
            .from(repositories)
            .where(eq(repositories.userId, session.user.id))
            .limit(limit)
            .offset(offset);

        const [{ total }] = await db
            .select({
                total: count(),
            })
            .from(repositories)
            .where(eq(repositories.userId, session.user.id));

        return NextResponse.json(
            {
                success: true,
                message: "Connected repositories fetched successfully",
                data: connectedRepositories,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}