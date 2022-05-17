import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';

/**
 * A component with dialog to view json data.
 */
export default function JsonViewDialog({ json, isClose, onClose }) {
  const [isOpen, setIsOpen] = useState(!isClose);

  async function close() {
    setIsOpen(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle>JSON View</DialogTitle>
      <DialogContent sx={{ p: 4, overflowX: 'scroll' }}>
        <pre>{JSON.stringify(json, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
}
