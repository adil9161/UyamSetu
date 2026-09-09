/**
 * UdyamSetu Shared Element Context & Component
 * Visually preserves mental context when transitioning from Scheme Cards to Scheme Detail.
 */
import React, { createContext, useContext, useState } from 'react';

interface SharedElementContextType {
  activeElementId: string | null;
  setActiveElementId: (id: string | null) => void;
}

const SharedElementContext = createContext<SharedElementContextType>({
  activeElementId: null,
  setActiveElementId: () => {},
});

export const SharedElementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeElementId, setActiveElementId] = useState<string | null>(null);

  return (
    <SharedElementContext.Provider value={{ activeElementId, setActiveElementId }}>
      {children}
    </SharedElementContext.Provider>
  );
};

export const useSharedElement = () => useContext(SharedElementContext);

interface SharedElementProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const SharedElement: React.FC<SharedElementProps> = ({ id, children, className = '' }) => {
  return (
    <div data-shared-id={id} className={`shared-element-node ${className}`}>
      {children}
    </div>
  );
};
