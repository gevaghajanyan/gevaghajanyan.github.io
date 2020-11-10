import React, { useEffect } from 'react';
import Head from 'next/head'

import { Header } from '../src/components/header';
import { Main } from '../src/components/main';
import { Skills } from '../src/components/skills';
import { ToolsAndTechnologies } from '../src/components/toolsAndTechnologies';
import { IndustryKnowledge } from '../src/components/industryKnowledge';
import { Responsibility } from '../src/components/responsibility';
import { Footer } from '../src/components/footer';
import { Interests } from '../src/components/interests';
import { useUserService } from '../src/hooks/useUserService';
import { userService } from '../src/service/UserService';

const Home = () => {
  const { loading } = useUserService();

  useEffect(() => {
    userService.getUserInfo();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      <Head>
        <title>
          Gevorg Aghajanyan CV
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
      <Skills />
      <ToolsAndTechnologies />
      <IndustryKnowledge />
      <Responsibility />
      <Interests />
      <Footer />
    </>
  );
};

export default Home;
