import React from 'react';
import Head from 'next/head'

import { Header } from '../src/components/header';
import { Main } from '../src/components/main';
import { Skills } from '../src/components/skills';
import { ToolsAndTechnologies } from '../src/components/toolsAndTechnologies';
import { IndustryKnowledge } from '../src/components/industryKnowledge';
import { Responsibility } from '../src/components/responsibility';
import { Footer } from '../src/components/footer';

const Home = () => (
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
    <Footer />
  </>
);

export default Home;
