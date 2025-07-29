import { Waves } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-card border-b py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="flex items-center gap-2">
            <Waves className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-headline">
              FocusFlow
            </h1>
        </div>
      </div>
    </header>
  );
}
