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
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useErrors from 'hooks/useErrors';
import useToasts from 'hooks/useToasts';
import { capitalize } from 'lodash';
import { useState } from 'react';

/**
 * A dialog for assign or remove jurisdiction role for a specified account.
 */
export default function RoleManageDialog({
  jurisdiction,
  isAssign,
  isClose,
  onClose,
}) {
  const { handleError } = useErrors();
  const { showToastSuccess } = useToasts();
  const { assignRole, removeRole } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(!isClose);

  const schema = {
    type: 'object',
    required: ['account', 'role'],
    properties: {
      account: {
        type: 'string',
        title: 'Account',
      },
      role: {
        type: 'string',
        title: 'Role',
        default: JURISDICTION_ROLE.member.name,
        enum: [
          JURISDICTION_ROLE.member.name,
          JURISDICTION_ROLE.judge.name,
          JURISDICTION_ROLE.admin.name,
        ],
        enumNames: [
          capitalize(JURISDICTION_ROLE.member.name),
          capitalize(JURISDICTION_ROLE.judge.name),
          capitalize(JURISDICTION_ROLE.admin.name),
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
      if (isAssign) {
        await assignRole(jurisdiction?.id, formData.account, formData.role);
      } else {
        await removeRole(jurisdiction?.id, formData.account, formData.role);
      }
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      handleError(error, true);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onClose={isLoading ? null : onClose}>
      <DialogTitle>{isAssign ? 'Assign Role' : 'Remove Role'}</DialogTitle>
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
                  {isAssign ? 'Assign Role' : 'Remove Role'}
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
