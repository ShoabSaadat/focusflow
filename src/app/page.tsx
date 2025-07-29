"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { type Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { TaskList } from "@/components/task-list";
import { TaskForm } from "@/components/task-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { FocusTimer } from "@/components/focus-timer";

export default function Home() {
  const [isClient, setIsClient] = React.useState(false);
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [taskToEdit, setTaskToEdit] = React.useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCreateTask = () => {
    setTaskToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (task: Task) => {
    setTaskToDelete(task);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
      setTaskToDelete(null);
    }
  };

  const handleSaveTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    if (taskToEdit) {
      setTasks(
        tasks.map((task) =>
          task.id === taskToEdit.id ? { ...task, ...taskData } : task
        )
      );
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...taskData,
      };
      setTasks([newTask, ...tasks]);
    }
    setIsFormOpen(false);
    setTaskToEdit(null);
  };
  
  const handleStartTask = (task: Task) => {
    setActiveTask(task);
  }

  const handleStopFocus = () => {
    setActiveTask(null);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold font-headline text-foreground/80">
            My Tasks
          </h1>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
        
        {isClient ? (
          <TaskList
            tasks={tasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteRequest}
            onStart={handleStartTask}
            activeTaskId={activeTask?.id}
          />
        ) : (
          <div className="text-center py-16 px-6 rounded-lg bg-card border border-dashed">
            Loading tasks...
          </div>
        )}
      </main>

      <TaskForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your task
              &quot;{taskToDelete?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTaskToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isClient && activeTask && (
          <FocusTimer 
            task={activeTask}
            onStop={handleStopFocus}
          />
      )}
    </div>
  );
}
