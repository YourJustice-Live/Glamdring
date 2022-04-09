import { createContext, useState } from 'react';

/**
 * Context for managing dialogs.
 */
export const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  function showDialog(dialog) {
    setDialog(dialog);
  }

  function closeDialog() {
    setDialog(null);
  }

  const value = {
    showDialog,
    closeDialog,
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
      {dialog}
    </DialogContext.Provider>
  );
}
