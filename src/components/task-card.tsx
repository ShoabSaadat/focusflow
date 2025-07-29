"use client";

import { type Task, type TaskPriority } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Play, Trash2, Clock, Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStart: (task: Task) => void;
  isTaskActive: boolean;
}

const priorityStyles: Record<TaskPriority, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-rose-100 text-rose-700",
};

const formatSeconds = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds} sec${seconds !== 1 ? 's' : ''}`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) {
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
  }
  return `${minutes}m ${remainingSeconds}s`;
};

const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
};

export function TaskCard({ task, onEdit, onDelete, onStart, isTaskActive }: TaskCardProps) {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col">
        <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3 flex-grow min-w-0">
                    <span className="text-3xl">{task.emoji}</span>
                    <CardTitle className="text-lg font-medium text-slate-700 line-clamp-1 flex-grow">
                      {task.title}
                    </CardTitle>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(task)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(task)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </CardHeader>
      
      <CardContent className="pt-0 flex-grow">
        <CardDescription className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
            {task.description || "No description provided."}
        </CardDescription>
        
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  {formatSeconds(task.interval)} intervals
                </div>
                <Badge className={`${priorityStyles[task.priority]} border-0 capitalize`}>
                  {task.priority}
                </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(task.createdAt)}
                </div>
                {task.category && <Badge variant="outline" className="text-xs capitalize">{task.category}</Badge>}
            </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button onClick={() => onStart(task)} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg py-2 font-light" disabled={isTaskActive}>
          <Play className="mr-2 h-4 w-4" />
          {isTaskActive ? "A task is running" : "Start Focus Session"}
        </Button>
      </CardFooter>
    </Card>
  );
}