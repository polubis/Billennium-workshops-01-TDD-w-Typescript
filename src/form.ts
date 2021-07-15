import { formBuilder } from './formBuilder';
import { CheckResult, Dictionary, Errors, Fns } from './defs';

const booleanStrategy = <V extends Dictionary, R = boolean>(
  values: V,
  fns: Fns<V, R>,
): CheckResult<V, R> => {
  const keys = Object.keys(values);

  const errors = keys.reduce((acc, key): Errors<V, R> => {
    const value = values[key];
    const valueFns = fns[key];

    return {
      ...acc,
      [key]: Array.isArray(valueFns) ? valueFns.some((fn) => fn(value)) : false,
    };
  }, {} as Errors<V, R>);
  const invalid = keys.some((key) => errors[key]);

  return {
    errors,
    invalid,
  };
};

export const form = formBuilder<boolean>(booleanStrategy);
