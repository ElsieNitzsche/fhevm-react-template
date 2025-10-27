'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFHEVM, UseFHEVMReturn, NETWORKS } from '@fhevm/universal-sdk/react';

const FHEContext = createContext<UseFHEVMReturn | null>(null);

export interface FHEProviderProps {
  children: ReactNode;
  networkType?: 'SEPOLIA' | 'LOCALHOST';
}

export const FHEProvider: React.FC<FHEProviderProps> = ({
  children,
  networkType = 'SEPOLIA'
}) => {
  const fhevm = useFHEVM({
    config: {
      network: NETWORKS[networkType],
    },
    autoInit: true,
  });

  return (
    <FHEContext.Provider value={fhevm}>
      {children}
    </FHEContext.Provider>
  );
};

export const useFHEContext = (): UseFHEVMReturn => {
  const context = useContext(FHEContext);
  if (!context) {
    throw new Error('useFHEContext must be used within FHEProvider');
  }
  return context;
};
