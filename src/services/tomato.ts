import { invoke } from "@tauri-apps/api";

export interface Tomato {
  start_at: number;
  end_at: number;
  task: string
}

export interface TomatoPerDay {
  day: string,
  tomatos: Tomato[]
}

export async function createTomato(start_at: number, end_at: number, task: string) {
  await invoke('add_tomato', { startAt: Math.floor(start_at), endAt: Math.floor(end_at), task: task })
}

export async function loadTomatos() {
  const tomatos: TomatoPerDay[] = await invoke('load_tomatos')
  return tomatos
}
