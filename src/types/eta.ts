export interface ETAValue {
  uri: string;
  strValue: string;
  unit: string;
  decPlaces: number;
  scaleFactor: number;
  advTextOffset?: number;
  rawValue: number;
}

export interface ETAMenuNode {
  uri: string;
  name: string;
  children?: ETAMenuNode[];
}

export interface ETAError {
  msg: string;
  time: string;
  priority: string;
}

export interface HeatingParameter {
  id: string;
  name: string;
  uri: string;
  value?: ETAValue;
  category: 'boiler' | 'buffer' | 'heating' | 'hotwater' | 'pellet' | 'system';
  icon: string;
}

export interface SystemStatus {
  isOnline: boolean;
  lastUpdate: Date | null;
  apiVersion: string | null;
  errors: ETAError[];
}
