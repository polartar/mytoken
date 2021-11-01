import React, { FunctionComponent } from 'react';
import { Row } from 'react-bootstrap';
import classNames from 'classnames';

type Props = {
  title: string,
  className?: string,
};

export const ReviewSection: FunctionComponent<Props> = ({ title, className, children }) => {
  return (
    <Row className={ classNames('section', className) }>
      <div className='section-title'>{ title }</div>
      { children }
    </Row>
  );
};
