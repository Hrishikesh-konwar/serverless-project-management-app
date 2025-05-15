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
import type { Task } from "./task";

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
        setTasks(data.tasks);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      }
    };

    void fetchTasks();
  }, []);


  const handleEditTask = (task: Task) => {
    console.log(task);
    setEditingTask(task)
    setIsModalOpen(true)
  };

  const handleStatusChange = async (task: Task, status: string) => {
    try {
      const apiResponse = await fetch("/api/update-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, newStatus: status }),
      });

      if(apiResponse.ok){
        alert("Task created successfully!");
        window.location.reload();
      }

    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const todoTasks = tasks?.filter((task) => task.status === "todo");
  const inProgressTasks = tasks?.filter(
    (task) => task.status === "in_progress",
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
          { value: "in_progress", tasks: inProgressTasks ?? [] },
          { value: "done", tasks: doneTasks ?? [] },
        ].map(({ value, tasks }) => (
          <TabsContent key={value} value={value} className="mt-6">
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onStatusChange={handleStatusChange}
            />
          </TabsContent>
        ))}
      </Tabs>

      <TaskModal open={isModalOpen} onOpenChange={setIsModalOpen} selectedTask={editingTask}/>
    </div>
  );
}
