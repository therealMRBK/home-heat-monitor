import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, RotateCcw, Plus, Trash2, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { loadConfig, saveConfig, DEFAULT_URIS, AppConfig, HeatingUri } from '@/lib/configStore';

const CATEGORIES = [
  { value: 'kessel', label: 'Kessel' },
  { value: 'puffer', label: 'Puffer' },
  { value: 'warmwasser', label: 'Warmwasser' },
  { value: 'heizkreis', label: 'Heizkreis' },
  { value: 'pellet', label: 'Pellet' },
  { value: 'sonstige', label: 'Sonstige' },
] as const;

export default function Settings() {
  const [config, setConfig] = useState<AppConfig>(loadConfig);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const savedConfig = loadConfig();
    setConfig(savedConfig);
  }, []);

  const handleSave = () => {
    saveConfig(config);
    setHasChanges(false);
    toast({
      title: 'Konfiguration gespeichert',
      description: 'Laden Sie die Seite neu, um die Änderungen zu übernehmen.',
    });
  };

  const handleReset = () => {
    const defaultConfig: AppConfig = {
      apiUrl: 'https://pc.bravokilo.cloud',
      demoMode: true,
      uris: DEFAULT_URIS,
    };
    setConfig(defaultConfig);
    setHasChanges(true);
  };

  const updateUri = (index: number, field: keyof HeatingUri, value: string) => {
    const newUris = [...config.uris];
    newUris[index] = { ...newUris[index], [field]: value };
    setConfig({ ...config, uris: newUris });
    setHasChanges(true);
  };

  const addUri = () => {
    const newUri: HeatingUri = {
      id: `custom_${Date.now()}`,
      label: 'Neuer Parameter',
      uri: '/112/10021/0/0/12000',
      category: 'sonstige',
    };
    setConfig({ ...config, uris: [...config.uris, newUri] });
    setHasChanges(true);
  };

  const removeUri = (index: number) => {
    const newUris = config.uris.filter((_, i) => i !== index);
    setConfig({ ...config, uris: newUris });
    setHasChanges(true);
  };

  const groupedUris = CATEGORIES.map(cat => ({
    ...cat,
    uris: config.uris.map((uri, index) => ({ ...uri, index })).filter(u => u.category === cat.value),
  }));

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Einstellungen</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>API-Verbindung</CardTitle>
            <CardDescription>
              Konfigurieren Sie die Verbindung zu Ihrer ETA-Heizung
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API Base-URL</Label>
              <Input
                id="apiUrl"
                value={config.apiUrl}
                onChange={(e) => {
                  setConfig({ ...config, apiUrl: e.target.value });
                  setHasChanges(true);
                }}
                placeholder="https://your-eta-api.example.com"
              />
              <p className="text-sm text-muted-foreground">
                Die Basis-URL Ihrer ETA RESTful API (ohne /user/...)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="demoMode">Demo-Modus</Label>
                <p className="text-sm text-muted-foreground">
                  Verwendet simulierte Daten anstelle der echten API
                </p>
              </div>
              <Switch
                id="demoMode"
                checked={config.demoMode}
                onCheckedChange={(checked) => {
                  setConfig({ ...config, demoMode: checked });
                  setHasChanges(true);
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* URI Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Parameter-URIs</CardTitle>
                <CardDescription>
                  Passen Sie die URIs für Ihre spezifische ETA-Heizungskonfiguration an.
                  Nutzen Sie den "Erkunden"-Tab im Dashboard, um verfügbare URIs zu finden.
                </CardDescription>
              </div>
              <Button onClick={addUri} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                URI hinzufügen
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {groupedUris.map((group) => (
              group.uris.length > 0 && (
                <div key={group.value} className="space-y-3">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                    {group.label}
                  </h3>
                  <div className="space-y-2">
                    {group.uris.map((uri) => (
                      <div
                        key={uri.index}
                        className="grid grid-cols-12 gap-2 items-center p-3 rounded-lg bg-muted/50"
                      >
                        <div className="col-span-3">
                          <Input
                            value={uri.label}
                            onChange={(e) => updateUri(uri.index, 'label', e.target.value)}
                            placeholder="Bezeichnung"
                            className="h-9"
                          />
                        </div>
                        <div className="col-span-5">
                          <Input
                            value={uri.uri}
                            onChange={(e) => updateUri(uri.index, 'uri', e.target.value)}
                            placeholder="/112/10021/0/0/12000"
                            className="h-9 font-mono text-sm"
                          />
                        </div>
                        <div className="col-span-3">
                          <Select
                            value={uri.category}
                            onValueChange={(value) => updateUri(uri.index, 'category', value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeUri(uri.index)}
                            className="h-9 w-9 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                </div>
              )
            ))}
          </CardContent>
        </Card>

        {/* Help */}
        <Card>
          <CardHeader>
            <CardTitle>Hilfe</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <p>
              <strong>So finden Sie die richtigen URIs:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
              <li>Öffnen Sie im Dashboard den Tab "Erkunden"</li>
              <li>Navigieren Sie durch die Menüstruktur Ihrer Heizung</li>
              <li>Klicken Sie auf Parameter, um deren URI zu sehen</li>
              <li>Kopieren Sie die URI und fügen Sie sie hier ein</li>
            </ol>
            <p className="text-muted-foreground mt-4">
              <strong>Tipp:</strong> Die URIs können je nach ETA-Modell und Firmware-Version unterschiedlich sein.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
