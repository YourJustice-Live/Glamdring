import { ArrowForwardOutlined } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Box,
  Chip,
  Divider,
  Link,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from '@mui/material';
import FeedbackPostDialog from 'components/feedback/FeedbackPostDialog';
import RuleEffects from 'components/rule/RuleEffects';
import { FORM } from 'constants/feedbacks';
import useDialogContext from 'hooks/useDialogContext';
import useJurisdiction from 'hooks/useJurisdiction';
import { useEffect, useState } from 'react';

/**
 * A widget to select case rule.
 */
export default function CaseRuleSelect(props) {
  const propsValue = props.value;
  const propsDisabled = props.disabled;
  const propsOnChange = props.onChange;
  const propsLaws = props.formContext?.laws;
  const propsFormCategory = props.formContext?.formData?.category;
  const propsFormActionGuid = props.formContext?.formData?.actionGuid;
  const { showDialog, closeDialog } = useDialogContext();
  const { isJurisdictionRuleInCategory } = useJurisdiction();
  const [items, setItems] = useState([]);

  /**
   * Get rules from laws by action guid and add it to items if rule in the specified category.
   */
  useEffect(() => {
    if (propsLaws && propsFormActionGuid) {
      const items = [];
      [...propsLaws.keys()].forEach((key) => {
        if (propsLaws.get(key).action.guid === propsFormActionGuid) {
          propsLaws.get(key).rules.forEach((rule) => {
            if (isJurisdictionRuleInCategory(rule, propsFormCategory)) {
              items.push(rule);
            }
          });
        }
      });
      setItems(items);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propsLaws, propsFormCategory, propsFormActionGuid]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold' }}>Rule</Typography>
      <Divider sx={{ my: 1.5 }} />
      <List>
        {items.map((item, index) => (
          <ListItemButton
            sx={{ py: 2.4 }}
            key={index}
            selected={item.ruleId === propsValue}
            disabled={propsDisabled}
            onClick={() => propsOnChange(item.ruleId)}
          >
            <ListItemIcon>
              <ArrowForwardOutlined />
            </ListItemIcon>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
              }}
            >
              <Typography sx={{ fontWeight: 'bold' }}>
                {item?.rule?.uriData?.name || 'None Name'}
              </Typography>
              <Chip
                label={`ID: ${item?.ruleId}`}
                size="small"
                sx={{ mt: 0.8 }}
              />
              <Typography variant="body2" sx={{ mt: 1.2 }}>
                {item?.rule?.uriData?.description || 'None Description'}
              </Typography>
              <RuleEffects rule={item} sx={{ mt: 1.2 }} />
            </Box>
          </ListItemButton>
        ))}
      </List>
      <Alert
        severity="info"
        sx={{ borderRadius: '8px', boxShadow: 'none', mt: 1, mb: 0 }}
      >
        <AlertTitle>Didn&apos;t find a suitable law?</AlertTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">
            <Link
              component="button"
              variant="body2"
              underline="none"
              sx={{ mr: 0.5, pb: 0.3 }}
              onClick={() =>
                showDialog(
                  <FeedbackPostDialog
                    form={FORM.proposeLaw}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              <strong>Propose</strong>
            </Link>
            a law that we should add to the jurisdiction.
          </Typography>
        </Box>
      </Alert>
    </Box>
  );
}
