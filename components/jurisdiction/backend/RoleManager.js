import { useState } from 'react';
import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { MuiForm5 as Form } from '@rjsf/material-ui';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJuridictionContract from 'hooks/useJurisdictionContract';
import useToasts from 'hooks/useToasts';

/**
 * A component with a button and dialog for manage jurisdiction roles.
 */
export default function RoleManager() {
  const { showToastSuccess, showToastError } = useToasts();
  const { assignRole, removeRole } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const action = {
    assign: 'assign',
    remove: 'remove',
  };

  const schema = {
    type: 'object',
    required: ['account', 'role', 'action'],
    properties: {
      account: {
        type: 'string',
        title: 'Account',
      },
      role: {
        type: 'string',
        title: 'Role',
        default: JURISDICTION_ROLE.member,
        enum: [
          JURISDICTION_ROLE.member,
          JURISDICTION_ROLE.judge,
          JURISDICTION_ROLE.admin,
        ],
        enumNames: ['Member', 'Judge', 'Admin'],
      },
      action: {
        type: 'string',
        title: 'Action',
        default: 'assign',
        enum: [action.assign, action.remove],
        enumNames: ['Assign Role', 'Remove Role'],
      },
    },
  };

  const uiSchema = {
    account: {
      'ui:placeholder': '0x430...',
    },
  };

  function open() {
    setIsOpen(true);
  }

  function close() {
    setFormData({});
    setIsLoading(null);
    setIsOpen(false);
  }

  async function submit({ formData }) {
    try {
      // Update states
      setFormData(formData);
      setIsLoading(true);
      // Use contract
      if (formData.action === action.assign) {
        await assignRole(formData.account, formData.role);
      }
      if (formData.action === action.remove) {
        await removeRole(formData.account, formData.role);
      }
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <>
      <Button variant="outlined" onClick={open}>
        Manage Roles
      </Button>
      <Dialog open={isOpen} onClose={isLoading ? null : close}>
        <DialogTitle>Role Manager</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Assign or remove a role for the specified account.
          </DialogContentText>
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
                    Submit
                  </Button>
                  <Button variant="outlined" onClick={close}>
                    Cancel
                  </Button>
                </>
              )}
            </Stack>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
