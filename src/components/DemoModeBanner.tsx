import { Info, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">Demo-Modus aktiv:</span> Es werden simulierte Daten angezeigt. 
              Die API unter <code className="px-1 py-0.5 bg-primary/10 rounded text-xs">pc.bravokilo.cloud</code> ist 
              durch Cloudflare geschützt und nur aus deinem lokalen Netzwerk erreichbar.
            </p>
          </div>
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
  );
}
