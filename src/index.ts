import { Form, Dictionary } from './defs';

const buildError = (reason: string, message: string): Error => {
  return new Error(`[${reason}]: ${message}`);
};

const validateValuesShape = (values: any): void => {
  if (!values || typeof values !== 'object') {
    throw buildError('values shape', 'Values parameter must be an object');
  }
};

export const form = <V extends Dictionary>(values: V, fns?: any): Form<V> => {
  validateValuesShape(values);

  return form<V>(values, fns);
};
