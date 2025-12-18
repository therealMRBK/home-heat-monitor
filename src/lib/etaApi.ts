import { ETAValue, ETAMenuNode, ETAError } from '@/types/eta';
import { MOCK_MENU, MOCK_VALUES, MOCK_ERRORS, MOCK_API_VERSION } from './mockData';

const BASE_URL = 'https://pc.bravokilo.cloud';

// Demo mode state
let demoMode = true; // Default to demo mode since API is behind Cloudflare

export function isDemoMode(): boolean {
  return demoMode;
}

export function setDemoMode(enabled: boolean): void {
  demoMode = enabled;
}

// Parse XML response to extract value
function parseValueXML(xmlString: string): ETAValue | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const valueElement = doc.querySelector('value');
  
  if (!valueElement) return null;
  
  return {
    uri: valueElement.getAttribute('uri') || '',
    strValue: valueElement.getAttribute('strValue') || '',
    unit: valueElement.getAttribute('unit') || '',
    decPlaces: parseInt(valueElement.getAttribute('decPlaces') || '0'),
    scaleFactor: parseFloat(valueElement.getAttribute('scaleFactor') || '1'),
    advTextOffset: valueElement.getAttribute('advTextOffset') 
      ? parseInt(valueElement.getAttribute('advTextOffset')!) 
      : undefined,
    rawValue: parseFloat(valueElement.textContent || '0'),
  };
}

// Parse menu XML to extract structure
function parseMenuXML(xmlString: string): ETAMenuNode[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const nodes: ETAMenuNode[] = [];
  
  function parseNode(element: Element): ETAMenuNode {
    const children: ETAMenuNode[] = [];
    const childElements = element.querySelectorAll(':scope > object, :scope > fub');
    
    childElements.forEach(child => {
      children.push(parseNode(child));
    });
    
    return {
      uri: element.getAttribute('uri') || '',
      name: element.getAttribute('name') || '',
      children: children.length > 0 ? children : undefined,
    };
  }
  
  const rootElements = doc.querySelectorAll('eta > fub, eta > object');
  rootElements.forEach(el => nodes.push(parseNode(el)));
  
  return nodes;
}

// Parse errors XML
function parseErrorsXML(xmlString: string): ETAError[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const errors: ETAError[] = [];
  
  const errorElements = doc.querySelectorAll('error');
  errorElements.forEach(el => {
    errors.push({
      msg: el.getAttribute('msg') || '',
      time: el.getAttribute('time') || '',
      priority: el.getAttribute('priority') || '',
    });
  });
  
  return errors;
}

// Parse API version
function parseApiVersion(xmlString: string): string | null {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const apiElement = doc.querySelector('api');
  return apiElement?.getAttribute('version') || null;
}

// GET only - Read API version
export async function getApiVersion(): Promise<string | null> {
  if (demoMode) {
    await simulateLatency();
    return MOCK_API_VERSION;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/user/api`);
    if (!response.ok) throw new Error('API not available');
    const xml = await response.text();
    return parseApiVersion(xml);
  } catch (error) {
    console.error('Error fetching API version:', error);
    return null;
  }
}

// GET only - Read menu structure
export async function getMenu(): Promise<ETAMenuNode[]> {
  if (demoMode) {
    await simulateLatency();
    return MOCK_MENU;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/user/menu`);
    if (!response.ok) throw new Error('Menu not available');
    const xml = await response.text();
    return parseMenuXML(xml);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return [];
  }
}

// GET only - Read single variable
export async function getVariable(uri: string): Promise<ETAValue | null> {
  if (demoMode) {
    await simulateLatency();
    const cleanUri = uri.startsWith('/') ? uri : `/${uri}`;
    const mockValue = MOCK_VALUES[cleanUri];
    if (mockValue) {
      // Add slight random variation for realistic feel
      const numValue = parseFloat(mockValue.strValue);
      if (!isNaN(numValue) && mockValue.unit === '°C') {
        const variance = numValue * 0.02; // 2% variance
        const newValue = numValue + (Math.random() - 0.5) * variance;
        return {
          ...mockValue,
          strValue: newValue.toFixed(mockValue.decPlaces),
          rawValue: Math.round(newValue * mockValue.scaleFactor),
        };
      }
    }
    return mockValue || null;
  }
  
  try {
    const cleanUri = uri.startsWith('/') ? uri.substring(1) : uri;
    const response = await fetch(`${BASE_URL}/user/var/${cleanUri}`);
    if (!response.ok) throw new Error('Variable not available');
    const xml = await response.text();
    return parseValueXML(xml);
  } catch (error) {
    console.error('Error fetching variable:', error);
    return null;
  }
}

// GET only - Read multiple variables
export async function getVariables(uris: string[]): Promise<Map<string, ETAValue | null>> {
  const results = new Map<string, ETAValue | null>();
  
  await Promise.all(
    uris.map(async (uri) => {
      const value = await getVariable(uri);
      results.set(uri, value);
    })
  );
  
  return results;
}

// GET only - Read active errors
export async function getErrors(): Promise<ETAError[]> {
  if (demoMode) {
    await simulateLatency();
    return MOCK_ERRORS;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/user/errors`);
    if (!response.ok) throw new Error('Errors not available');
    const xml = await response.text();
    return parseErrorsXML(xml);
  } catch (error) {
    console.error('Error fetching errors:', error);
    return [];
  }
}

// Check if system is online
export async function checkConnection(): Promise<boolean> {
  if (demoMode) {
    await simulateLatency();
    return true;
  }
  
  try {
    const version = await getApiVersion();
    return version !== null;
  } catch {
    return false;
  }
}

// Simulate network latency for demo mode
function simulateLatency(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
}
