const STORAGE_KEY = 'eta-heating-config';

export interface HeatingUri {
  id: string;
  label: string;
  uri: string;
  category: 'kessel' | 'puffer' | 'warmwasser' | 'heizkreis' | 'pellet' | 'sonstige';
}

export interface AppConfig {
  apiUrl: string;
  demoMode: boolean;
  uris: HeatingUri[];
}

export const DEFAULT_URIS: HeatingUri[] = [
  // Kessel
  { id: 'boilerTemp', label: 'Kesseltemperatur', uri: '/112/10021/0/0/12000', category: 'kessel' },
  { id: 'boilerSetpoint', label: 'Kessel Sollwert', uri: '/112/10021/0/0/12001', category: 'kessel' },
  { id: 'boilerState', label: 'Kessel Zustand', uri: '/112/10021/0/0/12006', category: 'kessel' },
  { id: 'exhaustTemp', label: 'Abgastemperatur', uri: '/112/10021/0/0/12080', category: 'kessel' },
  
  // Puffer
  { id: 'bufferTopTemp', label: 'Puffer oben', uri: '/112/10101/0/0/12000', category: 'puffer' },
  { id: 'bufferMiddleTemp', label: 'Puffer mitte', uri: '/112/10101/0/0/12001', category: 'puffer' },
  { id: 'bufferBottomTemp', label: 'Puffer unten', uri: '/112/10101/0/0/12002', category: 'puffer' },
  { id: 'bufferCharge', label: 'Puffer Ladezustand', uri: '/112/10101/0/0/12010', category: 'puffer' },
  
  // Warmwasser
  { id: 'hotWaterTemp', label: 'Warmwasser Ist', uri: '/112/10111/0/0/12000', category: 'warmwasser' },
  { id: 'hotWaterSetpoint', label: 'Warmwasser Soll', uri: '/112/10111/0/0/12001', category: 'warmwasser' },
  
  // Außen
  { id: 'outdoorTemp', label: 'Außentemperatur', uri: '/112/10021/0/0/12197', category: 'sonstige' },
  
  // Heizkreis
  { id: 'hc1FlowTemp', label: 'HK1 Vorlauf', uri: '/112/10201/0/0/12000', category: 'heizkreis' },
  { id: 'hc1FlowSetpoint', label: 'HK1 Vorlauf Soll', uri: '/112/10201/0/0/12001', category: 'heizkreis' },
  { id: 'hc1RoomTemp', label: 'HK1 Raumtemperatur', uri: '/112/10201/0/0/12002', category: 'heizkreis' },
  { id: 'hc1RoomSetpoint', label: 'HK1 Raum Soll', uri: '/112/10201/0/0/12003', category: 'heizkreis' },
  
  // Pellet
  { id: 'pelletStock', label: 'Pelletvorrat', uri: '/112/10021/0/0/12015', category: 'pellet' },
  { id: 'pelletConsumption', label: 'Pelletverbrauch', uri: '/112/10021/0/0/12016', category: 'pellet' },
  { id: 'operatingHours', label: 'Betriebsstunden', uri: '/112/10021/0/0/12077', category: 'pellet' },
  { id: 'burnerStarts', label: 'Brennerstarts', uri: '/112/10021/0/0/12078', category: 'pellet' },
];

const DEFAULT_CONFIG: AppConfig = {
  apiUrl: 'https://pc.bravokilo.cloud',
  demoMode: false, // Start with live mode, auto-switch to demo on CORS errors
  uris: DEFAULT_URIS,
};

export function loadConfig(): AppConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.error('Error loading config:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: AppConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Error saving config:', e);
  }
}

export function getUriById(config: AppConfig, id: string): string | undefined {
  return config.uris.find(u => u.id === id)?.uri;
}
