import React, { ComponentType } from 'react';

const withProps = (Component: ComponentType<any>, extraProps: Object) => {
  return (props: any) => {
    return <Component { ...{ ...props, ...extraProps } } />;
  };
};

export default withProps;