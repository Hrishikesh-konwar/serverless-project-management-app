/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from "next/server"
import { db } from '~/server/db';

type Task = {
  title: string
  description?: string
  assigneeId: string
  deadline: string
  priority: "low" | "medium" | "high" | "critical"
  status: "todo" | "in_progress" | "done"
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Task

    const { title, description, assigneeId, deadline, priority, status } = body

    // Basic validation
    if (!title || !assigneeId || !priority || !status || !deadline) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const deadlineDate = new Date(deadline)
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json({ message: "Invalid deadline date" }, { status: 400 })
    }

    const newTask = await db.task.create({
      data: {
        title,
        description,
        assigneeId,
        deadline: deadlineDate,
        priority,
        status,
      },
    })

    return NextResponse.json({ message: "Task created", task: newTask }, { status: 201 })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
