import {
  Button,
  Card,
  CardContent,
  Divider,
  Link,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import LawList from 'components/law/LawList';
import ProfileCompactCard from 'components/profile/ProfileCompactCard';
import { CASE_ROLE, CASE_STAGE } from 'constants/contracts';
import useDialogContext from 'hooks/useDialogContext';
import useLaw from 'hooks/useLaw';
import useRule from 'hooks/useRule';
import useWeb3Context from 'hooks/useWeb3Context';
import { capitalize } from 'lodash';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { hexStringToJson } from 'utils/converters';
import { formatAddress } from 'utils/formatters';
import CaseCommentPostAddDialog from './CaseCommentPostAddDialog';
import CaseVerdictMakeDialog from './CaseVerdictMakeDialog';

/**
 * A component with a card with case.
 */
export default function CaseCard({ caseObject }) {
  const { getRulesByIds } = useRule();
  const { getLawsByRules } = useLaw();
  const [caseLaws, setCaseLaws] = useState(null);

  async function loadData() {
    const ruleIds = caseObject.rules.map((rule) => rule.id);
    const rules = await getRulesByIds(ruleIds);
    const laws = await getLawsByRules(rules);
    setCaseLaws(laws);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseObject]);

  return (
    <Card elevation={1}>
      <CardContent sx={{ p: 4 }}>
        <CaseAddress caseObject={caseObject} />
        <CaseName caseObject={caseObject} sx={{ mt: 0.5 }} />
        <CaseAdmin caseObject={caseObject} sx={{ mt: 0.5 }} />
        <CaseStage caseObject={caseObject} sx={{ mt: 0.5 }} />
        <CaseCreatedDate caseObject={caseObject} sx={{ mt: 0.5 }} />
        <CaseLaws caseLaws={caseLaws} sx={{ mt: 6 }} />
        <CaseParticipants caseObject={caseObject} sx={{ mt: 6 }} />
        <CasePosts caseObject={caseObject} sx={{ mt: 6 }} />
        <CaseVerdict
          caseObject={caseObject}
          caseLaws={caseLaws}
          sx={{ mt: 6, mb: 3 }}
        />
      </CardContent>
    </Card>
  );
}

