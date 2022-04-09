import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import CaseActionSelect from 'components/form/widget/CaseActionSelect';
import CaseProfileSelect from 'components/form/widget/CaseProfileSelect';
import CaseRuleSelect from 'components/form/widget/CaseRuleSelect';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';

/**
 * A component with a dialog to create a case.
 *
 * TODO: Add feature to select multiple rules
 * TODO: Add feature to enter case name
 * TODO: Hide component if account is not connected or account is not member of jurisdiction
 * TODO: Improve appearance for form validation errors
 */
export default function CaseCreateDialog({ onClose }) {
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
      'ui:widget': 'CaseActionSelect',
    },
    ruleId: {
      'ui:widget': 'CaseRuleSelect',
    },
    subjectProfileAccount: {
      'ui:widget': 'CaseProfileSelect',
    },
    affectedProfileAccount: {
      'ui:widget': 'CaseProfileSelect',
    },
  };

  const widgets = {
    CaseActionSelect: CaseActionSelect,
    CaseRuleSelect: CaseRuleSelect,
    CaseProfileSelect: CaseProfileSelect,
  };

  async function open() {
    setIsOpen(true);
    setFormData({});
  }

  async function close() {
    setIsOpen(false);
    onClose();
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

  useEffect(() => {
    open();
  }, []);

  return (
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
  );
}
