import { Typography } from '@mui/material'
import Link from 'next/link'
import Layout from '../components/layout'

export default function Index() {
  return (
    <Layout isIndex={true}>

      <Typography variant='h3' gutterBottom={true}>Welcome to Main Page!</Typography>

      <Typography>
        <Link href="/profile">
          <a>Profile page</a>
        </Link>
      </Typography>

    </Layout>
  )
}
