import React from 'react';
import { connect } from 'react-redux';

import {
  Container,
  Image,
  Button,
  Card,
  CardGroup
} from 'react-bootstrap';
import tokenDetails, { TokenDetails } from '../redux/tokenize';
import { RootStore } from '../redux/rootReducer';

//import { Contract } from 'web3-eth-contract';
import { Web3Store } from '../redux/web3';

type Props = {
  tokenDetails: TokenDetails,
  web3: Web3Store,
};


// const AddToken = ( tokenAddress: string, props: Props) => {
//   const ethereum = window.web3.currentProvider;
//   const { contract } = props;
//   const tokenDetails = contract.tokenContract(tokenAddress).call();
//   const tokenSymbol = tokenDetails.symbol;
//   const tokenImage = 'http://placekitten.com/200/300';
//   ethereum.sendAsync({
//     method: 'wallet_watchAsset',
//     params: {
//       type: 'ERC20',
//       options: {
//         address: tokenAddress,
//         symbol: tokenSymbol,
//         decimals: 18,
//         image: tokenImage,
//       },
//     },
//       id: Math.round( Math.random() * 100000 ),
//     },
//     ( err: any, added: any ) => {
//       if (added) {
//         console.log('Successfully added!', added);
//       } else {
//         console.log('Token not added!', err);
//       }
//     }
//   );
//}

const TokenConfirmation = ( props: Props ) => {
  const {
    tokenDetails,
    web3,
    } = props;

  const accounts = Object.values( web3 )[ 1 ];
  // const tokenAddresses = contract.methods.getTokenAddresses(accounts).call();
  // console.log(tokenAddresses);

  if ( !accounts ) {
    return (
      <Container>
        <Container style={ { height: '35vh' }}>
          <h1 className='mt-5'>Your Tokens are Ready!</h1>
          <h2 className='mt-5'>Thanks for trusting tokenizer.</h2>
          <h2 className='mb-5'>We've trasfered { tokenDetails.supply } { tokenDetails.symbol } to</h2>
          <h3 className='border border-info rounded-lg' style={ { display: 'inline-block' } }>{ tokenDetails.ownerETHAddress }</h3>
        </Container>
        <Container className='bg-container' style={ { height: '40vh' } }>
          <h1 style={ { margin: '50px 0px' } }>You will need Metamask for the next steps</h1>
          <h3>Follow the link below to install the Metamask browser extension.</h3>
          <h3 className='mb-5'>Once done, come back to this tab.</h3>
          <a href='https://metamask.io/download.html' target='_blank' rel='noopener noreferrer'><Image src='https://metamask.github.io/Add-Token/static/media/download-metamask.14c35a62.png' height='75' /></a>
        </Container>
      </Container>
    );
  }

  return (
    <Container>
      <Container style={ { height: '35vh' } }>
        <h1 className='mt-5'>Your Tokens are Ready!</h1>
        <h2 className='mt-5'>Thanks for trusting tokenizer.</h2>
        <h2 className='mb-5'>We've trasfered { tokenDetails.supply } { tokenDetails.symbol } to</h2>
        <h3 className='border rounded-lg' style={ { display: 'inline-block', padding: '10px' } }>{ tokenDetails.ownerETHAddress }</h3>
      </Container>
      <Container className='bg-container' style={ { height: '40vh' }}>
        <h1 style={ { margin: '50px 0px' }}>Next Steps</h1>
        <CardGroup style={ { background: 'transparent' } } >
          <Card style={ { background: 'inherit', border: 'none' } } >
            <a href='localhost:3000/confirm'><Image src='https://metamask.io/images/mm-logo.svg' height='75' /></a>
            <h4 className='mt-4'>Add token to Metamask Wallet</h4>
          </Card>
          <Card style={ { background: 'inherit', border: 'none' } } >
            <Button disabled size='lg' style={ { margin: '0px 225px' } } >Admin Panel</Button>
            <h4 className='mt-5'>Go to Admin panel</h4>
          </Card>
        </CardGroup>
      </Container>
    </Container>
  );

};

const mapStateToProps = ( state: RootStore ) => {
  const { tokenDetails, web3 } = state;
  return { tokenDetails, web3 };
};

export default connect( mapStateToProps, { ...tokenDetails })( TokenConfirmation );
