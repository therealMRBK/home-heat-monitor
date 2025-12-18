import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  Wind, 
  Flame,
  Battery,
  Activity,
  Fuel,
  Clock,
  Home,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from './Header';
import { DataCard } from './DataCard';
import { ParameterRow } from './ParameterRow';
import { TemperatureGauge } from './TemperatureGauge';
import { ErrorList } from './ErrorList';
import { MenuExplorer } from './MenuExplorer';
import { DemoModeBanner } from './DemoModeBanner';
import { 
  useConnectionStatus, 
  useMenu, 
  useErrors,
  useVariable 
} from '@/hooks/useEtaData';
import { isDemoMode } from '@/lib/etaApi';

// Updated URIs based on typical ETA menu structure
const HEATING_URIS = {
  // Kessel (Boiler)
  boilerTemp: '/112/10021/0/0/12000',
  boilerSetpoint: '/112/10021/0/0/12001',
  boilerState: '/112/10021/0/0/12006',
  exhaustTemp: '/112/10021/0/0/12080',
  
  // Außentemperatur
  outdoorTemp: '/112/10021/0/0/12197',
  
  // Pufferspeicher (Buffer)
  bufferTopTemp: '/112/10101/0/0/12000',
  bufferMiddleTemp: '/112/10101/0/0/12001',
  bufferBottomTemp: '/112/10101/0/0/12002',
  bufferCharge: '/112/10101/0/0/12010',
  
  // Warmwasser (Hot water)
  hotWaterTemp: '/112/10111/0/0/12000',
  hotWaterSetpoint: '/112/10111/0/0/12001',
  
  // Heizkreis 1
  hc1FlowTemp: '/112/10201/0/0/12000',
  hc1FlowSetpoint: '/112/10201/0/0/12001',
  hc1RoomTemp: '/112/10201/0/0/12002',
  hc1RoomSetpoint: '/112/10201/0/0/12003',
  
  // Pellet
  pelletStock: '/112/10021/0/0/12015',
  pelletConsumption: '/112/10021/0/0/12016',
  operatingHours: '/112/10021/0/0/12077',
  burnerStarts: '/112/10021/0/0/12078',
};

