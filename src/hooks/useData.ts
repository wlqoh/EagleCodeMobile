// Источник: EagleCode/src/hooks/useData.ts (веб-версия) + useAthlete, useAchievements, useNotifications.
import { useQuery } from '@tanstack/react-query';

import { dataClient } from '@/services/client';

export const useAthletes = () => useQuery({ queryKey: ['athletes'], queryFn: () => dataClient.getAthletes() });
export const useCities = () => useQuery({ queryKey: ['cities'], queryFn: () => dataClient.getCities() });
export const useCompetitions = () => useQuery({ queryKey: ['competitions'], queryFn: () => dataClient.getCompetitions() });
export const useApplications = () => useQuery({ queryKey: ['applications'], queryFn: () => dataClient.getApplications() });
export const useResults = () => useQuery({ queryKey: ['results'], queryFn: () => dataClient.getResults() });
export const useTransactions = () => useQuery({ queryKey: ['transactions'], queryFn: () => dataClient.getTransactions() });
export const useLevels = () => useQuery({ queryKey: ['levels'], queryFn: () => dataClient.getLevels() });

export const useAthlete = (id: string | undefined) =>
  useQuery({
    queryKey: ['athlete', id],
    queryFn: () => dataClient.getAthlete(id!),
    enabled: Boolean(id),
  });

export const useAchievements = (athleteId: string | undefined) =>
  useQuery({
    queryKey: ['achievements', athleteId],
    queryFn: () => dataClient.getAchievements(athleteId!),
    enabled: Boolean(athleteId),
  });

export const useNotifications = () =>
  useQuery({ queryKey: ['notifications'], queryFn: () => dataClient.getNotifications() });
