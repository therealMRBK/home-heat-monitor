import { Info, X, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { setDemoMode } from '@/lib/etaApi';

interface DemoModeBannerProps {
  corsErrorDetected?: boolean;
  onRetryLive?: () => void;
}

export function DemoModeBanner({ corsErrorDetected, onRetryLive }: DemoModeBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleRetryLive = () => {
    setDemoMode(false);
    onRetryLive?.();
    window.location.reload();
  };

  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">Demo-Modus aktiv:</span>{' '}
              {corsErrorDetected ? (
                <>
                  Automatisch aktiviert wegen CORS-Fehler. Die API ist nur aus deinem lokalen Netzwerk erreichbar.
                </>
              ) : (
                <>
                  Es werden simulierte Daten angezeigt. Gehe zu Einstellungen um den Live-Modus zu aktivieren.
                </>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {corsErrorDetected && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetryLive}
                className="shrink-0"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Live erneut versuchen
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed(true)}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
