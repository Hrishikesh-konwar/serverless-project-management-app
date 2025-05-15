import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET() {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
  
      return NextResponse.json({ users }, { status: 200 });
    } catch (err) {
      console.error("Signup error:", err);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
  }
  