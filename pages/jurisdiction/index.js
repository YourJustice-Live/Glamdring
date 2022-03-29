import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import RoleManager from 'components/jurisdiction/RoleManager';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useWeb3Context from 'hooks/useWeb3Context';
import useJuridictionContract from 'hooks/useJurisdictionContract';
import useProfile from 'hooks/useProfile';
import useSubgraph from 'hooks/useSubgraph';
import useToasts from 'hooks/useToasts';
import { useEffect, useState } from 'react';
import { formatAccount } from "utils/formatters";

/**
 * Page with the jurisdiction.
 */
export default function Jurisdiction() {

  const { showToastSuccess, showToastError } = useToasts();
  const { getName, getOwner, isHasRole, join, leave } = useJuridictionContract();
  const { findJurisdictionParticipantEntities } = useSubgraph();
  const { getProfiles } = useProfile();
  const { account } = useWeb3Context();

  const [basicInformation, setBasicInformation] = useState(null);
  const [memberProfiles, setMemberProfiles] = useState(null);
  const [judgeProfiles, setJudgeProfiles] = useState(null);
  const [adminProfiles, setAdminProfiles] = useState(null);
  const [isJoiningOrLeaving, setIsJoiningOrLeaving] = useState(false);

  async function loadBasicInformation() {
    try {
      const name = await getName();
      const owner = await getOwner();
      const isAccountMember = account ? await isHasRole(account, JURISDICTION_ROLE.member) : null;
      const isAccountJudge = account ? await isHasRole(account, JURISDICTION_ROLE.judge) : null;
      const isAccountAdmin = account ? await isHasRole(account, JURISDICTION_ROLE.admin) : null;
      setBasicInformation({
        name: name,
        owner: owner,
        isAccountMember: isAccountMember,
        isAccountJudge: isAccountJudge,
        isAccountAdmin: isAccountAdmin
      });
    } catch (error) {
      showToastError(error);
    }
  }

  async function loadParticipants() {
    try {
      const participants = await findJurisdictionParticipantEntities();
      const memberProfiles = await getProfiles(participants.filter(participant => participant?.isMember).map(participant => participant?.id));
      const judgeProfiles = await getProfiles(participants.filter(participant => participant?.isJudge).map(participant => participant?.id));
      const adminProfiles = await getProfiles(participants.filter(participant => participant?.isAdmin).map(participant => participant?.id));
      setMemberProfiles(memberProfiles);
      setJudgeProfiles(judgeProfiles);
      setAdminProfiles(adminProfiles);
    } catch (error) {
      showToastError(error);
    }
  }

  async function joinOrLeave() {
    try {
      setIsJoiningOrLeaving(true);
      let transaction;
      if (basicInformation.isAccountMember) {
        transaction = await leave();
      } else {
        transaction = await join();
      }
      showToastSuccess("Success! Data will be updated soon.");
      await transaction.wait();
      await loadBasicInformation();
    }
    catch (error) {
      showToastError(error);
    } finally {
      setIsJoiningOrLeaving(false);
    }
  }

  useEffect(() => {
    loadBasicInformation();
    loadParticipants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout title={"YourJustice / Jurisdiction"} showAccountNavigation={!!account}>
      <Box>
        <Typography variant='h1' gutterBottom>Jurisdiction</Typography>
        <Divider sx={{ mb: 3 }} />
        {basicInformation ? (
          <>
            <Typography gutterBottom><b>Name: </b>{basicInformation.name}</Typography>
            <Typography gutterBottom><b>Owner: </b>{formatAccount(basicInformation.owner)}</Typography>
            {account && (
              <>
                <Typography gutterBottom><b>Account is member: </b>{basicInformation.isAccountMember ? "yes" : "no"}</Typography>
                <Typography gutterBottom><b>Account is judge: </b>{basicInformation.isAccountJudge ? "yes" : "no"}</Typography>
                <Typography gutterBottom><b>Account is admin: </b>{basicInformation.isAccountAdmin ? "yes" : "no"}</Typography>
              </>
            )}
          </>
        ) : (
          <>
            <Skeleton variant="rectangular" height={24} width={256} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={24} width={256} sx={{ mb: 1 }} />
          </>
        )}
      </Box>
      {basicInformation && account && (
        <Box sx={{ mt: 6 }}>
          <Typography variant='h4' gutterBottom>Actions</Typography>
          <Divider sx={{ mb: 2.5 }} />
          <Stack direction="row" spacing={1}>
            {isJoiningOrLeaving && (
              <LoadingButton loading loadingPosition="start" startIcon={<Save />} variant="outlined">
                {basicInformation.isAccountMember ? "Leaving" : "Joining"}
              </LoadingButton>
            )}
            {!isJoiningOrLeaving && (
              <Button variant="contained" type="submit" onClick={joinOrLeave}>
                {basicInformation.isAccountMember ? "Leave" : "Join"}
              </Button>
            )}
            {basicInformation.isAccountAdmin && (
              <RoleManager />
            )}
          </Stack>
        </Box>
      )}
      <Box sx={{ mt: 6 }}>
        <Typography variant='h4' gutterBottom>Members</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <ProfileList profiles={memberProfiles} />
      </Box>
      <Box sx={{ mt: 6 }}>
        <Typography variant='h4' gutterBottom>Judges</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <ProfileList profiles={judgeProfiles} />
      </Box>
      <Box sx={{ mt: 6 }}>
        <Typography variant='h4' gutterBottom>Admins</Typography>
        <Divider sx={{ mb: 2.5 }} />
        <ProfileList profiles={adminProfiles} />
      </Box>
    </Layout >
  )

}