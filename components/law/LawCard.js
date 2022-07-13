import { ArrowForwardIosOutlined } from '@mui/icons-material';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import FeedbackPostDialog from 'components/feedback/FeedbackPostDialog';
import RuleEffects from 'components/law/RuleEffects';
import { FORM } from 'constants/feedbacks';
import useDialogContext from 'hooks/context/useDialogContext';
import { IconEdit } from 'icons/core';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { palette } from 'theme/palette';
import { formatActionName } from 'utils/formatters';
import { getRuleIcon } from 'utils/metadata';

/**
 * A component with a card with law (action + rules).
 */
export default function LawCard({
  law,
  isCollapseEnabled = false,
  isCommentsEnabled = false,
  sx,
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Card elevation={1} sx={{ ...sx }}>
      <CardContent sx={{ p: 2.5 }}>
        {isCollapseEnabled ? (
          <>
            <Button
              variant="text"
              onClick={() => setIsCollapsed(!isCollapsed)}
              sx={{
                textAlign: 'left',
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
              <LawAction law={law} />
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
          <>
            <LawAction law={law} />
            <LawRules
              law={law}
              isCommentsEnabled={isCommentsEnabled}
              sx={{ mt: 2 }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function LawAction({ law }) {
  if (law?.action) {
    return (
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {formatActionName(law.action)}
      </Typography>
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
              {/* Icon, negation, name, description */}
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  mr: { xs: 0, md: 4 },
                }}
              >
                {/* Icon */}
                {getRuleIcon(rule, 32)}
                <Box sx={{ ml: 1.5 }}>
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
                </Box>
              </Box>
              <RuleEffects rule={rule} sx={{ mt: { xs: 2, md: 0 } }} />
            </Box>
            {/* Rule id, disabled status, button to propose edits */}
            <Box
              sx={{
                display: 'flex',
                direction: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                mt: 1,
              }}
            >
              {/* Rule id, disabled status */}
              <Stack direction="row" spacing={1}>
                <Chip
                  label={`ID: ${rule?.ruleId || t('text-none')}`}
                  size="small"
                />
                {rule?.isDisabled && (
                  <Chip
                    label={t('text-rule-disabled')}
                    color="primary"
                    size="small"
                  />
                )}
              </Stack>
              {/* Button for comment rule */}
              {isCommentsEnabled && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={
                    <IconEdit
                      width="18"
                      height="18"
                      color={palette.text.secondary}
                    />
                  }
                  sx={{ fontSize: 14, color: palette.text.secondary, ml: 1 }}
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
                  {t('button-propose-edits')}
                </Button>
              )}
            </Box>
          </Paper>
        ))}
      </Stack>
    );
  }

  return <></>;
}
