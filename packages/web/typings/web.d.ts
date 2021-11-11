type Theme = 'light' | 'dark';

declare interface Window {
  __setTheme: (theme: Theme) => void;
  __setFixWidth: (flag: boolean) => void;
  __setPagingDisplay: (flag: boolean) => void;
}
