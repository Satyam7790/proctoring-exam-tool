export {};
declare global {
  interface Window {
    verity?: {
      desktopInfo(): Promise<{ platform: string; version: string; packaged: boolean }>;
      setExamFullscreen(enabled: boolean): Promise<boolean>;
      getScreenSources(): Promise<Array<{ id: string; name: string; thumbnail: string }>>;
      onWindowFocus(callback: (focused: boolean) => void): () => void;
    };
  }
}
