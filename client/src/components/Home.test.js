import React from 'react';
import renderer from 'react-test-renderer';

import { PureHome as Home } from './Home';

describe('Home', () => {
  let props;

  beforeEach(() => {
    props = {
      resetTokenDetails: jest.fn(),
    };
  });
  
  it('renders without crashing', () => {
    const component = renderer.create(<Home {...props}/>);
    expect(component.toJSON()).toMatchSnapshot();
  });
});
