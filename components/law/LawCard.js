import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import FeedbackPostDialog from 'components/feedback/FeedbackPostDialog';
import RuleEffects from 'components/rule/RuleEffects';
import { FORM } from 'constants/feedbacks';
import useDialogContext from 'hooks/useDialogContext';

/**
 * A component with a card with law.
 */
export default function LawCard({ law, isCommentsEnabled }) {
  const { showDialog, closeDialog } = useDialogContext();

  return (
    <Card elevation={1}>
      {/* Avatar with name */}
      <CardContent sx={{ p: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>L</Avatar>
          <Typography sx={{ fontWeight: 'bold' }}>
            {law.action.uriData.name}
          </Typography>
        </Stack>
        {/* Description */}
        <Box sx={{ mt: 2 }}>
          <Typography>{law.action.uriData.description}</Typography>
        </Box>
        {/* Rules */}
        <Stack direction="column" spacing={1} sx={{ mt: 3 }}>
          {law.rules.map((rule, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontWeight: 'bold' }}>
                  {rule.rule.uriData?.name || 'None Name'}
                </Typography>
                <Chip label={`ID: ${rule.ruleId}`} size="small" />
              </Stack>
              <Typography sx={{ mt: 1 }}>
                {rule.rule.uriData?.description || 'None Description'}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <RuleEffects rule={rule} />
              </Box>
              {/* Add comment button */}
              {isCommentsEnabled && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() =>
                    showDialog(
                      <FeedbackPostDialog
                        form={FORM.commentLaw}
                        additionalData={{ rule: rule.ruleId }}
                        onClose={closeDialog}
                      />,
                    )
                  }
                  sx={{ mt: 2 }}
                >
                  Add Comment
                </Button>
              )}
            </Paper>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
