import { NextResponse } from 'next/server';
import { db } from '~/server/db';

export async function GET() {
  try {
    // Fetch only tasks where status is not 'done'
    const tasks = await db.task.findMany({
      where: {
        status: {
          not: 'done',
        },
      },
    });

    // Add assignee details to each task
    const tasksWithAssignees = await Promise.all(
      tasks.map(async (task) => {
        const user = await db.user.findUnique({
          where: { id: task.assigneeId },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });

        return {
          ...task,
          assignee: user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
              }
            : null,
        };
      })
    );

    return NextResponse.json({ tasks: tasksWithAssignees }, { status: 200 });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
