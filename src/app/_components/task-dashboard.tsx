/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useEffect, useState } from "react";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent } from "./ui/tabs";
import TaskList from "./task-list";
import TaskModal from "./task-modal";
import type { Task, TaskStatus } from "./task";

// Mock data
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    assigneeId: "45678das67",
    description:
      "Create wireframes and mockups for the new marketing landing page",
    assignee: {
      id: "user1",
      name: "Alex Johnson",
      email: "alex.Johnson",
    },
    deadline: new Date("2025-06-15"),
    priority: "high",
    status: "in-progress",
    tags: ["design", "marketing"],
    createdAt: new Date("2025-05-10"),
  },
  {
    id: "2",
    assigneeId: "45678das67",
    title: "Implement authentication flow",
    description: "Add login, registration, and password reset functionality",
    assignee: {
      id: "user2",
      name: "Sam Taylor",
      email: "alex.Johnson",
    },
    deadline: new Date("2025-05-30"),
    priority: "high",
    status: "todo",
    tags: ["development", "security"],
    createdAt: new Date("2025-05-08"),
  },
  {
    id: "3",
    assigneeId: "45678das67",
    title: "Write API documentation",
    description: "Document all API endpoints for the developer portal",
    assignee: {
      id: "user3",
      name: "Jamie Rivera",
      email: "alex.Johnson",
    },
    deadline: new Date("2025-06-10"),
    priority: "medium",
    status: "todo",
    tags: ["documentation", "api"],
    createdAt: new Date("2025-05-12"),
  },
  {
    id: "4",
    assigneeId: "45678das67",
    title: "Fix payment processing bug",
    description:
      "Investigate and resolve the issue with payment failures on mobile devices",
    assignee: {
      id: "user1",
      name: "Alex Johnson",
      email: "alex.Johnson",
    },
    deadline: new Date("2025-05-20"),
    priority: "critical",
    status: "todo",
    tags: ["bug", "payments"],
    createdAt: new Date("2025-05-14"),
  },
  {
    id: "5",
    assigneeId: "45678das67",
    title: "Quarterly analytics report",
    description:
      "Compile Q2 analytics data and prepare report for stakeholders",
    assignee: {
      id: "user4",
      name: "Morgan Chen",
      email: "alex.Johnson",
    },
    deadline: new Date("2025-06-30"),
    priority: "medium",
    status: "done",
    tags: ["analytics", "reporting"],
    createdAt: new Date("2025-05-05"),
  },
];

export default function TaskDashboard() {
  // const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[] | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/get-tasks");
        const data = await res.json();
        console.log("task", data.tasks);
        setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      }
    };

    void fetchTasks();
  }, []);

  const handleDeleteTask = (taskId: string) => {
    console.log(taskId);
    // setTasks(tasks?.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const todoTasks = tasks?.filter((task) => task.status === "todo");
  const inProgressTasks = tasks?.filter(
    (task) => task.status === "in-progress",
  );
  const doneTasks = tasks?.filter((task) => task.status === "done");

  return (
    <div className="absolute h-[70vh] w-[90vw] space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Project Management App</h1>
        <Button
          className="border border-white"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" /> New Task
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        {[
          { value: "all", tasks: tasks ?? [] },
          { value: "todo", tasks: todoTasks ?? [] },
          { value: "in-progress", tasks: inProgressTasks ?? [] },
          { value: "done", tasks: doneTasks ?? [] },
        ].map(({ value, tasks }) => (
          <TabsContent key={value} value={value} className="mt-6">
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={(taskId, newStatus) => {
                setTasks((prev) =>
                  prev
                    ? prev.map((task) =>
                        task.id === taskId
                          ? { ...task, status: newStatus as TaskStatus }
                          : task,
                      )
                    : [],
                );
              }}
            />
          </TabsContent>
        ))}
      </Tabs>

      <TaskModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
