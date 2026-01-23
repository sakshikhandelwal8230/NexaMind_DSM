"use client";

import React, { createContext, useContext, useState } from "react";

type EmergencyContextType = {
  isEmergencyMode: boolean;
  setEmergencyMode: (mode: boolean) => void;
};

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export function EmergencyProvider({ children }: { children: React.ReactNode }) {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);

  const setEmergencyMode = (mode: boolean) => setIsEmergencyMode(mode);

  return (
    <EmergencyContext.Provider value={{ isEmergencyMode, setEmergencyMode }}>
      {children}
    </EmergencyContext.Provider>
  );
}

export function useEmergency() {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error("useEmergency must be used within EmergencyProvider");
  }
  return context;
}
