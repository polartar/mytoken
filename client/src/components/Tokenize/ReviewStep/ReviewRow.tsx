import React from 'react';
import { Col, Row } from 'react-bootstrap';

type Props = {
  label: string,
  value: string,
};

export const ReviewRow = ({ label, value }: Props) => {
  return (
    <Row className='review-row'>
      <Col xs={ 5 } className='label'>{ label }:</Col>
      <Col xs={ 7 } className='value'>{ value }</Col>
    </Row>
  );
};
