"use client";

import { type Task } from "@/types";
import { TaskCard } from "./task-card";
import { ScrollArea } from "./ui/scroll-area";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStart: (task: Task) => void;
  activeTaskId?: string;
}

export function TaskList({ tasks, onEdit, onDelete, onStart, activeTaskId }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-500 text-lg font-light mb-4">
          You have no focus tasks yet!
        </p>
        <p className="text-slate-400 text-sm">
          Click &quot;New Task&quot; to begin your focus journey.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStart={onStart}
              isTaskActive={!!activeTaskId}
            />
          ))}
        </div>
    </ScrollArea>
  );
}