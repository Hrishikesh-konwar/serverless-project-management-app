/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// File: /src/app/api/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '~/server/db';
import type { Prisma } from '@prisma/client'; // 👈 Import Prisma types

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, name, email, password, preference, changePassword } = body;

        const hashedPassword = await bcrypt.hash(password as string, 10);

        const payload: Prisma.UserUpdateInput = {
            name,
            email,
            preference,
          };
          if (changePassword) {
            payload.hashedPassword = hashedPassword;
          }
      
        await db.user.update({
            where: { id },
            data: payload,
        });


        return NextResponse.json({ message: 'User created' }, { status: 200 });
    } catch (err) {
        console.error("Signup error:", err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
