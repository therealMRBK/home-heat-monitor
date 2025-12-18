import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ETAMenuNode } from '@/types/eta';
import { cn } from '@/lib/utils';
import { useVariable } from '@/hooks/useEtaData';

interface MenuNodeProps {
  node: ETAMenuNode;
  level: number;
  onSelectUri?: (uri: string, name: string) => void;
}

function MenuNode({ node, level, onSelectUri }: MenuNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 1);
  const hasChildren = node.children && node.children.length > 0;
  const isLeaf = !hasChildren;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-2 py-2 px-2 rounded-md cursor-pointer transition-colors',
          'hover:bg-muted/50',
          isLeaf && 'hover:bg-primary/10'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          } else if (onSelectUri) {
            onSelectUri(node.uri, node.name);
          }
        }}
      >
        {hasChildren ? (
          isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
          )
        ) : (
          <div className="w-4" />
        )}
        {hasChildren ? (
          <Folder className="h-4 w-4 text-primary shrink-0" />
        ) : (
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        <span className="text-sm truncate">{node.name}</span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child, index) => (
            <MenuNode key={`${child.uri}-${index}`} node={child} level={level + 1} onSelectUri={onSelectUri} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SelectedValueProps {
  uri: string;
  name: string;
}

function SelectedValue({ uri, name }: SelectedValueProps) {
  const { data: value, isLoading, refetch, isFetching } = useVariable(uri);

  return (
    <div className="p-4 bg-muted/50 rounded-lg mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <Button variant="ghost" size="sm" onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
        </Button>
      </div>
      {isLoading ? (
        <Skeleton className="h-6 w-20" />
      ) : value ? (
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">{value.strValue}</span>
          {value.unit && <span className="text-sm text-muted-foreground">{value.unit}</span>}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">Wert nicht verfügbar</span>
      )}
      <p className="text-xs text-muted-foreground mt-2 font-mono">{uri}</p>
    </div>
  );
}

interface MenuExplorerProps {
  menu: ETAMenuNode[];
  isLoading?: boolean;
}

export function MenuExplorer({ menu, isLoading }: MenuExplorerProps) {
  const [selectedUri, setSelectedUri] = useState<{ uri: string; name: string } | null>(null);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Menüstruktur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Menüstruktur erkunden</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto">
          {menu.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Keine Menüdaten verfügbar
            </p>
          ) : (
            menu.map((node, index) => (
              <MenuNode
                key={`${node.uri}-${index}`}
                node={node}
                level={0}
                onSelectUri={(uri, name) => setSelectedUri({ uri, name })}
              />
            ))
          )}
        </div>
        {selectedUri && <SelectedValue uri={selectedUri.uri} name={selectedUri.name} />}
      </CardContent>
    </Card>
  );
}
