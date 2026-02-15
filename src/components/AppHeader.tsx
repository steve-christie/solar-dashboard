import { Zap } from "lucide-react";

function AppHeader() {
  return (
    <header className="flex-shrink-0 flex justify-between items-center bg-card border-b border-border px-6 py-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-lg font-semibold">GivEnergy Dashboard</h1>
      </div>
    </header>
  );
}

export default AppHeader;

