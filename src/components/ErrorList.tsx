import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ETAError } from '@/types/eta';
import { cn } from '@/lib/utils';

interface ErrorListProps {
  errors: ETAError[];
  isLoading?: boolean;
}

export function ErrorList({ errors, isLoading }: ErrorListProps) {
  const getPriorityIcon = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'error':
      case 'high':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-info" />;
    }
  };

  const getPriorityBg = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'error':
      case 'high':
        return 'bg-destructive/10 border-destructive/30';
      case 'warning':
      case 'medium':
        return 'bg-warning/10 border-warning/30';
      default:
        return 'bg-info/10 border-info/30';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-5 w-5" />
            Systemmeldungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
          Systemmeldungen
          {errors.length > 0 && (
            <span className="ml-auto text-sm font-normal text-muted-foreground">
              {errors.length} {errors.length === 1 ? 'Meldung' : 'Meldungen'}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errors.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Keine aktiven Meldungen</p>
          </div>
        ) : (
          <div className="space-y-2">
            {errors.map((error, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border',
                  getPriorityBg(error.priority)
                )}
              >
                {getPriorityIcon(error.priority)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{error.msg}</p>
                  <p className="text-xs text-muted-foreground mt-1">{error.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
