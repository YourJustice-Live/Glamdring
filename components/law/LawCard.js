import {
  ArrowForwardIosOutlined,
  LightbulbOutlined,
} from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import FeedbackPostDialog from 'components/feedback/FeedbackPostDialog';
import RuleEffects from 'components/law/RuleEffects';
import { FORM } from 'constants/feedbacks';
import useDialogContext from 'hooks/context/useDialogContext';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { getActionIcon } from 'utils/metadata';

/**
 * A component with a card with law (action + rules).
 */
export default function LawCard({
  law,
  isCollapseEnabled = false,
  isCommentsEnabled = false,
  sx,
}) {
  const { t } = useTranslation('common');
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Card elevation={1} sx={{ ...sx }}>
      <CardContent sx={{ p: 2.5 }}>
        <LawAction law={law} />
        {isCollapseEnabled ? (
          <>
            <Button
              variant="text"
              onClick={() => setIsCollapsed(!isCollapsed)}
              sx={{
                mt: 1,
                color: 'text.primary',
              }}
              endIcon={
                <ArrowForwardIosOutlined
                  sx={{
                    transform: isCollapsed ? 'none' : 'rotate(90deg)',
                    width: 16,
                  }}
                />
              }
            >
              <Typography sx={{ fontWeight: 'bold' }}>
                {t('text-rules')}
              </Typography>
            </Button>
            <Collapse in={!isCollapsed}>
              <LawRules
                law={law}
                isCommentsEnabled={isCommentsEnabled}
                sx={{ mt: 1 }}
              />
            </Collapse>
          </>
        ) : (
          <LawRules
            law={law}
            isCommentsEnabled={isCommentsEnabled}
            sx={{ mt: 2 }}
          />
        )}
      </CardContent>
    </Card>
  );
}

function LawAction({ law }) {
  const { t } = useTranslation('common');

  if (law?.action) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {getActionIcon(law.action, 36)}
        <Box sx={{ ml: 1.5 }}>
          <Typography sx={{ fontWeight: 'bold' }}>
            {law.action.uriData?.name || t('text-none-name')}
          </Typography>
          {law.action.uriData?.description && (
            <Typography variant="body2" sx={{ mt: 0.3 }}>
              {law.action.uriData.description}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  return <></>;
}

function LawRules({ law, isCommentsEnabled, sx }) {
  const { t } = useTranslation('common');
  const { showDialog, closeDialog } = useDialogContext();

  if (law?.rules) {
    return (
      <Stack direction="column" spacing={2} sx={{ ...sx }}>
        {law.rules.map((rule, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2 }}>
            {/* Rule details and effects */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              {/* Negation, name, description, id */}
              <Box sx={{ flex: 1, mr: 4 }}>
                {/* Negation, name */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  {rule?.rule?.negation && (
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        color: 'danger.primary',
                        mr: 0.5,
                      }}
                    >
                      {t('text-action-negation').toUpperCase()}
                    </Typography>
                  )}
                  <Typography sx={{ fontWeight: 'bold', mr: 1 }}>
                    {rule?.rule?.uriData?.name || t('text-none-name')}
                  </Typography>
                </Box>
                {/* Description */}
                {rule?.rule?.uriData?.description && (
                  <Typography variant="body2" sx={{ mt: 0.3 }}>
                    {rule.rule.uriData.description}
                  </Typography>
                )}
                {/* Id */}
                <Chip
                  label={`ID: ${rule?.ruleId || t('text-none')}`}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
              <RuleEffects rule={rule} sx={{ mt: { xs: 2.5, md: 0 } }} />
            </Box>
            {/* Button for comment rule */}
            {isCommentsEnabled && (
              <Box sx={{ display: 'flex', direction: 'row', mt: 2 }}>
                <LightbulbOutlined
                  fontSize="small"
                  sx={{ mr: 1, color: 'text.secondary' }}
                />
                <Typography variant="body2" color="text.secondary">
                  {t('alert-propost-law-edits-description-1')}
                  <Link
                    component="button"
                    variant="body2"
                    underline="none"
                    sx={{ mx: 0.5, pb: 0.3 }}
                    onClick={() =>
                      showDialog(
                        <FeedbackPostDialog
                          form={FORM.commentLaw}
                          additionalData={{ rule: rule.id }}
                          onClose={closeDialog}
                        />,
                      )
                    }
                  >
                    <strong>
                      {t('alert-propose-law-edits-button-propose')}
                    </strong>
                  </Link>
                  {t('alert-propose-law-edits-description-2')}
                </Typography>
              </Box>
            )}
          </Paper>
        ))}
      </Stack>
    );
  }

  return <></>;
}
