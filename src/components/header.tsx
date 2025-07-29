import { Waves } from 'lucide-react';

export function Header() {
  return (
    <header className="py-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Waves className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-light text-slate-800">
              FocusFlow
            </h1>
        </div>
    </header>
  );
}