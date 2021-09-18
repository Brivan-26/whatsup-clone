import Head from 'next/head'
import Image from 'next/image'
import SideBar from '../components/SideBar.jsx';
import NoChat from '../components/NoChat.jsx';
export default function Home() {
  return (
    <div className="app">
      <Head>
        <title>What's Up Clone</title>
        <meta name="description" content="The what's up clone" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/*SideBar*/}
      <SideBar />

      <NoChat />

    {/*Chat */}
  {/*No existing chat!*/}
    </div>
  )
}
