import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import LawList from 'components/law/LawList';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import useDialogContext from 'hooks/useDialogContext';
import useLaw from 'hooks/useLaw';
import useRule from 'hooks/useRule';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { formatAddress } from 'utils/formatters';
import CasePostAddDialog from './CasePostAddDialog';
import CaseStageChangeDialog from './CaseStageChangeDialog';

/**
 * A component with a card with case.
 */
export default function CaseCard({ caseObject }) {
  return (
    <Card elevation={1}>
      <CardContent sx={{ p: 4 }}>
        <Box>
          <CaseAddress caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 0.5 }}>
          <CaseAdmin caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 0.5 }}>
          <CaseStage caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Case Laws
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseLaws caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Case Posts
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CasePosts caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Case Participants
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseParticipants caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <CaseActions caseObject={caseObject} />
        </Box>
      </CardContent>
    </Card>
  );
}

function CaseAddress({ caseObject }) {
  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2">Address: </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        <NextLink
          href={`${process.env.NEXT_PUBLIC_NETWORK_BLOCK_EXPLORER_URL}address/${caseObject.id}`}
          passHref
        >
          <Link underline="none" target="_blank">
            {formatAddress(caseObject.id)}
          </Link>
        </NextLink>
      </Typography>
    </Stack>
  );
}

function CaseAdmin({ caseObject }) {
  const [adminAccount, setAdminAccount] = useState(null);

  useEffect(() => {
    const adminRoles = caseObject.roles.find(
      (role) => role.roleId === CASE_ROLE.admin.id,
    );
    setAdminAccount(adminRoles.accounts[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2">Admin: </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {adminAccount ? (
          <NextLink href={`/profile/${adminAccount}`} passHref>
            <Link underline="none" target="_blank">
              {formatAddress(adminAccount)}
            </Link>
          </NextLink>
        ) : (
          'Loading...'
        )}
      </Typography>
    </Stack>
  );
}

function CaseStage({ caseObject }) {
  function getStageString(caseObject) {
    if (!caseObject?.stage || caseObject.stage === CASE_STAGE.draft) {
      return 'Draft';
    }
    if (caseObject.stage === CASE_STAGE.verdict) {
      return 'Verdict';
    }
    if (caseObject.stage === CASE_STAGE.closed) {
      return 'Closed';
    }
    return 'Unknown';
  }

  return (
    <Stack direction="row" spacing={1}>
      <Typography variant="body2">Stage: </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {getStageString(caseObject)}
      </Typography>
    </Stack>
  );
}

function CaseLaws({ caseObject }) {
  const { getRulesByIds } = useRule();
  const { getLawsByRules } = useLaw();
  const [laws, setLaws] = useState(null);

  async function loadData() {
    const ruleIds = caseObject.rules.map((rule) => rule.id);
    const rules = await getRulesByIds(ruleIds);
    const laws = await getLawsByRules(rules);
    setLaws(laws);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LawList laws={laws} />;
}

function CasePosts({ caseObject }) {
  function getPostRoleString(postRole) {
    if (postRole === 'evidence') {
      return 'Evidence';
    }
    return 'Unknown Post Role';
  }

  return (
    <Stack spacing={2}>
      {caseObject.posts.length === 0 && <Typography>None</Typography>}
      {caseObject.posts.length > 0 && (
        <>
          {caseObject.posts.map((post, index) => (
            <Box key={index}>
              <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
                {getPostRoleString(post.postRole)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 'bold' }}
                gutterBottom
              >
                <Link href={post.uri} underline="none" target="_blank">
                  {post.uri}
                </Link>
              </Typography>
            </Box>
          ))}
        </>
      )}
    </Stack>
  );
}

function CaseParticipants({ caseObject }) {
  function getRoleString(roleId) {
    if (roleId === CASE_ROLE.admin.id) {
      return 'Admin';
    }
    if (roleId === CASE_ROLE.subject.id) {
      return 'Subject';
    }
    if (roleId === CASE_ROLE.plaintiff.id) {
      return 'Plaintiff';
    }
    if (roleId === CASE_ROLE.judge.id) {
      return 'Judge';
    }
    if (roleId === CASE_ROLE.witness.id) {
      return 'Witness';
    }
    if (roleId === CASE_ROLE.affected.id) {
      return 'Affected';
    }
    return 'Unkown Role';
  }

  return (
    <Stack spacing={2}>
      {caseObject.roles.map((role, roleIndex) => (
        <Box key={roleIndex}>
          <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
            {getRoleString(role.roleId)}
          </Typography>
          {role.accounts.map((account, accountIndex) => (
            <Typography
              key={accountIndex}
              variant="body2"
              sx={{ fontWeight: 'bold' }}
              gutterBottom
            >
              <NextLink href={`/profile/${account}`} passHref>
                <Link underline="none" target="_blank">
                  {formatAddress(account)}
                </Link>
              </NextLink>
            </Typography>
          ))}
        </Box>
      ))}
    </Stack>
  );
}

function CaseActions({ caseObject }) {
  const { showDialog, closeDialog } = useDialogContext();
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
      <Button
        variant="outlined"
        onClick={() =>
          showDialog(
            <CasePostAddDialog caseObject={caseObject} onClose={closeDialog} />,
          )
        }
      >
        Add Post
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          showDialog(
            <CaseStageChangeDialog
              caseObject={caseObject}
              onClose={closeDialog}
            />,
          )
        }
      >
        Change Stage
      </Button>
      <Button
        variant="outlined"
        onClick={() =>
          showDialog(
            <CaseJsonDialog caseObject={caseObject} onClose={closeDialog} />,
          )
        }
      >
        Open JSON
      </Button>
    </Stack>
  );
}

function CaseJsonDialog({ caseObject, isClose, onClose }) {
  const [isOpen, setIsOpen] = useState(!isClose);

  async function close() {
    setIsOpen(false);
    onClose();
  }

  return (
    <Dialog open={isOpen} onClose={close}>
      <DialogTitle>Case JSON</DialogTitle>
      <DialogContent sx={{ overflowX: 'scroll' }}>
        <pre style={{ maxWidth: '480px' }}>
          {JSON.stringify(caseObject, null, 2)}
        </pre>
      </DialogContent>
    </Dialog>
  );
}
