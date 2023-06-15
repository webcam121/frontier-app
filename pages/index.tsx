import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import Layout from '../components/layout/layout';

const Home: NextPage = () => {
  const why_us = [
    {
      image: "/assets/images/why-us/secure.png",
      title: "Unlock unlimited",
      content: "Stream, work and game with no data caps or overage charges.",
    },
    {
      image: "/assets/images/why-us/skin.png",
      title: "Activate for free",
      content: "Save up to $85 on activation. Get expert installation as soon as tomorrow.⁠[1]",
    },
    {
      image: "/assets/images/why-us/education.png",
      title: "Connect it all",
      content: "An Ultrafast Wi-Fi 6E System is included for total-home connection.",
    }
  ];

  return (
    <>
      <Head>
        <title>Frontier Test Project</title>
        <meta name="description" content="Frontier Test Project from Jie Li."/>
      </Head>
      <Layout>
        <section className="relative">
          <div className="h-700 overflow-auto">
            <h1 className="text-center py-50 text-24 font-bold">Why Frontier?</h1>
            <div className="md:flex items-start justify-center px-20 lg:px-100">
              {why_us.map((item, index) => (
                <div key={index} className="flex flex-col items-center p-15 md:w-1/3">
                  <Image src={item.image} width={150} height={150} alt={item.title}/>
                  <p className="py-15 text-20 font-bold text-warning">{item.title}</p>
                  <p className="text-light-400">{item.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}

export default Home
