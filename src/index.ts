import { Form, Dictionary, Fns, Errors } from './defs';

const buildError = (reason: string, message: string): Error => {
  return new Error(`[${reason}]: ${message}`);
};

const validateValuesShape = (values: any): void => {
  if (!values || Array.isArray(values) || typeof values !== 'object') {
    throw buildError('values shape', 'Values parameter must be an object');
  }
};

const generateErrors = <V extends Dictionary>(values: V, fns: Fns<V>): Errors<V> => {
  const keys = Object.keys(values);

  return keys.reduce((acc, key): Errors<V> => {
    const value = values[key];
    const valueFns = fns[key];

    return {
      ...acc,
      [key]: Array.isArray(valueFns) ? valueFns.some((fn) => fn(value)) : false,
    };
  }, {} as Errors<V>);
};

export const form = <V extends Dictionary>(initValues: V, fns: Fns<V> = {}): Form<V> => {
  validateValuesShape(initValues);

  let values = { ...initValues };
  let errors = generateErrors(values, fns);
  let invalid = Object.keys(errors).some((key) => errors[key]);
  let dirty = false;
  let touched = false;

  return {
    values,
    errors,
    invalid,
    fns,
    dirty,
    touched,
  } as any;
};
