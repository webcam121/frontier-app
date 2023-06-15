import type { NextPage } from 'next'
import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head'
import Router from 'next/router'
import Link from 'next/link';

import Layout from '../components/layout/layout';
import { TokenResponse } from '../components/core/types/token';
import { TokenService } from '../components/core/api-services/token.service';
import useAlert from '../components/ui-kit/dialog/use-alert';
import Icon from '../components/ui-kit/icon';

const Token: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenResponse[]>([]);
  const alertService = useAlert();

  const handleNewTokenButton = useCallback(() => {
    Router.push('/add-token');
  }, []);

  const deleteToken = useCallback(async (id: string) => {
    setIsLoading(true);
    TokenService.deleteToken({ id }).then((info: TokenResponse) => {
      getTokenList();
    }).catch(async (ex) => {
      await alertService.notify('Request Failed', ex.message || 'Request failed. Please try again.', 'Ok');
    }).finally(() => {
      setIsLoading(false);
    })
  }, [alertService]);

  const getTokenList = useCallback(async () => {
    setIsLoading(true);
    TokenService.getTokens().then((info: TokenResponse[]) => {
      setTokens(info);
    }).catch(async (ex) => {
      await alertService.notify('Request Failed', ex.message || 'Request failed. Please try again.', 'Ok');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [alertService]);

  useEffect(() => {
    getTokenList();
  }, []);

  return (
    <>
      <Head>
        <title>Frontier: Token</title>
        <meta name="description" content="Frontier Test Project from Jie Li."/>
      </Head>
      <Layout>
        <div className="container mx-auto">
          <section className="relative pb-100">
            <h1 className="text-center pt-50 pb-20 text-24 font-bold text-primary">Token List</h1>
            <button className="btn-primary btn-mini mb-30 mx-10" onClick={handleNewTokenButton}>Add New Token</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tokens.map((item, index) => (
                <div key={index} className="overflow-hidden rounded m-10 pb-20 shadow-warning relative">
                  <img src={item.image_url} alt={item.title}/>
                  <p className="bold text-20 pt-15 text-center text-light-400">{item.title}</p>
                  <p className="text-16 py-5 px-20 text-light-300 text-ellipsis overflow-hidden text-justify">{item.description}</p>
                  <div className="absolute top-0 left-0 w-full h-full bg-light-100 opacity-0 hover:opacity-90 flex justify-center items-center">
                    <div>
                      <Link href={{ pathname: '/update-token', query: { id: item.id }}} passHref><span className="cursor-pointer mr-20"><Icon name="edit" size={30} /></span></Link>
                      <span onClick={() => deleteToken(item.id)} className="cursor-pointer"><Icon name="trash" size={30} /></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </>
  )
}

export default Token
