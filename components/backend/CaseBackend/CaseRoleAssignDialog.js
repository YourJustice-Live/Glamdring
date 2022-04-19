import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import { CASE_ROLE } from 'constants/contracts';
import useCaseContract from 'hooks/contracts/useCaseContract';
import useToasts from 'hooks/useToasts';
import { capitalize } from 'lodash';
import { useState } from 'react';

export default function CaseRoleAssignDialog({ isClose, onClose }) {
  const { showToastSuccess, showToastError } = useToasts();
  const { assignRole } = useCaseContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['contractAddress', 'account', 'role'],
    properties: {
      contractAddress: {
        type: 'string',
        title: 'Contract Address',
      },
      account: {
        type: 'string',
        title: 'Account',
      },
      role: {
        type: 'string',
        title: 'Role',
        default: CASE_ROLE.witness.name,
        enum: [CASE_ROLE.witness.name, CASE_ROLE.judge.name],
        enumNames: [
          capitalize(CASE_ROLE.witness.name),
          capitalize(CASE_ROLE.judge.name),
        ],
      },
    },
  };

  const uiSchema = {
    account: {
      'ui:placeholder': '0x430...',
    },
  };

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
    onClose();
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      await assignRole(
        formData.contractAddress,
        formData.account,
        formData.role,
      );
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={isLoading ? null : onClose}>
      <DialogTitle>Assign Case Role</DialogTitle>
      <DialogContent>
        <Form
          schema={schema}
          formData={formData}
          uiSchema={uiSchema}
          onSubmit={submit}
          disabled={isLoading}
        >
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {isLoading ? (
              <LoadingButton
                loading
                loadingPosition="start"
                startIcon={<Save />}
                variant="outlined"
              >
                Processing
              </LoadingButton>
            ) : (
              <>
                <Button variant="contained" type="submit">
                  Assign Role
                </Button>
                <Button variant="outlined" onClick={onClose}>
                  Cancel
                </Button>
              </>
            )}
          </Stack>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
