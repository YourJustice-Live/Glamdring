import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

/**
 * A component with dialog to view json data.
 */
export default function JsonViewDialog({ json, isClose, onClose }) {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(!isClose);

  async function close() {
    setIsOpen(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="md" fullWidth>
      <DialogTitle>{t('dialog-view-json-title')}</DialogTitle>
      <DialogContent sx={{ p: 4, overflowX: 'scroll' }}>
        <pre>{JSON.stringify(json, null, 2)}</pre>
      </DialogContent>
    </Dialog>
  );
}
