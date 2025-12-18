import { ETAMenuNode, ETAValue, ETAError } from '@/types/eta';

// Realistic mock data based on typical ETA heating systems
export const MOCK_MENU: ETAMenuNode[] = [
  {
    uri: '/112/10021',
    name: 'Kessel',
    children: [
      {
        uri: '/112/10021/0/0/12000',
        name: 'Kesseltemperatur',
      },
      {
        uri: '/112/10021/0/0/12001',
        name: 'Kesseltemperatur Soll',
      },
      {
        uri: '/112/10021/0/0/12080',
        name: 'Abgastemperatur',
      },
      {
        uri: '/112/10021/0/0/12006',
        name: 'Zustand Kessel',
      },
      {
        uri: '/112/10021/0/0/12197',
        name: 'Außentemperatur',
      },
      {
        uri: '/112/10021/0/0/12015',
        name: 'Pelletvorrat',
      },
      {
        uri: '/112/10021/0/0/12016',
        name: 'Pelletverbrauch',
      },
      {
        uri: '/112/10021/0/0/12077',
        name: 'Betriebsstunden',
      },
      {
        uri: '/112/10021/0/0/12182',
        name: 'Sonstiges',
        children: [
          {
            uri: '/112/10021/0/0/12112',
            name: 'Entaschung',
          },
          {
            uri: '/112/10021/0/0/12078',
            name: 'Brennerstarts',
          },
        ],
      },
    ],
  },
  {
    uri: '/112/10101',
    name: 'Puffer',
    children: [
      {
        uri: '/112/10101/0/0/12000',
        name: 'Puffer oben',
      },
      {
        uri: '/112/10101/0/0/12001',
        name: 'Puffer mitte',
      },
      {
        uri: '/112/10101/0/0/12002',
        name: 'Puffer unten',
      },
      {
        uri: '/112/10101/0/0/12010',
        name: 'Puffer Ladezustand',
      },
    ],
  },
  {
    uri: '/112/10111',
    name: 'Warmwasser',
    children: [
      {
        uri: '/112/10111/0/0/12000',
        name: 'Warmwasser Ist',
      },
      {
        uri: '/112/10111/0/0/12001',
        name: 'Warmwasser Soll',
      },
      {
        uri: '/112/10111/0/0/12003',
        name: 'Warmwasser Freigabe',
      },
    ],
  },
  {
    uri: '/112/10201',
    name: 'Heizkreis 1',
    children: [
      {
        uri: '/112/10201/0/0/12000',
        name: 'Vorlauftemperatur Ist',
      },
      {
        uri: '/112/10201/0/0/12001',
        name: 'Vorlauftemperatur Soll',
      },
      {
        uri: '/112/10201/0/0/12002',
        name: 'Raumtemperatur',
      },
      {
        uri: '/112/10201/0/0/12003',
        name: 'Raumtemperatur Soll',
      },
      {
        uri: '/112/10201/0/0/12005',
        name: 'Betriebsart',
      },
    ],
  },
  {
    uri: '/112/10202',
    name: 'Heizkreis 2',
    children: [
      {
        uri: '/112/10202/0/0/12000',
        name: 'Vorlauftemperatur Ist',
      },
      {
        uri: '/112/10202/0/0/12001',
        name: 'Vorlauftemperatur Soll',
      },
    ],
  },
];

// Generate realistic temperature values
function randomTemp(base: number, variance: number): number {
  return base + (Math.random() - 0.5) * variance;
}

export const MOCK_VALUES: Record<string, ETAValue> = {
  '/112/10021/0/0/12000': {
    uri: '/112/10021/0/0/12000',
    strValue: '72.5',
    unit: '°C',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 725,
  },
  '/112/10021/0/0/12001': {
    uri: '/112/10021/0/0/12001',
    strValue: '75',
    unit: '°C',
    decPlaces: 0,
    scaleFactor: 10,
    rawValue: 750,
  },
  '/112/10021/0/0/12080': {
    uri: '/112/10021/0/0/12080',
    strValue: '145.3',
    unit: '°C',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 1453,
  },
  '/112/10021/0/0/12006': {
    uri: '/112/10021/0/0/12006',
    strValue: 'Heizbetrieb',
    unit: '',
    decPlaces: 0,
    scaleFactor: 1,
    advTextOffset: 1000,
    rawValue: 1003,
  },
  '/112/10021/0/0/12197': {
    uri: '/112/10021/0/0/12197',
    strValue: '4.2',
    unit: '°C',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 42,
  },
  '/112/10021/0/0/12015': {
    uri: '/112/10021/0/0/12015',
    strValue: '2450',
    unit: 'kg',
    decPlaces: 0,
    scaleFactor: 1,
    rawValue: 2450,
  },
  '/112/10021/0/0/12016': {
    uri: '/112/10021/0/0/12016',
    strValue: '15.4',
    unit: 'kg/Tag',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 154,
  },
  '/112/10021/0/0/12077': {
    uri: '/112/10021/0/0/12077',
    strValue: '4235',
    unit: 'h',
    decPlaces: 0,
    scaleFactor: 1,
    rawValue: 4235,
  },
  '/112/10021/0/0/12078': {
    uri: '/112/10021/0/0/12078',
    strValue: '1842',
    unit: '',
    decPlaces: 0,
    scaleFactor: 1,
    rawValue: 1842,
  },
  '/112/10101/0/0/12000': {
    uri: '/112/10101/0/0/12000',
    strValue: '58.3',
    unit: '°C',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 583,
  },
  '/112/10101/0/0/12001': {
    uri: '/112/10101/0/0/12001',
    strValue: '48.7',
    unit: '°C',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 487,
  },
  '/112/10101/0/0/12002': {
    uri: '/112/10101/0/0/12002',
    strValue: '35.2',
    unit: '°C',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 352,
  },
  '/112/10101/0/0/12010': {
    uri: '/112/10101/0/0/12010',
    strValue: '68',
    unit: '%',
    decPlaces: 0,
    scaleFactor: 1,
    rawValue: 68,
  },
  '/112/10111/0/0/12000': {
    uri: '/112/10111/0/0/12000',
    strValue: '52.4',
    unit: '°C',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 524,
  },
  '/112/10111/0/0/12001': {
    uri: '/112/10111/0/0/12001',
    strValue: '55',
    unit: '°C',
    decPlaces: 0,
    scaleFactor: 10,
    rawValue: 550,
  },
  '/112/10201/0/0/12000': {
    uri: '/112/10201/0/0/12000',
    strValue: '38.5',
    unit: '°C',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 385,
  },
  '/112/10201/0/0/12001': {
    uri: '/112/10201/0/0/12001',
    strValue: '40',
    unit: '°C',
    decPlaces: 0,
    scaleFactor: 10,
    rawValue: 400,
  },
  '/112/10201/0/0/12002': {
    uri: '/112/10201/0/0/12002',
    strValue: '21.3',
    unit: '°C',
    decPlaces: 1,
    scaleFactor: 10,
    rawValue: 213,
  },
  '/112/10201/0/0/12003': {
    uri: '/112/10201/0/0/12003',
    strValue: '21',
    unit: '°C',
    decPlaces: 0,
    scaleFactor: 10,
    rawValue: 210,
  },
  '/112/10201/0/0/12005': {
    uri: '/112/10201/0/0/12005',
    strValue: 'Automatik',
    unit: '',
    decPlaces: 0,
    scaleFactor: 1,
    advTextOffset: 2000,
    rawValue: 2001,
  },
};

export const MOCK_ERRORS: ETAError[] = [];

export const MOCK_API_VERSION = '1.2';
