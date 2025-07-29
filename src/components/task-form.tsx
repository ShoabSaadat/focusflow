"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { type Task, type SoundType, type TaskPriority } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSound } from "@/hooks/use-sound";
import { Volume2, Play } from "lucide-react";

interface TaskFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (task: Omit<Task, "id" | "createdAt">) => void;
  taskToEdit: Task | null;
}

const intervalOptions = [
  { value: 5, label: '5 seconds' },
  { value: 15, label: '15 seconds' },
  { value: 30, label: '30 seconds' },
  { value: 60, label: '1 minute' },
  { value: 120, label: '2 minutes' },
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 900, label: '15 minutes' },
  { value: 1200, label: '20 minutes' },
  { value: 1500, label: '25 minutes' },
  { value: 1800, label: '30 minutes' }
];

const soundOptions: {value: SoundType, label: string, description: string}[] = [
    { value: 'beep', label: 'Beep', description: 'Classic beep sound' },
    { value: 'chime', label: 'Chime', description: 'Soft chime sound' },
    { value: 'bell', label: 'Bell', description: 'Gentle bell sound' },
];

const priorityOptions: {value: TaskPriority, label: string}[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
];

const commonEmojis = ['✨', '📝', '💻', '📚', '🎯', '🧘', '💡', '🎨', '🏃', '🍎', '🌱', '🔬'];

const formSchema = z.object({
  emoji: z.string().min(1, 'Emoji is required.'),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  interval: z.coerce.number().min(1, { message: "Interval must be at least 1 second." }),
  category: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']),
  sound: z.enum(['beep', 'chime', 'bell']),
});

const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds > 1 ? 's' : ''}`;
};


export function TaskForm({ isOpen, onOpenChange, onSave, taskToEdit }: TaskFormProps) {
  const { playSound, ensureAudioReady } = useSound();
  const [isPlaying, setIsPlaying] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emoji: '✨',
      title: '',
      description: '',
      interval: 300,
      category: 'Work',
      priority: 'medium',
      sound: 'beep',
    },
  });
  
  const selectedSound = form.watch('sound');
  const selectedInterval = form.watch('interval');

  React.useEffect(() => {
    if (taskToEdit) {
      form.reset(taskToEdit);
    } else {
      form.reset({
        emoji: '✨',
        title: '',
        description: '',
        interval: 300,
        category: 'Work',
        priority: 'medium',
        sound: 'beep',
      });
    }
  }, [taskToEdit, form, isOpen]);
  
  const handlePreviewSound = async (soundType: SoundType) => {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      await ensureAudioReady();
      await playSound(soundType);
    } catch (error) {
      console.error('Error previewing sound:', error);
    } finally {
      setTimeout(() => setIsPlaying(false), 1000);
    }
  };


  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-light text-slate-700">{taskToEdit ? "Edit Task" : "Create New Task"}</DialogTitle>
          <DialogDescription>
            {taskToEdit ? "Update the details of your task." : "Fill out the form to create a new focus task."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-600">Task Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Work on my project" {...field} className="border-slate-200 focus:border-primary/50 focus:ring-primary/20"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="text-sm font-medium text-slate-600">Choose an Emoji</FormLabel>
              <Controller
                name="emoji"
                control={form.control}
                render={({ field }) => (
                  <div className="grid grid-cols-6 gap-2">
                    {commonEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => field.onChange(emoji)}
                        className={`p-2 text-2xl rounded-lg border-2 transition-colors ${
                          field.value === emoji
                            ? 'border-primary/50 bg-primary/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              />
               <FormMessage />
            </FormItem>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-600">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your task in a few words..." {...field} className="border-slate-200 focus:border-primary/50 focus:ring-primary/20 resize-none" rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-600">Reminder Interval</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} value={String(field.value)}>
                    <FormControl>
                      <SelectTrigger className="border-slate-200 focus:border-primary/50">
                        <SelectValue placeholder="Select an interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {intervalOptions.map((option) => (
                        <SelectItem key={option.value} value={String(option.value)}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">
                    You'll get a gentle reminder every {formatSeconds(selectedInterval)}.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sound"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-600">Reminder Sound</FormLabel>
                   <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="flex-1 border-slate-200 focus:border-primary/50">
                          <SelectValue placeholder="Select a sound" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {soundOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                             <div className="flex items-center gap-3">
                                <Volume2 className="w-4 h-4 text-slate-500" />
                                <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-xs text-slate-500">{option.description}</div>
                                </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      type="button" 
                      variant="outline"
                      size="icon"
                      onClick={() => handlePreviewSound(selectedSound)}
                      disabled={isPlaying}
                      className="px-3"
                    >
                        <Play className="h-4 w-4" />
                        <span className="sr-only">Preview sound</span>
                    </Button>
                   </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-600">Category</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Work, Study" {...field} value={field.value || ''} className="border-slate-200 focus:border-primary/50 focus:ring-primary/20"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-600">Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-slate-200 focus:border-primary/50">
                          <SelectValue placeholder="Select a priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="flex-1">
                      Cancel
                    </Button>
                </DialogClose>
                <Button type="submit" className="flex-1 bg-primary text-white hover:bg-primary/90" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                    {taskToEdit ? "Update Task" : "Create Task"}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}