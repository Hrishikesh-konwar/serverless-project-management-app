/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// File: /src/app/api/signup/route.ts
import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id, status, priority, title, description, assigneeId, deadline, newStatus } = body;
        const payload = {
            status,
            priority,
            title,
            description,
            assigneeId,
            deadline
        };

        if (newStatus) {
            payload.status = newStatus;
          }

        const update = await db.task.update({
            where: { id },
            data: payload,
        });

        return NextResponse.json({ message: 'Updated' }, { status: 200 });
    } catch (err) {
        console.error("Update error:", err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
