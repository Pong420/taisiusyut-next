import React, { ReactNode, useMemo, useState, useContext, useEffect } from 'react';
import { createClientStorage } from '@/utils/storage';

interface Props {
  children?: ReactNode;
}

export interface Preferences {
  theme: Theme;
  pagingDisplay: boolean;
  fixWidth: boolean;
  fontSize: number;
  lineHeight: string;
  autoFetchNextChapter: boolean;
}

export interface PreferencesActions {
  update: (payload: Partial<Preferences>) => void;
}

export const defaultPreferences: Preferences = {
  theme: 'dark',
  pagingDisplay: true,
  fixWidth: true,
  fontSize: 18,
  lineHeight: '1.5em',
  autoFetchNextChapter: true
};

export const PreferencesStorage = createClientStorage<Preferences>('preferences', defaultPreferences);

const StateContext = React.createContext<Preferences | undefined>(undefined);
const ActionContext = React.createContext<PreferencesActions | undefined>(undefined);

export function usePreferencesState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('usePreferencesState must be used within a PreferencesProvider');
  }
  return context;
}

export function usePreferencesActions() {
  const context = useContext(ActionContext);
  if (context === undefined) {
    throw new Error('usePreferencesActions must be used within a PreferencesProvider');
  }
  return context;
}

export function usePreferences() {
  return [usePreferencesState(), usePreferencesActions()] as const;
}

export function PreferencesProvider({ children }: Props) {
  const [state, setState] = useState(defaultPreferences);
  const actions = useMemo<PreferencesActions>(
    () => ({
      update: changes =>
        setState(curr => {
          const preferences = { ...curr, ...changes };

          if (typeof changes.theme !== 'undefined') {
            window.__setTheme(changes.theme);
          }

          if (typeof changes.fixWidth !== 'undefined') {
            window.__setFixWidth(changes.fixWidth);
          }

          if (typeof changes.pagingDisplay !== 'undefined') {
            window.__setPagingDisplay(changes.pagingDisplay);
          }

          PreferencesStorage.save(preferences);

          return preferences;
        })
    }),
    []
  );

  useEffect(() => {
    const theme = document.documentElement.getAttribute('data-theme') as Theme;
    const newState = { ...PreferencesStorage.get(), theme };
    setState(newState);
    PreferencesStorage.save(newState);
  }, []);

  return React.createElement(
    ActionContext.Provider,
    { value: actions },
    React.createElement(StateContext.Provider, { value: state }, children)
  );
}
