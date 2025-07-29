export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  emoji: string;
  title: string;
  description?: string;
  interval: number; // in minutes
  category?: string;
  priority: TaskPriority;
  createdAt: string; // ISO string
}
