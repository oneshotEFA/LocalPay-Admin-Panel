import { useQuery } from "@tanstack/react-query";
import { overviewApi, settingsApi } from "@/lib/api/client";
import { queryKeys } from "./queryKeys";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard(),
    queryFn: () => overviewApi.dashboard(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings(),
    queryFn: () => settingsApi.get(),
    staleTime: 2 * 60 * 1000,
  });
}
