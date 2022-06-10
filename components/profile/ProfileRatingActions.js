import { Button } from '@mui/material';
import { Box } from '@mui/system';
import CaseCreateDialog from 'components/case/CaseCreateDialog';
import useDataContext from 'hooks/context/useDataContext';
import useDialogContext from 'hooks/context/useDialogContext';
import { IconArrowDown2, IconArrowUp2 } from 'icons/core';
import { useTranslation } from 'next-i18next';
import { palette } from 'theme/palette';

/**
 * A component with buttons to add rating (reputation).
 */
export default function ProfileRatingActions({ profile, sx }) {
  const { t } = useTranslation('common');
  const { accountProfile } = useDataContext();
  const { showDialog, closeDialog } = useDialogContext();

  if (profile) {
    return (
      <Box sx={{ display: 'flex', ...sx }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<IconArrowUp2 color={palette.success.contrastText} />}
          sx={{ flex: 1, mr: 2 }}
          onClick={() =>
            showDialog(
              <CaseCreateDialog
                isPositive={true}
                subjectProfile={profile}
                affectedProfile={accountProfile}
                onClose={closeDialog}
              />,
            )
          }
        >
          {t('button-profile-increase-reputation')}
        </Button>
        <Button
          variant="contained"
          color="danger"
          startIcon={<IconArrowDown2 color={palette.danger.contrastText} />}
          sx={{ flex: 1 }}
          onClick={() =>
            showDialog(
              <CaseCreateDialog
                isPositive={false}
                subjectProfile={profile}
                affectedProfile={accountProfile}
                onClose={closeDialog}
              />,
            )
          }
        >
          {t('button-profile-decrease-reputation')}
        </Button>
      </Box>
    );
  }

  return <></>;
}
