export type TaskPriority = "low" | "medium" | "high" | "critical"
export type TaskStatus = "todo" | "in_progress" | "done"

export interface Task {
  id: string
  title: string
  description: string
  assigneeId: string
  assignee: {
    id: string
    name: string
    email: string
  }
  deadline: Date
  priority: TaskPriority
  status: TaskStatus
  tags: string[]
  createdAt: Date
}
