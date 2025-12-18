import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ParameterRowProps {
  label: string;
  value?: string | number;
  unit?: string;
  isLoading?: boolean;
  highlight?: boolean;
}

export function ParameterRow({ 
  label, 
  value, 
  unit, 
  isLoading = false,
  highlight = false 
}: ParameterRowProps) {
  return (
    <div className={cn(
      'flex items-center justify-between py-3 border-b border-border/50 last:border-0',
      highlight && 'bg-primary/5 -mx-4 px-4 rounded-lg'
    )}>
      <span className="text-sm text-muted-foreground">{label}</span>
      {isLoading ? (
        <Skeleton className="h-5 w-16" />
      ) : (
        <span className="text-sm font-semibold text-foreground">
          {value ?? '--'}
          {unit && <span className="text-muted-foreground ml-1">{unit}</span>}
        </span>
      )}
    </div>
  );
}
