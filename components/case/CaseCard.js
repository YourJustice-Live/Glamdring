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
  return (
    <Card elevation={1}>
      <CardContent sx={{ p: 4 }}>
        <CaseAddress caseObject={caseObject} />
        <CaseName caseObject={caseObject} sx={{ mt: 0.5 }} />
        <CaseAdmin caseObject={caseObject} sx={{ mt: 0.5 }} />
        <CaseStage caseObject={caseObject} sx={{ mt: 0.5 }} />
        <CaseCreatedDate caseObject={caseObject} sx={{ mt: 0.5 }} />
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Case Laws
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseLaws caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Case Participants
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseParticipants caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6 }}>
          <Typography variant="h3" gutterBottom>
            Case Posts
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CasePosts caseObject={caseObject} />
        </Box>
        <Box sx={{ mt: 6, mb: 3 }}>
          <Typography variant="h3" gutterBottom>
            Case Verdict
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <CaseVerdict caseObject={caseObject} />
        </Box>
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
    <Stack direction="row" spacing={1} sx={{ ...sx }}>
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
    <Stack spacing={2}>
      {/* Post list */}
      {caseObject.posts.length == 0 && <Typography>None</Typography>}
      {caseObject.posts.length > 0 && (
        <>
          {caseObject.posts.map((post, index) => (
            <Paper key={index} sx={{ p: 2, overflowX: 'scroll' }}>
              {/* Post author */}
              <Stack direction="row" spacing={1}>
                <Typography variant="body2">Author:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {formatAddress(post.author)}
                </Typography>
              </Stack>
              {/* Post author role */}
              <Stack direction="row" spacing={1}>
                <Typography variant="body2">Author Role:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {capitalize(post.entityRole)}
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
                <Stack direction="row" spacing={1}>
                  <Typography variant="body2">Message:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {hexStringToJson(post.uriData)?.commentMessage || 'Unknown'}
                  </Typography>
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

function CaseVerdict({ caseObject }) {
  const { account } = useWeb3Context();
  const { showDialog, closeDialog } = useDialogContext();

  function isAccountCaseJudge(account, caseObject) {
    const judgeRole = caseObject.roles.find(
      (role) => role.roleId === CASE_ROLE.judge.id,
    );
    return judgeRole?.accounts?.includes(account);
  }

  return (
    <Stack spacing={2}>
      {/* Verdict */}
      {caseObject.stage === CASE_STAGE.closed.id && (
        <Paper sx={{ p: 2 }}>
          <Stack direction="row" spacing={1}>
            <Typography variant="body2">Judge:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {formatAddress(caseObject.verdictAuthor)}
            </Typography>
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
                  onClose={closeDialog}
                />,
              )
            }
          >
            Make Verdict
          </Button>
        )}
    </Stack>
  );
}
