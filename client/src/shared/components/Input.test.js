import React from 'react';
import renderer from 'react-test-renderer';

import Input from './Input';

describe('Input', () => {
  let props;

  beforeEach(() => {
    props = {
      id: 'test',
      resetTokenDetails: jest.fn(),
    };
  });
  
  it('renders without crashing', () => {
    const component = renderer.create(<Input {...props}/>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
