import { useState } from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import FormDialog from 'components/extra/FormDialog';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';

/**
 * A component for adding or removing role for specified account.
 */
export default function JurisdictionRolesManager() {
  return (
    <Box sx={{ mb: 8 }}>
      <Typography variant="h4" gutterBottom>
        Roles
      </Typography>
      <Divider sx={{ mb: 2.5 }} />
      <Stack direction="row" spacing={2}>
        <AssignRoleFormDialog />
        <RemoveRoleFormDialog />
      </Stack>
    </Box>
  );
}

/**
 * A component with button and form for adding role for specified account.
 */
function AssignRoleFormDialog() {
  const { showToastSuccess, showToastError } = useToasts();
  const { assignRole } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        default: JURISDICTION_ROLE.member,
        enum: [
          JURISDICTION_ROLE.member,
          JURISDICTION_ROLE.judge,
          JURISDICTION_ROLE.admin,
        ],
        enumNames: ['Member', 'Judge', 'Admin'],
      },
    },
  };

  const uiSchema = {
    account: {
      'ui:placeholder': '0x430...',
    },
  };

  async function open() {
    setIsOpen(true);
  }

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      await assignRole(formData.account, formData.role);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <FormDialog
      buttonTitle="Add Role"
      formTitle="Add Role"
      formText="Add a role for specified account."
      formSchema={schema}
      formUiSchema={uiSchema}
      formData={formData}
      isLoading={isLoading}
      isOpen={isOpen}
      onOpen={open}
      onClose={close}
      onSubmit={submit}
    />
  );
}

/**
 * A component with button and form for removing role for specified account.
 */
function RemoveRoleFormDialog() {
  const { showToastSuccess, showToastError } = useToasts();
  const { removeRole } = useJuridictionContract();
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        default: JURISDICTION_ROLE.member,
        enum: [
          JURISDICTION_ROLE.member,
          JURISDICTION_ROLE.judge,
          JURISDICTION_ROLE.admin,
        ],
        enumNames: ['Member', 'Judge', 'Admin'],
      },
    },
  };

  const uiSchema = {
    account: {
      'ui:placeholder': '0x430...',
    },
  };

  async function open() {
    setIsOpen(true);
  }

  async function close() {
    setFormData({});
    setIsLoading(false);
    setIsOpen(false);
  }

  async function submit({ formData }) {
    try {
      setFormData(formData);
      setIsLoading(true);
      await removeRole(formData.account, formData.role);
      showToastSuccess('Success! Data will be updated soon.');
      close();
    } catch (error) {
      showToastError(error);
      setIsLoading(false);
    }
  }

  return (
    <FormDialog
      buttonTitle="Remove Role"
      formTitle="Remove Role"
      formText="Remove a role for specified account."
      formSchema={schema}
      formUiSchema={uiSchema}
      formData={formData}
      isLoading={isLoading}
      isOpen={isOpen}
      onOpen={open}
      onClose={close}
      onSubmit={submit}
    />
  );
}
