/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// File: /src/app/api/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '~/server/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password as string, 10);

    const userData = {
      name,
      email,
      hashedPassword,
    }
    await db.user.create({
      data: userData,
    });

    return NextResponse.json({ message: 'User created' }, { status: 200 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
