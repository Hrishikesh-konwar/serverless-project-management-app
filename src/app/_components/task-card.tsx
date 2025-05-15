"use client";

import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Calendar, Tag } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import type { Task, TaskStatus } from "./task";

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onStatusChange: (newStatus: string) => void
}

export default function TaskCard({
  task,
  onEdit,
  onStatusChange,
}: TaskCardProps) {
  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-800",
    "in_progress": "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
  };

  const getStatusLabel = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return status;
    }
  };

  const deadlineDate = new Date(task.deadline);
  const isPastDeadline = deadlineDate < new Date() && task.status !== "done";

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="text-lg leading-tight font-semibold">{task.title}</h3>
          <div className="flex flex-wrap gap-1">
            <Badge
              variant="outline"
              className={
                priorityColors[task.priority as keyof typeof priorityColors]
              }
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge
              variant="outline"
              className={statusColors[task.status as keyof typeof statusColors]}
            >
              {getStatusLabel(task.status)}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only bg-white">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='bg-white' align="end">
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("deleted")}>Delete</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("todo")}>
              Mark as To Do
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusChange("in_progress")}
            >
              Mark as In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("done")}>
              Mark as Done
            </DropdownMenuItem>{" "}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3 text-sm">
          {task.description}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span
            className={`text-xs ${isPastDeadline ? "font-medium text-red-500" : "text-muted-foreground"}`}
          >
            {isPastDeadline ? "Overdue: " : "Due: "}
            {formatDistanceToNow(deadlineDate, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 bg-white">
            <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium">{task.assignee.name}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
