import { InsertPhotoOutlined } from '@mui/icons-material';
import { Avatar, Backdrop, CircularProgress, Divider, Typography } from '@mui/material';
import Layout from 'components/layout/Layout';
import useIpfs from 'hooks/useIpfs';
import useSubgraph from "hooks/useSubgraph";
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

export default function Profile() {

  const router = useRouter()
  const { queryAccount } = router.query;
  const { enqueueSnackbar } = useSnackbar();
  const { findAvatarNftEntityByAccount } = useSubgraph();
  const { loadJsonFromIPFS } = useIpfs();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  async function loadData() {
    try {
      const avatarNftEntity = await findAvatarNftEntityByAccount(queryAccount);
      const avatarNftMetadata = await loadJsonFromIPFS(avatarNftEntity.tokenUri);
      setData(avatarNftMetadata);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Oops, error: ${error}`, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (queryAccount) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryAccount])

  return (
    <Layout title={"YourJustice / Profile"}>
      {!isLoading && (
        <>
          <Typography variant='h4' gutterBottom>Profile</Typography>
          <Divider />
          <Avatar sx={{ width: 128, height: 128, margin: '1.5rem 0rem' }} src={data.pictureIpfsUrl ? data.pictureIpfsUrl : null}>
            <InsertPhotoOutlined />
          </Avatar>
          <Typography gutterBottom><b>First Name: </b>{data.firstName || "none"}</Typography>
          <Typography gutterBottom><b>Second Name:</b> {data.secondName || "none"}</Typography>
          <Typography gutterBottom><b>Email: </b> {data.email || "none"}</Typography>
        </>
      )}
      {isLoading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open>
          <CircularProgress />
        </Backdrop>
      )}
    </Layout>
  )

}