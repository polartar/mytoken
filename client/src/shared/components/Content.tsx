import React from 'react';

import {
  Carousel,
} from 'react-bootstrap';

import './Content.scss';

const Content = () => {
  return (
    <Carousel slide={ false }>
      <Carousel.Item>
        <Carousel.Caption>
          <div className='title'>
            <h1>Welcome to the Self Tokenization Platform</h1>
            <h3 className='mt-4'>Securely Tokenize your assets on the blockchain</h3>
          </div>
          <h2 className='mt-5'>Tokenize real world assets</h2>
          <h4 className='mb-5'>Securely and transparently</h4>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Carousel.Caption>
          <div className='title'>
            <h1>Welcome to the Self Tokeninzation Platform</h1>
            <h3 className='mt-4'>Securely Tokenize your assets on the blockchain</h3>
          </div>
          <h2 className='mt-5'>From real estate to art and more</h2>
          <h4 className='mb-5'>Safely and easily harness the benefits of blockchain</h4>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <Carousel.Caption>
          <div className='title'>
            <h1>Welcome to the Self Tokeninzation Platform</h1>
            <h3 className='mt-4'>Securely Tokenize your assets on the blockchain</h3>
          </div>
          <h2 className='mt-5'>Broaden the investment base for your assets</h2>
          <h4 className='mb-5'>Improve liquidity through a frictionless environment</h4>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
};

export default Content;
