import { useState } from 'react';
import { AddBoxOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import JurisdictionActionSelect from 'components/form/widget/JurisdictionActionSelect';
import JurisdictionProfileSelect from 'components/form/widget/JurisdictionProfileSelect';
import JurisdictionRuleSelect from 'components/form/widget/JurisdictionRuleSelect';
import useToasts from 'hooks/useToasts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';

/**
 * A component with a form to create jurisdiction case.
 *
 * TODO: Add feature to select multiple rules
 * TODO: Add feature to enter case name
 * TODO: Hide component if account is not connected or account is not member of jurisdiction
 * TODO: Improve appearance for form validation errors
 */
export default function JurisdictionCaseCreator() {
  const { showToastSuccess, showToastError } = useToasts();
  const { makeCase } = useJuridictionContract();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const schema = {
    type: 'object',
    properties: {
      actionGuid: {
        type: 'string',
        title: 'Action',
      },
    },
    required: ['actionGuid'],
    dependencies: {
      actionGuid: {
        properties: {
          ruleId: {
            type: 'string',
            title: 'Rule',
          },
        },
        required: ['ruleId'],
      },
      ruleId: {
        properties: {
          subjectProfileAccount: {
            type: 'string',
            title: 'Subject',
          },
          affectedProfileAccount: {
            type: 'string',
            title: 'Affected',
          },
        },
        required: ['subjectProfileAccount', 'affectedProfileAccount'],
      },
    },
  };

  const uiSchema = {
    actionGuid: {
      'ui:widget': 'JurisdictionActionSelect',
    },
    ruleId: {
      'ui:widget': 'JurisdictionRuleSelect',
    },
    subjectProfileAccount: {
      'ui:widget': 'JurisdictionProfileSelect',
    },
    affectedProfileAccount: {
      'ui:widget': 'JurisdictionProfileSelect',
    },
  };

  const widgets = {
    JurisdictionActionSelect: JurisdictionActionSelect,
    JurisdictionRuleSelect: JurisdictionRuleSelect,
    JurisdictionProfileSelect: JurisdictionProfileSelect,
  };

  async function open() {
    setIsOpen(true);
    setFormData({});
  }

  async function close() {
    setIsOpen(false);
  }

  function handleChange({ formData }) {
    setFormData(formData);
  }

  async function handleSubmit({ formData }) {
    try {
      setFormData(formData);
      const caseName = 'TEST_CASE';
      const caseRules = [
        {
          jurisdiction: process.env.NEXT_PUBLIC_JURISDICTION_CONTRACT_ADDRESS,
          ruleId: formData.ruleId,
        },
      ];
      const caseRoles = [
        {
          account: formData.subjectProfileAccount,
          role: 'subject',
        },
        {
          account: formData.affectedProfileAccount,
          role: 'affected',
        },
      ];
      await makeCase(caseName, caseRules, caseRoles);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <Box sx={{ mb: 12 }}>
      <Typography variant="h1" gutterBottom>
        Case Creator
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Button variant="contained" startIcon={<AddBoxOutlined />} onClick={open}>
        Create Case
      </Button>
      <Dialog open={isOpen} onClose={close}>
        <DialogTitle>Create New Case</DialogTitle>
        <DialogContent>
          <Form
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            widgets={widgets}
            formContext={{
              formData: formData,
            }}
            disabled={isLoading}
          >
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" type="submit">
                Create Case
              </Button>
              <Button variant="outlined" onClick={close}>
                Cancel
              </Button>
            </Stack>
          </Form>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
