import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { count } from 'drizzle-orm';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/database';
import { waitlist } from '@/lib/database/schema';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'superadmin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '10');

    const offset = (page - 1) * limit;

    const joinedUsers = await db.select().from(waitlist).limit(limit).offset(offset);

    const [{ total }] = await db
      .select({
        total: count(),
      })
      .from(waitlist);

    return NextResponse.json(
      {
        success: true,
        message: 'Waitlist fetched successfully',
        data: joinedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
