import { createContext, useContext, MutableRefObject } from 'react';

export interface TransitionContextType {
  go: (path: string) => void;
  goBack: () => void;
  containerRef: MutableRefObject<HTMLDivElement | null>;
}

export const TransitionContext = createContext<TransitionContextType>(null!);

export function useNav() {
  return useContext(TransitionContext);
}
