"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LayoutContextType {
  isLeftRailCollapsed: boolean;
  toggleLeftRail: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};

interface LayoutProviderProps {
  children: ReactNode;
}

export const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const [isLeftRailCollapsed, setIsLeftRailCollapsed] = useState(false);

  const toggleLeftRail = () => {
    setIsLeftRailCollapsed(!isLeftRailCollapsed);
  };

  return (
    <LayoutContext.Provider value={{ isLeftRailCollapsed, toggleLeftRail }}>
      {children}
    </LayoutContext.Provider>
  );
};