function CaseAddress({ caseObject, sx }) {
  return (
    <Stack direction="row" spacing={1} sx={{ ...sx }}>
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

function CaseName({ caseObject, sx }) {
  return (
    <Stack direction="row" spacing={1} sx={{ ...sx }}>
      <Typography variant="body2">Name: </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {caseObject.name}
      </Typography>
    </Stack>
  );
}

function CaseAdmin({ caseObject, sx }) {
  const [adminAccount, setAdminAccount] = useState(null);

  useEffect(() => {
    const adminRoles = caseObject.roles.find(
      (role) => role.roleId === CASE_ROLE.admin.id,
    );
    setAdminAccount(adminRoles.accounts[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ ...sx }}>
      <Typography variant="body2">Admin: </Typography>
      <ProfileCompactCard account={adminAccount} />
    </Stack>
  );
}

function CaseStage({ caseObject, sx }) {
  function getStageName(caseObject) {
    let stageName = caseObject.stage;
    for (const stage of Object.values(CASE_STAGE)) {
      if (stage.id === caseObject.stage) {
        stageName = capitalize(stage.name);
      }
    }
    return stageName;
  }

  return (
    <Stack direction="row" spacing={1} sx={{ ...sx }}>
      <Typography variant="body2">Stage: </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {getStageName(caseObject)}
      </Typography>
    </Stack>
  );
}

function CaseCreatedDate({ caseObject, sx }) {
  return (
    <Stack direction="row" spacing={1} sx={{ ...sx }}>
      <Typography variant="body2">Created Date: </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
        {new Date(caseObject.createdDate * 1000).toLocaleString()}
      </Typography>
    </Stack>
  );
}

function CaseLaws({ caseLaws, sx }) {
  return (
    <Box sx={{ ...sx }}>
      <Typography variant="h3" gutterBottom>
        Case Laws
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <LawList laws={caseLaws} />
    </Box>
  );
}

function CasePosts({ caseObject, sx }) {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();

  function isAccountHasRole(account, caseObject) {
    let result = false;
    caseObject.roles.forEach((role) => {
      if (role.accounts.includes(account)) {
        result = true;
      }
    });
    return result;
  }

  return (
    <Box sx={{ ...sx }}>
      <Typography variant="h3" gutterBottom>
        Case Posts
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Stack spacing={2}>
        {/* Post list */}
        {caseObject.posts.length == 0 && <Typography>None</Typography>}
        {caseObject.posts.length > 0 && (
          <>
            {caseObject.posts.map((post, index) => (
              <Paper key={index} sx={{ p: 2, overflowX: 'scroll' }}>
                {/* Post author */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2">Author:</Typography>
                  <ProfileCompactCard account={post.author} />
                </Stack>
                {/* Post author role */}
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2">Author Role:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {capitalize(post.entityRole)}
                  </Typography>
                </Stack>
                {/* Post created date */}
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2">Created Date:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {new Date(post.createdDate * 1000).toLocaleString()}
                  </Typography>
                </Stack>
                {/* Post type */}
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2">Type:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {capitalize(post.uriType || 'Unknown')}
                  </Typography>
                </Stack>
                {/* Evidence post */}
                {post.uriType === 'evidence' && (
                  <Stack direction="row" spacing={1}>
                    <Typography variant="body2">Evidence:</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      <Link
                        href={
                          hexStringToJson(post.uriData)?.evidenceFileUri || '#'
                        }
                        underline="none"
                        target="_blank"
                      >
                        {hexStringToJson(post.uriData)?.evidenceTitle ||
                          'Unknown'}
                      </Link>
                    </Typography>
                  </Stack>
                )}
                {/* Comment post */}
                {post.uriType === 'comment' && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">Message:</Typography>
                    <Paper variant="outlined" sx={{ py: 1, px: 2 }}>
                      <Typography variant="body2">
                        {hexStringToJson(post.uriData)?.commentMessage ||
                          'Unknown'}
                      </Typography>
                    </Paper>
                  </Stack>
                )}
                {/* Uri */}
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2">Uri:</Typography>
                  {post.uri ? (
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', maxWidth: '240px' }}
                    >
                      <Link href={post.uri} underline="none" target="_blank">
                        {post.uri}
                      </Link>
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'bold', color: 'danger.main' }}
                    >
                      Not available
                    </Typography>
                  )}
                </Stack>
              </Paper>
            ))}
          </>
        )}
        {/* Add comment post form */}
        {caseObject.stage === CASE_STAGE.open.id &&
          isAccountHasRole(account, caseObject) && (
            <Button
              variant="outlined"
              onClick={() =>
                showDialog(
                  <CaseCommentPostAddDialog
                    caseObject={caseObject}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              Add Comment Post
            </Button>
          )}
      </Stack>
    </Box>
  );
}

function CaseParticipants({ caseObject, sx }) {
  function getRoleString(roleId) {
    if (roleId === CASE_ROLE.admin.id) {
      return capitalize(CASE_ROLE.admin.name);
    }
    if (roleId === CASE_ROLE.subject.id) {
      return capitalize(CASE_ROLE.subject.name);
    }
    if (roleId === CASE_ROLE.plaintiff.id) {
      return capitalize(CASE_ROLE.plaintiff.name);
    }
    if (roleId === CASE_ROLE.judge.id) {
      return capitalize(CASE_ROLE.judge.name);
    }
    if (roleId === CASE_ROLE.witness.id) {
      return capitalize(CASE_ROLE.witness.name);
    }
    if (roleId === CASE_ROLE.affected.id) {
      return capitalize(CASE_ROLE.affected.name);
    }
    return 'Unkown Role';
  }

  return (
    <Box sx={{ ...sx }}>
      <Typography variant="h3" gutterBottom>
        Case Participants
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Stack spacing={2}>
        {caseObject.roles.map((role, roleIndex) => (
          <Box key={roleIndex}>
            <Typography sx={{ fontWeight: 'bold' }} gutterBottom>
              {getRoleString(role.roleId)}
            </Typography>
            {role.accounts.map((account, accountIndex) => (
              <ProfileCompactCard
                key={accountIndex}
                account={account}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function CaseVerdict({ caseObject, caseLaws, sx }) {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();

  function isAccountCaseJudge(account, caseObject) {
    const judgeRole = caseObject.roles.find(
      (role) => role.roleId === CASE_ROLE.judge.id,
    );
    return judgeRole?.accounts?.includes(account);
  }

  return (
    <Box sx={{ ...sx }}>
      <Typography variant="h3" gutterBottom>
        Case Verdict
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Stack spacing={2}>
        {/* Verdict */}
        {caseObject.stage === CASE_STAGE.closed.id && (
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body2">Judge:</Typography>
              <ProfileCompactCard account={caseObject.verdictAuthor} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="body2">Message:</Typography>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {hexStringToJson(caseObject.verdictUriData)?.verdictMessage ||
                  'Unknown'}
              </Typography>
            </Stack>
          </Paper>
        )}
        {caseObject.stage === CASE_STAGE.verdict.id && (
          <Typography>The judge&apos;s verdict is awaited.</Typography>
        )}
        {caseObject.stage !== CASE_STAGE.closed.id &&
          caseObject.stage !== CASE_STAGE.verdict.id && (
            <Typography>
              The verdict can be made by the judge when the case has a
              &quot;Verdict&quot; stage.
            </Typography>
          )}
        {/* Add verdict form */}
        {caseObject.stage === CASE_STAGE.verdict.id &&
          isAccountCaseJudge(account, caseObject) && (
            <Button
              variant="outlined"
              onClick={() =>
                showDialog(
                  <CaseVerdictMakeDialog
                    caseObject={caseObject}
                    caseLaws={caseLaws}
                    onClose={closeDialog}
                  />,
                )
              }
            >
              Make Verdict
            </Button>
          )}
      </Stack>
    </Box>
  );
}
