import Image from 'next/image'
import Link from 'next/link'
import Layout from '../components/layout'
import styles from '../styles/index.module.css'

export default function Index() {
  return (
    <Layout isIndex={true}>

      <main className={styles.main}>
        <h1>
          Welcome to Main Page!
        </h1>
        <p>
          Go to{' '}
          <Link href="/profile">
            <a>profile page</a>
          </Link>
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.yourjustice.life/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.logo}>
            <Image src="/images/logo.svg" alt="YourJustice Logo" width={120} height={16} />
          </span>
        </a>
      </footer>
    </Layout>
  )
}
