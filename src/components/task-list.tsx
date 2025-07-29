"use client";

import { type Task } from "@/types";
import { TaskCard } from "./task-card";
import Image from "next/image";

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
      <div className="text-center py-16 px-6 rounded-lg bg-card border border-dashed">
        <Image 
            src="https://placehold.co/300x200.png"
            alt="An illustration showing a person relaxing"
            width={300}
            height={200}
            className="mx-auto mb-6 rounded-lg"
            data-ai-hint="illustration serene"
        />
        <h2 className="text-2xl font-semibold font-headline text-foreground/80">You have no tasks yet!</h2>
        <p className="mt-2 text-muted-foreground">
          Click &quot;New Task&quot; to create your first focus session.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
}
