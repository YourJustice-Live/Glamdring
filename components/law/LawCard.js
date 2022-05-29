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
import { useState } from 'react';
import { getActionIcon } from 'utils/metadata';

/**
 * A component with a card with law.
 */
export default function LawCard({ law, isCommentsEnabled, sx }) {
  const { showDialog, closeDialog } = useDialogContext();
  const [isRulesDisplayed, setIsRuleDisplayed] = useState(false);

  return (
    <Card elevation={1} sx={{ ...sx }}>
      <CardContent sx={{ p: 2.5 }}>
        {/* Action */}
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          {/* Action icon */}
          {getActionIcon(law?.action, 36)}
          {/* Action name and description */}
          <Box sx={{ ml: 1.5 }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {law?.action?.uriData?.name || 'None Action Name'}
            </Typography>
            {law?.action?.uriData?.description && (
              <Typography variant="body2" sx={{ mt: 0.3 }}>
                {law.action.uriData.description}
              </Typography>
            )}
          </Box>
        </Box>
        {/* Button to display rules */}
        <Button
          variant="text"
          onClick={() => setIsRuleDisplayed(!isRulesDisplayed)}
          sx={{
            mt: 1,
            color: 'text.primary',
          }}
          endIcon={
            <ArrowForwardIosOutlined
              sx={{
                transform: isRulesDisplayed ? 'rotate(90deg)' : 'none',
                width: 16,
              }}
            />
          }
        >
          <Typography sx={{ fontWeight: 'bold' }}>Rules</Typography>
        </Button>
        {/* Rules */}
        <Collapse in={isRulesDisplayed}>
          <Stack direction="column" spacing={2} sx={{ mt: 1 }}>
            {law?.rules?.map((rule, index) => (
              <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                {/* Rule id */}
                <Chip label={`ID: ${rule?.ruleId || 'None'}`} size="small" />
                {/* Rule negation and name */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    mt: 1.5,
                  }}
                >
                  {rule?.rule?.negation && (
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 'bold',
                        color: 'danger.primary',
                        mr: 0.5,
                      }}
                    >
                      NOT
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold', mr: 1 }}
                  >
                    {rule?.rule?.uriData?.name || 'None Rule Name'}
                  </Typography>
                </Box>
                {/* Rule description */}
                {rule?.rule?.uriData?.description && (
                  <Typography variant="body2" sx={{ mt: 0.3 }}>
                    {rule.rule.uriData.description}
                  </Typography>
                )}
                <RuleEffects rule={rule} sx={{ mt: 1.5 }} />
                {/* Comment law button */}
                {isCommentsEnabled && (
                  <Box sx={{ display: 'flex', direction: 'row', mt: 2 }}>
                    <LightbulbOutlined
                      fontSize="small"
                      sx={{ mr: 1, color: 'text.secondary' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Do you have an idea how to improve the law?
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
                        <strong>Propose</strong>
                      </Link>
                      edits or additions.
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}
