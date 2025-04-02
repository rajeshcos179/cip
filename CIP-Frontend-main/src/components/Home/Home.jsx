import React from 'react';
import TitleBar from '../TitleBar/TitleBar';
import Hero from '../Hero/Hero';

const Home = () => {
  return (
    <div className='overflow-x-hidden'>
     <TitleBar />
     <Hero></Hero>
    </div>
  )
}

export default Home