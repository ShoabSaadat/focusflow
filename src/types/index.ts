export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  emoji: string;
  title: string;
  description?: string;
  interval: number; // in seconds
  category?: string;
  priority: TaskPriority;
  createdAt: string; // ISO string
}
