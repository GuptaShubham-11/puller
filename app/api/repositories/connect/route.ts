import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { db } from "@/lib/database";
import { repositories } from "@/lib/database/schema";

import { connectRepositorySchema } from "@/lib/validators/reposiotry";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const parsed = connectRepositorySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                parsed.error.flatten(),
                { status: 400 }
            );
        }

        const { repoUrl, token } = parsed.data;

        // 1. Extract owner/repo from repoUrl
        const { owner, repo } = parseGithubRepo(repoUrl);

        // 2. Validate token with GitHub
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/vnd.github+json",
                },
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { message: "Invalid repository or GitHub token" },
                { status: 400 }
            );
        }

        const githubRepo = await response.json();

        // 3. Save into DB
        await db.insert(repositories).values({
            userId: session.user.id,
            githubRepoId: githubRepo.id,
            owner: githubRepo.owner,
            name: githubRepo.name,
            repoUrl,
            token
        });

        return NextResponse.json({
            success: true,
            message: "Your repository has been connected successfully",
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

function parseGithubRepo(url: string) {
    const match = url.match(
        /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git|\/)?$/
    );

    if (!match) {
        throw new Error("Invalid GitHub repository URL");
    }

    return {
        owner: match[1],
        repo: match[2],
    };
}