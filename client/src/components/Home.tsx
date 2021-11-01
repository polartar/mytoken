import React from 'react';
import { connect } from 'react-redux';
import {
  useHistory,
} from 'react-router-dom';

import {
  Card,
  Button,
} from 'react-bootstrap';

import Content from '../shared/components/Content';
import { TokenizeActions, tokenizeActions } from '../redux/tokenize';

import './Home.scss';

type Props = TokenizeActions;

const Home = (props: Props) => {
  const { resetTokenDetails } = props;
  const history = useHistory();

  const tokenizeNow = () => {
    resetTokenDetails();
    history.push( '/tokenize' );
  };

  return (
    <div className='home'>
      <Content />
      <Card style={ { border: 'none', background: '#f8faff', margin: '20px 10px' } }>
        <h3 className='mt-5'>Start Tokenizing Your Assets Today</h3>
      </Card>
      <Button className='tokenize-now' variant='primary' onClick={ tokenizeNow }>Tokenize Now!</Button>
    </div>
  );
};

export { Home as PureHome }; // Pure component, for testing
export default connect( null, { ...tokenizeActions } )( Home );
