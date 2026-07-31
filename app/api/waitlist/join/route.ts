import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/database';
import { waitlist } from '@/lib/database/schema';
import { joinWaitlistSchema } from '@/lib/validators/waitlist';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = joinWaitlistSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, email, source } = parsed.data;

    // 1. Check if already joined
    const existing = await db.select().from(waitlist).where(eq(waitlist.email, email));

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "You're already on the waitlist.",
        },
        { status: 409 }
      );
    }
    // 2. Insert into waitlist
    await db.insert(waitlist).values({
      name,
      email,
      source,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully joined the waitlist.',
      },
      { status: 201 }
    );
  } catch (error) {
    // console.error("Join waitlist error:", error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error.',
      },
      { status: 500 }
    );
  }
}
