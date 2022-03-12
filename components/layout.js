import Head from 'next/head'
import Link from 'next/link'
import styles from './layout.module.css'

export default function Layout({ children, isIndex, title }) {
  return <div className={styles.container}>

    <Head>
      <title>{title ? title : "YourJustice"}</title>
      <meta name="description" content="Decentralized Reputation & Justice System for Web3 & Real World Issues" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main>
      {children}
    </main>

    {!isIndex && (
      <div className={styles.backToHome}>
        <Link href="/">
          <a>← Back to home</a>
        </Link>
      </div>
    )}

  </div>
}