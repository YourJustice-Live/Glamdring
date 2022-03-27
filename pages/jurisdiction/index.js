import { Button, Divider, Skeleton, Typography, Stack } from '@mui/material';
import { Box } from '@mui/system';
import LoadingBackdrop from 'components/extra/LoadingBackdrop';
import RoleManager from 'components/jurisdiction/RoleManager';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useAccount from 'hooks/useAccount';
import useJuridictionContract from 'hooks/useJurisdictionContract';
import useProfile from 'hooks/useProfile';
import useSubgraph from 'hooks/useSubgraph';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { formatAccount } from "utils/formatters";

/**
 * Page with jurisdiction data.
 */
export default function Jurisdiction() {

  const { enqueueSnackbar } = useSnackbar();
  const { account } = useAccount();
  const { getName, getOwner, isHasRole, join, leave } = useJuridictionContract();
  const { findJurisdictionParticipantEntities } = useSubgraph();
  const { getProfiles } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(null);
  const [owner, setOwner] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [isJudge, setIsJudge] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [memberProfiles, setMemberProfiles] = useState(null);
  const [judgeProfiles, setJudgeProfiles] = useState(null);
  const [adminProfiles, setAdminProfiles] = useState(null);

  async function loadData() {
    try {
      setIsLoading(true);
      setName(await getName());
      setOwner(await getOwner());
      if (account) {
        setIsMember(await isHasRole(account, JURISDICTION_ROLE.member));
        setIsJudge(await isHasRole(account, JURISDICTION_ROLE.judge));
        setIsAdmin(await isHasRole(account, JURISDICTION_ROLE.admin));
      }
      const participants = await findJurisdictionParticipantEntities();
      const memberProfiles = await getProfiles(participants.filter(participant => participant?.isMember).map(participant => participant?.id));
      const judgeProfiles = await getProfiles(participants.filter(participant => participant?.isJudge).map(participant => participant?.id));
      const adminProfiles = await getProfiles(participants.filter(participant => participant?.isAdmin).map(participant => participant?.id));
      setMemberProfiles(memberProfiles);
      setJudgeProfiles(judgeProfiles);
      setAdminProfiles(adminProfiles);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  async function joinJurisdiction() {
    try {
      setIsLoading(true);
      const transaction = await join();
      await transaction.wait();
      enqueueSnackbar("You joined the jurisdiction!", { variant: 'success' });
      loadData();
    }
    catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
      setIsLoading(false);
    }
  }

  async function leaveJurisdiction() {
    try {
      setIsLoading(true);
      const transaction = await leave();
      await transaction.wait();
      enqueueSnackbar("You left the jurisdiction!", { variant: 'success' });
      loadData();
    }
    catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout title={"YourJustice / Jurisdiction"} showAccountNavigation={!!account}>
      {isLoading ? (
        <>
          <LoadingBackdrop />
          <Skeleton variant="rectangular" height={32} width={256} />
          <Skeleton variant="rectangular" height={18} width={198} sx={{ mt: 1 }} />
          <Skeleton variant="rectangular" height={18} width={64} sx={{ mt: 1 }} />
        </>
      ) : (
        <>
          <Box>
            <Typography variant='h1' gutterBottom>Jurisdiction</Typography>
            <Divider sx={{ mb: 3 }} />
            <Typography gutterBottom><b>Name: </b>{name || "None"}</Typography>
            <Typography gutterBottom><b>Owner: </b>{formatAccount(owner) || "None"}</Typography>
            {account && (
              <>
                <Typography gutterBottom><b>Account is member: </b>{isMember ? "yes" : "no"}</Typography>
                <Typography gutterBottom><b>Account is judge: </b>{isJudge ? "yes" : "no"}</Typography>
                <Typography gutterBottom><b>Account is admin: </b>{isAdmin ? "yes" : "no"}</Typography>
              </>
            )}
          </Box>
          {account && (
            <Box sx={{ mt: 6 }}>
              <Typography variant='h4' gutterBottom>Actions</Typography>
              <Divider sx={{ mb: 2.5 }} />
              <Stack direction="row" spacing={1}>
                {!isMember && (
                  <Button variant="contained" type="submit" onClick={joinJurisdiction}>Join</Button>
                )}
                {isMember && (
                  <Button variant="contained" type="submit" onClick={leaveJurisdiction}>Leave</Button>
                )}
                {isAdmin && (
                  <RoleManager />
                )}
              </Stack>
            </Box>
          )}
          <Box sx={{ mt: 6 }}>
            <Typography variant='h4' gutterBottom>Members</Typography>
            <Divider sx={{ mb: 2.5 }} />
            <ProfileList
              profiles={memberProfiles}
              onUpdateProfiles={() => {
                setMemberProfiles(null);
                loadData();
              }}
            />
          </Box>
          <Box sx={{ mt: 6 }}>
            <Typography variant='h4' gutterBottom>Judges</Typography>
            <Divider sx={{ mb: 2.5 }} />
            <ProfileList
              profiles={judgeProfiles}
              onUpdateProfiles={() => {
                setJudgeProfiles(null);
                loadData();
              }}
            />
          </Box>
          <Box sx={{ mt: 6 }}>
            <Typography variant='h4' gutterBottom>Admins</Typography>
            <Divider sx={{ mb: 2.5 }} />
            <ProfileList
              profiles={adminProfiles}
              onUpdateProfiles={() => {
                setAdminProfiles(null);
                loadData();
              }}
            />
          </Box>
        </>
      )}
    </Layout >
  )

}