export function HeatingDashboard() {
  const queryClient = useQueryClient();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const { data: isOnline, isLoading: connectionLoading } = useConnectionStatus();
  const { data: menu, isLoading: menuLoading } = useMenu();
  const { data: errors, isLoading: errorsLoading } = useErrors();

  // Kessel
  const { data: boilerTemp, isLoading: boilerTempLoading } = useVariable(HEATING_URIS.boilerTemp);
  const { data: boilerSetpoint } = useVariable(HEATING_URIS.boilerSetpoint);
  const { data: boilerState } = useVariable(HEATING_URIS.boilerState);
  const { data: exhaustTemp } = useVariable(HEATING_URIS.exhaustTemp);
  
  // Puffer
  const { data: bufferTopTemp, isLoading: bufferTopLoading } = useVariable(HEATING_URIS.bufferTopTemp);
  const { data: bufferMiddleTemp } = useVariable(HEATING_URIS.bufferMiddleTemp);
  const { data: bufferBottomTemp, isLoading: bufferBottomLoading } = useVariable(HEATING_URIS.bufferBottomTemp);
  const { data: bufferCharge } = useVariable(HEATING_URIS.bufferCharge);
  
  // Warmwasser & Außen
  const { data: hotWaterTemp, isLoading: hotWaterLoading } = useVariable(HEATING_URIS.hotWaterTemp);
  const { data: hotWaterSetpoint } = useVariable(HEATING_URIS.hotWaterSetpoint);
  const { data: outdoorTemp, isLoading: outdoorLoading } = useVariable(HEATING_URIS.outdoorTemp);
  
  // Heizkreis
  const { data: hc1FlowTemp } = useVariable(HEATING_URIS.hc1FlowTemp);
  const { data: hc1RoomTemp } = useVariable(HEATING_URIS.hc1RoomTemp);
  const { data: hc1RoomSetpoint } = useVariable(HEATING_URIS.hc1RoomSetpoint);
  
  // Pellet & Stats
  const { data: pelletStock } = useVariable(HEATING_URIS.pelletStock);
  const { data: pelletConsumption } = useVariable(HEATING_URIS.pelletConsumption);
  const { data: operatingHours } = useVariable(HEATING_URIS.operatingHours);
  const { data: burnerStarts } = useVariable(HEATING_URIS.burnerStarts);

  useEffect(() => {
    if (isOnline) {
      setLastUpdate(new Date());
    }
  }, [isOnline, boilerTemp, bufferTopTemp]);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['eta'] });
  };

  const parseValue = (value: { strValue: string } | null | undefined): string => {
    return value?.strValue ?? '--';
  };

  const parseNumericValue = (value: { strValue: string } | null | undefined): number => {
    if (!value) return 0;
    const parsed = parseFloat(value.strValue);
    return isNaN(parsed) ? 0 : parsed;
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

      {isDemoMode() && <DemoModeBanner />}

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-lg">
            <TabsTrigger value="overview">Übersicht</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="stats">Statistik</TabsTrigger>
            <TabsTrigger value="explore">Erkunden</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quick Status Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
              <DataCard
                title="Kesseltemperatur"
                value={parseValue(boilerTemp)}
                unit={boilerTemp?.unit}
                icon={Flame}
                variant="hot"
                isLoading={boilerTempLoading}
                description={boilerState?.strValue}
              />
              <DataCard
                title="Puffer oben"
                value={parseValue(bufferTopTemp)}
                unit={bufferTopTemp?.unit}
                icon={Battery}
                variant="warm"
                isLoading={bufferTopLoading}
                description={bufferCharge ? `${bufferCharge.strValue}${bufferCharge.unit} geladen` : undefined}
              />
              <DataCard
                title="Warmwasser"
                value={parseValue(hotWaterTemp)}
                unit={hotWaterTemp?.unit}
                icon={Droplets}
                variant="warm"
                isLoading={hotWaterLoading}
                description={hotWaterSetpoint ? `Soll: ${hotWaterSetpoint.strValue}${hotWaterSetpoint.unit}` : undefined}
              />
              <DataCard
                title="Außentemperatur"
                value={parseValue(outdoorTemp)}
                unit={outdoorTemp?.unit}
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
                <CardContent className="flex flex-col items-center gap-4">
                  <TemperatureGauge
                    value={parseNumericValue(boilerTemp)}
                    min={0}
                    max={90}
                    size="lg"
                  />
                  <div className="text-sm text-center">
                    <span className="text-muted-foreground">Soll: </span>
                    <span className="font-medium">{parseValue(boilerSetpoint)}{boilerSetpoint?.unit}</span>
                  </div>
                  {exhaustTemp && (
                    <div className="text-xs text-muted-foreground">
                      Abgas: {exhaustTemp.strValue}{exhaustTemp.unit}
                    </div>
                  )}
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
                  <div className="flex justify-center gap-6">
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground block mb-1">Oben</span>
                      <TemperatureGauge
                        value={parseNumericValue(bufferTopTemp)}
                        min={20}
                        max={80}
                        size="sm"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground block mb-1">Mitte</span>
                      <TemperatureGauge
                        value={parseNumericValue(bufferMiddleTemp)}
                        min={20}
                        max={80}
                        size="sm"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground block mb-1">Unten</span>
                      <TemperatureGauge
                        value={parseNumericValue(bufferBottomTemp)}
                        min={20}
                        max={80}
                        size="sm"
                      />
                    </div>
                  </div>
                  {bufferCharge && (
                    <div className="mt-4 text-center">
                      <div className="text-2xl font-bold text-foreground">
                        {bufferCharge.strValue}{bufferCharge.unit}
                      </div>
                      <div className="text-xs text-muted-foreground">Ladezustand</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Home className="h-5 w-5 text-info" />
                    Heizkreis 1
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <div className="flex gap-6">
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground block mb-1">Vorlauf</span>
                      <TemperatureGauge
                        value={parseNumericValue(hc1FlowTemp)}
                        min={20}
                        max={60}
                        size="sm"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-muted-foreground block mb-1">Raum</span>
                      <TemperatureGauge
                        value={parseNumericValue(hc1RoomTemp)}
                        min={15}
                        max={30}
                        size="sm"
                      />
                    </div>
                  </div>
                  {hc1RoomSetpoint && (
                    <div className="text-sm text-muted-foreground">
                      Raum-Soll: {hc1RoomSetpoint.strValue}{hc1RoomSetpoint.unit}
                    </div>
                  )}
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
                    Kessel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParameterRow label="Kesseltemperatur" value={boilerTemp?.strValue} unit={boilerTemp?.unit} highlight />
                  <ParameterRow label="Solltemperatur" value={boilerSetpoint?.strValue} unit={boilerSetpoint?.unit} />
                  <ParameterRow label="Abgastemperatur" value={exhaustTemp?.strValue} unit={exhaustTemp?.unit} />
                  <ParameterRow label="Zustand" value={boilerState?.strValue} />
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
                  <ParameterRow label="Puffer oben" value={bufferTopTemp?.strValue} unit={bufferTopTemp?.unit} highlight />
                  <ParameterRow label="Puffer mitte" value={bufferMiddleTemp?.strValue} unit={bufferMiddleTemp?.unit} />
                  <ParameterRow label="Puffer unten" value={bufferBottomTemp?.strValue} unit={bufferBottomTemp?.unit} />
                  <ParameterRow label="Ladezustand" value={bufferCharge?.strValue} unit={bufferCharge?.unit} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Droplets className="h-5 w-5 text-heat-cool" />
                    Warmwasser
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParameterRow label="Ist-Temperatur" value={hotWaterTemp?.strValue} unit={hotWaterTemp?.unit} highlight />
                  <ParameterRow label="Soll-Temperatur" value={hotWaterSetpoint?.strValue} unit={hotWaterSetpoint?.unit} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Home className="h-5 w-5 text-info" />
                    Heizkreis 1
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ParameterRow label="Vorlauf Ist" value={hc1FlowTemp?.strValue} unit={hc1FlowTemp?.unit} highlight />
                  <ParameterRow label="Raumtemperatur" value={hc1RoomTemp?.strValue} unit={hc1RoomTemp?.unit} />
                  <ParameterRow label="Raum-Sollwert" value={hc1RoomSetpoint?.strValue} unit={hc1RoomSetpoint?.unit} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <DataCard
                title="Pelletvorrat"
                value={parseValue(pelletStock)}
                unit={pelletStock?.unit}
                icon={Fuel}
                variant="warm"
              />
              <DataCard
                title="Tagesverbrauch"
                value={parseValue(pelletConsumption)}
                unit={pelletConsumption?.unit}
                icon={Gauge}
                variant="default"
              />
              <DataCard
                title="Betriebsstunden"
                value={parseValue(operatingHours)}
                unit={operatingHours?.unit}
                icon={Clock}
                variant="default"
              />
              <DataCard
                title="Brennerstarts"
                value={parseValue(burnerStarts)}
                unit=""
                icon={Zap}
                variant="default"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ParameterRow label="Verbindungsstatus" value={isOnline ? 'Online' : 'Offline'} />
                <ParameterRow label="Modus" value={isDemoMode() ? 'Demo-Modus' : 'Live'} />
                <ParameterRow label="Letzte Aktualisierung" value={lastUpdate?.toLocaleTimeString('de-DE') || '--'} />
                <ParameterRow label="API Endpoint" value="pc.bravokilo.cloud" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="explore">
            <MenuExplorer menu={menu || []} isLoading={menuLoading} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>Nur-Lese-Modus • Keine Änderungen an der Heizung möglich</p>
        </div>
      </footer>
    </div>
  );
}
