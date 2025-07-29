"use client";

import { type Task, type TaskPriority } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Play, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStart: (task: Task) => void;
  isTaskActive: boolean;
}

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-700",
  medium: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-700",
  high: "bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700",
};

export function TaskCard({ task, onEdit, onDelete, onStart, isTaskActive }: TaskCardProps) {
  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-lg">
      <CardHeader className="flex-row items-start gap-4">
        <div className="text-4xl">{task.emoji}</div>
        <div className="flex-grow">
          <CardTitle className="font-headline text-2xl">{task.title}</CardTitle>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary" className={cn("capitalize", priorityStyles[task.priority])}>
              {task.priority} Priority
            </Badge>
            {task.category && <Badge variant="outline">{task.category}</Badge>}
          </div>
        </div>
        <div className="relative">
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDelete(task)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription>{task.description || "No description provided."}</CardDescription>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onStart(task)} className="w-full" disabled={isTaskActive}>
          <Play className="mr-2 h-4 w-4" />
          {isTaskActive ? "A task is running" : "Start Focus"}
        </Button>
      </CardFooter>
    </Card>
  );
}
