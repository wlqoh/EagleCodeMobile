import { useSyncExternalStore } from 'react';

let pickedCity: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function setPickedCity(city: string) {
  pickedCity = city;
  emit();
}

export function clearPickedCity() {
  pickedCity = null;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return pickedCity;
}

export function usePickedCity() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
