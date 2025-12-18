import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'active' | 'idle';
  label?: string;
  pulse?: boolean;
}

export function StatusBadge({ status, label, pulse = true }: StatusBadgeProps) {
  const statusConfig = {
    online: { color: 'bg-success', text: 'Online' },
    offline: { color: 'bg-destructive', text: 'Offline' },
    warning: { color: 'bg-warning', text: 'Warnung' },
    active: { color: 'bg-primary', text: 'Aktiv' },
    idle: { color: 'bg-muted-foreground', text: 'Standby' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        {pulse && status !== 'offline' && (
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              config.color
            )}
          />
        )}
        <span className={cn('relative inline-flex rounded-full h-3 w-3', config.color)} />
      </span>
      <span className="text-sm font-medium text-foreground">
        {label || config.text}
      </span>
    </div>
  );
}
