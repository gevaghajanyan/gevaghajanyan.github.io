import React, { useEffect } from 'react';
import Head from 'next/head';

import { Header } from '../src/components/header';
import { Summary } from '../src/components/summary';
import { Main } from '../src/components/main';
import { ToolsAndTechnologies } from '../src/components/toolsAndTechnologies';
import { IndustryKnowledge } from '../src/components/industryKnowledge';
import { Footer } from '../src/components/footer';
import { Interests } from '../src/components/interests';
import { useUserService } from '../src/hooks/useUserService';
import { userService } from '../src/service/UserService';

const Home: React.FC = () => {
  const { loading } = useUserService();

  useEffect(() => {
    userService.getUserInfo();
  }, []);

  if (loading) return null;

  return (
    <>
      <Head>
        <title>Gevorg Aghajanyan — Senior Software Engineer</title>
        <meta name='description' content='Senior Software Engineer specialising in React, TypeScript, and high-performance web applications.' />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />
        <meta property='og:title' content='Gevorg Aghajanyan — Senior Software Engineer' />
        <meta property='og:image' content='/assets/logo.png' />
      </Head>
      <Header />
      <Summary />
      <Main />
      <ToolsAndTechnologies />
      <IndustryKnowledge />
      <Interests />
      <Footer />
    </>
  );
};

export default Home;
