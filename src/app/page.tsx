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
  
  if (isClient && activeTask) {
    return (
      <FocusTimer 
        task={activeTask}
        onStop={handleStopFocus}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Header />
        <main className="py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-light text-slate-800">
                My Focus Tasks
              </h1>
              <p className="text-slate-500 font-light mt-1">
                Create meaningful focus sessions with gentle reminders.
              </p>
            </div>
            <Button onClick={handleCreateTask} className="bg-primary hover:bg-primary/90 text-white rounded-lg px-6 py-2 font-light">
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
            <div className="text-center py-16 px-6 rounded-lg bg-white/50 border border-dashed">
              <p className="text-slate-500 text-lg font-light">Loading your focus tasks...</p>
            </div>
          )}
        </main>
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onOpenChange={(isOpen) => {
            if (!isOpen) setTaskToEdit(null);
            setIsFormOpen(isOpen);
        }}
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
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}