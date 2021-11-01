export type Action<T = any> = {
  type: string,
  payload?: T,
};

export type ActionFunction<T = any> = (param: T) => Action<T>;
