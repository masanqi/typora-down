import { invoke } from '@tauri-apps/api/core';

export interface DirEntry {
  name: string;
  path: string;
  is_dir: boolean;
  children: DirEntry[];
}

export async function readFile(path: string): Promise<string> {
  return invoke<string>('read_file', { path });
}

export async function writeFile(path: string, content: string): Promise<void> {
  return invoke<void>('write_file', { path, content });
}

export async function readDir(path: string): Promise<DirEntry[]> {
  return invoke<DirEntry[]>('read_dir', { path });
}

export async function getRecentFiles(): Promise<string[]> {
  return invoke<string[]>('get_recent_files');
}

export async function addRecentFile(path: string): Promise<void> {
  return invoke<void>('add_recent_file', { path });
}

export async function listThemes(dir: string): Promise<string[]> {
  return invoke<string[]>('list_themes', { dir });
}

export async function loadTheme(dir: string, name: string): Promise<string> {
  return invoke<string>('load_theme', { dir, name });
}

export async function getDefaultThemeDir(): Promise<string> {
  return invoke<string>('get_default_theme_dir');
}

export async function saveImage(
  filePath: string,
  imageData: number[],
  ext: string
): Promise<string> {
  return invoke<string>('save_image', { filePath, imageData, ext });
}
