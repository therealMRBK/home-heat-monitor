import { useQuery } from '@tanstack/react-query';
import { getApiVersion, getMenu, getVariable, getErrors, checkConnection } from '@/lib/etaApi';

export function useApiVersion() {
  return useQuery({
    queryKey: ['eta', 'api-version'],
    queryFn: getApiVersion,
    staleTime: 60000,
    retry: 2,
  });
}

export function useMenu() {
  return useQuery({
    queryKey: ['eta', 'menu'],
    queryFn: getMenu,
    staleTime: 300000, // Menu rarely changes
    retry: 2,
  });
}

export function useVariable(uri: string, enabled = true) {
  return useQuery({
    queryKey: ['eta', 'variable', uri],
    queryFn: () => getVariable(uri),
    enabled: enabled && !!uri,
    staleTime: 30000,
    refetchInterval: 30000, // Refresh every 30 seconds
    retry: 2,
  });
}

export function useErrors() {
  return useQuery({
    queryKey: ['eta', 'errors'],
    queryFn: getErrors,
    staleTime: 30000,
    refetchInterval: 60000,
    retry: 2,
  });
}

export function useConnectionStatus() {
  return useQuery({
    queryKey: ['eta', 'connection'],
    queryFn: checkConnection,
    staleTime: 10000,
    refetchInterval: 30000,
    retry: 1,
  });
}
