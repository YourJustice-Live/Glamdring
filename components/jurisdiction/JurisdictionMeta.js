import { useEffect, useState } from 'react';
import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, Divider, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { JURISDICTION_ROLE } from 'constants/contracts';
import useJuridictionContract from 'hooks/contracts/useJurisdictionContract';
import useToasts from 'hooks/useToasts';
import useWeb3Context from 'hooks/useWeb3Context';
import { formatAccount } from 'utils/formatters';

/**
 * A component with jurisdiction meta (title, image, etc).
 */
export default function JurisdictionMeta() {
  const { showToastSuccess, showToastError } = useToasts();
  const { getName, getOwner, isHasRole, join, leave } =
    useJuridictionContract();
  const { account } = useWeb3Context();

  const [data, setData] = useState(null);
  const [isJoiningOrLeaving, setIsJoiningOrLeaving] = useState(false);

  async function loadData() {
    try {
      const name = await getName();
      const owner = await getOwner();
      const isAccountMember = account
        ? await isHasRole(account, JURISDICTION_ROLE.member)
        : null;
      const isAccountJudge = account
        ? await isHasRole(account, JURISDICTION_ROLE.judge)
        : null;
      const isAccountAdmin = account
        ? await isHasRole(account, JURISDICTION_ROLE.admin)
        : null;
      setData({
        name: name,
        owner: owner,
        isAccountMember: isAccountMember,
        isAccountJudge: isAccountJudge,
        isAccountAdmin: isAccountAdmin,
      });
    } catch (error) {
      showToastError(error);
    }
  }

  async function joinOrLeave() {
    try {
      setIsJoiningOrLeaving(true);
      let transaction;
      if (data.isAccountMember) {
        transaction = await leave();
      } else {
        transaction = await join();
      }
      showToastSuccess('Success! Data will be updated soon.');
      await transaction.wait();
      await loadData();
    } catch (error) {
      showToastError(error);
    } finally {
      setIsJoiningOrLeaving(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Jurisdiction
      </Typography>
      <Divider sx={{ mb: 3 }} />
      {data ? (
        <>
          <Typography gutterBottom>
            <b>Name: </b>
            {data.name}
          </Typography>
          <Typography gutterBottom>
            <b>Owner: </b>
            {formatAccount(data.owner)}
          </Typography>
          {account && (
            <>
              <Typography gutterBottom>
                <b>Account is member: </b>
                {data.isAccountMember ? 'yes' : 'no'}
              </Typography>
              <Typography gutterBottom>
                <b>Account is judge: </b>
                {data.isAccountJudge ? 'yes' : 'no'}
              </Typography>
              <Typography gutterBottom>
                <b>Account is admin: </b>
                {data.isAccountAdmin ? 'yes' : 'no'}
              </Typography>
              <Box sx={{ mt: 3 }}>
                {isJoiningOrLeaving ? (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    startIcon={<Save />}
                    variant="outlined"
                  >
                    {data.isAccountMember ? 'Leaving' : 'Joining'}
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={joinOrLeave}
                  >
                    {data.isAccountMember ? 'Leave' : 'Join'}
                  </Button>
                )}
              </Box>
            </>
          )}
        </>
      ) : (
        <>
          <Skeleton
            variant="rectangular"
            height={24}
            width={256}
            sx={{ mb: 1 }}
          />
          <Skeleton variant="rectangular" height={24} width={256} />
        </>
      )}
    </>
  );
}
