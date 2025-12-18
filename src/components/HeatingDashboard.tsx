import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind, 
  Flame,
  Battery,
  Timer,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from './Header';
import { DataCard } from './DataCard';
import { ParameterRow } from './ParameterRow';
import { TemperatureGauge } from './TemperatureGauge';
import { ErrorList } from './ErrorList';
import { MenuExplorer } from './MenuExplorer';
import { 
  useConnectionStatus, 
  useMenu, 
  useErrors,
  useVariable 
} from '@/hooks/useEtaData';

// Common ETA URI patterns - these are typical paths, actual paths depend on your setup
const COMMON_URIS = {
  // Kessel (Boiler)
  boilerTemp: '/112/10021/0/0/12000', // Kesseltemperatur
  boilerSetpoint: '/112/10021/0/0/12001',
  boilerState: '/112/10021/0/0/12002',
  
  // Pufferspeicher (Buffer)
  bufferTopTemp: '/112/10101/0/0/12000',
  bufferMiddleTemp: '/112/10101/0/0/12001', 
  bufferBottomTemp: '/112/10101/0/0/12002',
  
  // Warmwasser (Hot water)
  hotWaterTemp: '/112/10111/0/0/12000',
  
  // Außentemperatur
  outdoorTemp: '/112/10021/0/0/12197',
  
  // Pellet
  pelletLevel: '/112/10021/0/0/12015',
  pelletConsumption: '/112/10021/0/0/12016',
};

export function HeatingDashboard() {
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { data: isOnline, isLoading: connectionLoading } = useConnectionStatus();
  const { data: menu, isLoading: menuLoading } = useMenu();
  const { data: errors, isLoading: errorsLoading } = useErrors();

  // Individual variable queries
  const { data: boilerTemp, isLoading: boilerTempLoading } = useVariable(COMMON_URIS.boilerTemp);
  const { data: bufferTopTemp, isLoading: bufferTopLoading } = useVariable(COMMON_URIS.bufferTopTemp);
  const { data: bufferBottomTemp, isLoading: bufferBottomLoading } = useVariable(COMMON_URIS.bufferBottomTemp);
  const { data: hotWaterTemp, isLoading: hotWaterLoading } = useVariable(COMMON_URIS.hotWaterTemp);
  const { data: outdoorTemp, isLoading: outdoorLoading } = useVariable(COMMON_URIS.outdoorTemp);

  useEffect(() => {
    if (isOnline) {
      setLastUpdate(new Date());
    }
  }, [isOnline, boilerTemp, bufferTopTemp]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['eta'] });
  };

  const parseTemperature = (value: { strValue: string; scaleFactor: number; rawValue: number } | null | undefined): number => {
    if (!value) return 0;
    // Try to parse the string value first
    const parsed = parseFloat(value.strValue);
    if (!isNaN(parsed)) return parsed;
    // Fallback to raw value with scale factor
    return value.rawValue / (value.scaleFactor || 1);
  };

  const isLoading = connectionLoading || menuLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header
        isOnline={isOnline ?? false}
        isLoading={isLoading}
        lastUpdate={lastUpdate}
        onRefresh={handleRefresh}
      />

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="explore">Erkunden</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Main Temperature Display */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
              <DataCard
                title="Kesseltemperatur"
                value={boilerTemp ? parseTemperature(boilerTemp).toFixed(1) : '--'}
                unit="°C"
                icon={Flame}
                variant="hot"
                isLoading={boilerTempLoading}
              />
              <DataCard
                title="Puffer Oben"
                value={bufferTopTemp ? parseTemperature(bufferTopTemp).toFixed(1) : '--'}
                unit="°C"
                icon={Thermometer}
                variant="warm"
                isLoading={bufferTopLoading}
              />
              <DataCard
                title="Warmwasser"
                value={hotWaterTemp ? parseTemperature(hotWaterTemp).toFixed(1) : '--'}
                unit="°C"
                icon={Droplets}
                variant="warm"
                isLoading={hotWaterLoading}
              />
              <DataCard
                title="Außentemperatur"
                value={outdoorTemp ? parseTemperature(outdoorTemp).toFixed(1) : '--'}
                unit="°C"
                icon={Wind}
                variant="cool"
                isLoading={outdoorLoading}
              />
            </div>

            {/* Gauges Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in animate-fade-in-delay-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Flame className="h-5 w-5 text-heat-hot" />
                    Kessel
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <TemperatureGauge
                    value={parseTemperature(boilerTemp)}
                    min={0}
                    max={90}
                    size="lg"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Battery className="h-5 w-5 text-heat-warm" />
                    Pufferspeicher
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-xs text-muted-foreground">Oben</span>
                        <TemperatureGauge
                          value={parseTemperature(bufferTopTemp)}
                          min={20}
                          max={80}
                          size="sm"
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-xs text-muted-foreground">Unten</span>
                        <TemperatureGauge
                          value={parseTemperature(bufferBottomTemp)}
                          min={20}
                          max={80}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-heat-cool" />
                    Warmwasser
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <TemperatureGauge
                    value={parseTemperature(hotWaterTemp)}
                    min={20}
                    max={65}
                    size="lg"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Errors Section */}
            <div className="animate-fade-in animate-fade-in-delay-2">
              <ErrorList errors={errors || []} isLoading={errorsLoading} />
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Flame className="h-5 w-5 text-heat-hot" />
                    Kessel Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParameterRow
                    label="Kesseltemperatur"
                    value={boilerTemp?.strValue}
                    unit={boilerTemp?.unit}
                    isLoading={boilerTempLoading}
                    highlight
                  />
                  <ParameterRow
                    label="URI"
                    value={COMMON_URIS.boilerTemp}
                    isLoading={false}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Battery className="h-5 w-5 text-heat-warm" />
                    Puffer Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParameterRow
                    label="Puffer Oben"
                    value={bufferTopTemp?.strValue}
                    unit={bufferTopTemp?.unit}
                    isLoading={bufferTopLoading}
                    highlight
                  />
                  <ParameterRow
                    label="Puffer Unten"
                    value={bufferBottomTemp?.strValue}
                    unit={bufferBottomTemp?.unit}
                    isLoading={bufferBottomLoading}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-heat-cool" />
                    Warmwasser Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParameterRow
                    label="Warmwassertemperatur"
                    value={hotWaterTemp?.strValue}
                    unit={hotWaterTemp?.unit}
                    isLoading={hotWaterLoading}
                    highlight
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    System Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParameterRow
                    label="Verbindungsstatus"
                    value={isOnline ? 'Online' : 'Offline'}
                    isLoading={connectionLoading}
                  />
                  <ParameterRow
                    label="Letzte Aktualisierung"
                    value={lastUpdate?.toLocaleTimeString('de-DE') || '--'}
                    isLoading={false}
                  />
                  <ParameterRow
                    label="API Endpoint"
                    value="pc.bravokilo.cloud"
                    isLoading={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="explore">
            <MenuExplorer menu={menu || []} isLoading={menuLoading} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>Nur-Lese-Modus • Keine Änderungen an der Heizung möglich</p>
        </div>
      </footer>
    </div>
  );
}
