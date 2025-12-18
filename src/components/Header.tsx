import { Flame, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from './StatusBadge';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isOnline: boolean;
  isLoading: boolean;
  lastUpdate?: Date | null;
  onRefresh: () => void;
}

export function Header({ isOnline, isLoading, lastUpdate, onRefresh }: HeaderProps) {
  const formatLastUpdate = (date: Date | null | undefined) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-warm shadow-glow">
              <Flame className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Heizungsmonitor</h1>
              <p className="text-xs text-muted-foreground">ETA Heizungssteuerung</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-success" />
              ) : (
                <WifiOff className="h-4 w-4 text-destructive" />
              )}
              <span>Zuletzt: {formatLastUpdate(lastUpdate)}</span>
            </div>
            
            <StatusBadge status={isOnline ? 'online' : 'offline'} />
            
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
              <span className="hidden sm:inline">Aktualisieren</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
