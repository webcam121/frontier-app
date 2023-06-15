import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useState } from 'react';
import Router from 'next/router'

import { TokenService } from '../components/core/api-services/token.service';
import useAlert from '../components/ui-kit/dialog/use-alert';
import Layout from '../components/layout/layout';
import Spinner from '../components/ui-kit/common/spinner';

const AddToken: NextPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const alertService = useAlert();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const data = {
      title: event.target.title.value,
      description: event.target.description.value,
      image_url: event.target.image_url.value,
    };

    try {
      setIsLoading(true);
      await TokenService.createToken(data);
      Router.push('/token');
    } catch (ex: any) {
      await alertService.notify('Request Failed', ex.message || 'Request failed. Please try again.', 'Ok');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = useCallback(() => {
    Router.push('/token');
  }, []);

  return (
    <>
      <Head>
        <title>Frontier: Add Token</title>
        <meta name="description" content="Frontier Test Project from Jie Li."/>
      </Head>
      <Layout>
        <div className="container mx-auto">
          <h1 className="text-center pt-50 text-24 font-bold text-primary">Create New Token</h1>
          <form onSubmit={handleSubmit}>
            <div className="py-50 flex flex-col items-center">
                <p className="text-light-400 mb-10">Title of token:</p>
                <input name="title" className="border border-light-200 rounded text-light-400 w-full sm:w-400 mb-30 px-10" placeholder="Type Token Title" required/>
                <p className="text-light-400 mb-10">Description of token:</p>
                <textarea name="description" className="border border-light-200 rounded text-light-400 w-full sm:w-400 mb-30 px-10" placeholder="Type Token Description" required/>
                <p className="text-light-400 mb-10">Description of token:</p>
                <input name="image_url" className="border border-light-200 rounded text-light-400 w-full sm:w-400 mb-30 px-10" placeholder="Type Token Image URI" required/>
                <div>
                  <button className="btn-warning btn-mini mr-10">Submit</button>
                  <button className="btn-danger btn-mini" onClick={handleBack}>Back</button>
                </div>
            </div>
          </form>
        </div>
        <Spinner isLoading={isLoading} />
      </Layout>
    </>
  )
}

export default AddToken
