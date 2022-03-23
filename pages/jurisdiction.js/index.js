import { Button, Divider, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import LoadingBackdrop from 'components/extra/LoadingBackdrop';
import Layout from 'components/layout/Layout';
import ProfileList from 'components/profile/ProfileList';
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
  const { findJurisdictionMembers } = useSubgraph();
  const { getProfiles } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(null);
  const [owner, setOwner] = useState(null);
  const [isMember, setIsMember] = useState(null);
  const [isJudge, setIsJudge] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [memberProfiles, setMemberProfiles] = useState(null);

  async function loadData() {
    try {
      setIsLoading(true);
      setName(await getName());
      setOwner(await getOwner());
      if (account) {
        setIsMember(await isHasRole(account, "member"));
        setIsJudge(await isHasRole(account, "judge"));
        setIsAdmin(await isHasRole(account, "admin"));
      }
      const members = await findJurisdictionMembers();
      const memberProfiles = await getProfiles(members.map((member) => member.id));
      setMemberProfiles(memberProfiles);
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
          <Skeleton variant="rectangular" height={32} width={512} />
          <Skeleton variant="rectangular" height={18} width={396} sx={{ mt: 1 }} />
          <Skeleton variant="rectangular" height={18} width={128} sx={{ mt: 1 }} />
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
              {!isMember && (
                <Button variant="outlined" type="submit" onClick={joinJurisdiction}>Join</Button>
              )}
              {isMember && (
                <Button variant="outlined" type="submit" onClick={leaveJurisdiction}>Leave</Button>
              )}
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
            <Typography><b></b>Unknown</Typography>
          </Box>
          <Box sx={{ mt: 6 }}>
            <Typography variant='h4' gutterBottom>Admins</Typography>
            <Divider sx={{ mb: 2.5 }} />
            <Typography><b></b>Unknown</Typography>
          </Box>
        </>
      )}
    </Layout >
  )

}