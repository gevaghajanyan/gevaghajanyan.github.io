import React, { useEffect, useState } from 'react';
import Head from 'next/head';

import { Header } from '../src/components/header';
import { Summary } from '../src/components/summary';
import { Main } from '../src/components/main';
import { ToolsAndTechnologies } from '../src/components/toolsAndTechnologies';
import { IndustryKnowledge } from '../src/components/industryKnowledge';
import { Footer } from '../src/components/footer';
import { Interests } from '../src/components/interests';
import { SpaceShooterGame } from '../src/components/spaceShooter';
import { useUserService } from '../src/hooks/useUserService';
import { userService } from '../src/service/UserService';

const Home: React.FC = () => {
  const { loading } = useUserService();
  const [gameOpen, setGameOpen] = useState(false);

  useEffect(() => {
    userService.getUserInfo();
  }, []);

  if (loading) return null;

  return (
    <>
      <Head>
        <title>Gevorg Aghajanyan — Senior Software Engineer</title>
        <meta name='description' content='Senior Software Engineer with 8+ years of experience in React, TypeScript, and high-performance web engineering. Based in Yerevan, Armenia.' />

        {/* Favicon */}
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon.png' />
        <link rel='icon' type='image/x-icon' href='/favicon.ico' />

        {/* Open Graph */}
        <meta property='og:type' content='website' />
        <meta property='og:url' content='https://gevaghajanyan.github.io/' />
        <meta property='og:title' content='Gevorg Aghajanyan — Senior Software Engineer' />
        <meta property='og:description' content='Senior Software Engineer with 8+ years of experience in React, TypeScript, and high-performance web engineering. Based in Yerevan, Armenia.' />
        <meta property='og:image' content='https://gevaghajanyan.github.io/assets/logo-400.png' />
        <meta property='og:image:width' content='400' />
        <meta property='og:image:height' content='400' />

        {/* Twitter Card */}
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:title' content='Gevorg Aghajanyan — Senior Software Engineer' />
        <meta name='twitter:description' content='Senior Software Engineer with 8+ years of experience in React, TypeScript, and high-performance web engineering. Based in Yerevan, Armenia.' />
        <meta name='twitter:image' content='https://gevaghajanyan.github.io/assets/logo-400.png' />
      </Head>

      <Header />
      <Summary />
      <Main />
      <ToolsAndTechnologies />
      <IndustryKnowledge />
      <Interests />
      <Footer onGame={() => setGameOpen(true)} />

      {gameOpen && <SpaceShooterGame onClose={() => setGameOpen(false)} />}
    </>
  );
};

export default Home;
