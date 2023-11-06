import React, { PropsWithChildren } from 'react';
import { RootFormContext, RootFormContextType } from '../../../components/context-providers/root-form-provider.component';

interface MockRootFormContextProps {
  mockContextValue? : Partial<RootFormContextType>
}

export function MockRootFormContext({ mockContextValue = {}, children } : PropsWithChildren<MockRootFormContextProps>) {
  const value : RootFormContextType = {
    submit : () => {
      return new Promise<void>((resolve) => resolve())
    },
    ...mockContextValue
  }

  return (
    <RootFormContext.Provider value={value}>
      {children}
    </RootFormContext.Provider>
  )
}